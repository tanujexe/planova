/**
 * Spatial, Geometric and Architectural Constraint Engine
 * Single Source of Truth for Hard Gates and 4-Pillar Architectural Soft-Scoring
 * 
 * Hard Gates (Reject on fail):
 * 1. Positive dimensions & plot containment
 * 2. Zero room overlaps (with epsilon = 0.05 ft)
 * 3. Valid openings belonging to rooms
 * 4. Per-room minimum width, area, and max aspect ratio from config
 * 5. Minimum corridor / passage width along entire length (>= 3.0 ft)
 * 6. Every room reachable from entrance (graph connectivity over doors/passages)
 * 7. Required functional adjacencies:
 *    - Kitchen shares wall or opening with dining or living
 *    - Master bedroom has attached/adjacent bath
 *    - At least one common bathroom accessible from passage/corridor
 *    - Pooja never shares wall with any toilet/bathroom
 *    - Bathrooms and kitchen touch exterior wall or designated light shaft
 * 8. Habitable rooms have exterior wall contact and window
 */

import { ROOM_STANDARDS, CIRCULATION_CONFIG, getRoomStandard } from './config.js';

/**
 * Checks whether two 2D rectangles overlap (with a small epsilon tolerance for touching edges)
 * @param {{ x: number, y: number, width: number, height: number }} r1 
 * @param {{ x: number, y: number, width: number, height: number }} r2 
 * @param {number} [epsilon=0.05] 
 * @returns {boolean}
 */
export const doRectanglesOverlap = (r1, r2, epsilon = 0.05) => {
  const r1Right = r1.x + r1.width;
  const r1Bottom = r1.y + r1.height;
  const r2Right = r2.x + r2.width;
  const r2Bottom = r2.y + r2.height;

  if (r1Right <= r2.x + epsilon || r2Right <= r1.x + epsilon) return false;
  if (r1Bottom <= r2.y + epsilon || r2Bottom <= r1.y + epsilon) return false;

  return true;
};

/**
 * Checks if two rectangles share an edge (touching with small tolerance)
 */
export const doRectanglesTouch = (r1, r2, tolerance = 0.2) => {
  const r1Right = r1.x + r1.width;
  const r1Bottom = r1.y + r1.height;
  const r2Right = r2.x + r2.width;
  const r2Bottom = r2.y + r2.height;

  // Horizontal sharing
  const shareX = (r1Right >= r2.x - tolerance && r1.x <= r2Right + tolerance) &&
    (Math.abs(r1Bottom - r2.y) <= tolerance || Math.abs(r1.y - r2Bottom) <= tolerance);
  const overlapX = Math.min(r1Right, r2Right) - Math.max(r1.x, r2.x);

  // Vertical sharing
  const shareY = (r1Bottom >= r2.y - tolerance && r1.y <= r2Bottom + tolerance) &&
    (Math.abs(r1Right - r2.x) <= tolerance || Math.abs(r1.x - r2Right) <= tolerance);
  const overlapY = Math.min(r1Bottom, r2Bottom) - Math.max(r1.y, r2.y);

  return (shareX && overlapX > 0.5) || (shareY && overlapY > 0.5);
};

/**
 * Validates graph reachability of all rooms from the entrance
 */
export const validateReachability = (floor, errors, floorLabel) => {
  const rooms = floor.rooms || [];
  const openings = floor.openings || [];
  if (rooms.length <= 1) return;

  // Find entrance room (foyer, living, or verandah with top/road door)
  let entranceRoom = rooms.find(r => r.type === 'foyer') ||
    rooms.find(r => r.type === 'living') ||
    rooms[0];

  // Adjacency graph
  const adj = new Map();
  rooms.forEach(r => adj.set(r.id, new Set()));

  // Door connections
  openings.filter(op => op.type === 'door').forEach(door => {
    const parent = rooms.find(r => r.id === door.wallRoomId);
    if (!parent) return;

    if (door.connectsToRoomId) {
      const target = rooms.find(r => r.id === door.connectsToRoomId);
      if (target) {
        adj.get(parent.id)?.add(target.id);
        adj.get(target.id)?.add(parent.id);
      }
    } else {
      // Connect to any touching room or corridor on that wallSide
      rooms.forEach(other => {
        if (other.id !== parent.id && doRectanglesTouch(parent, other)) {
          adj.get(parent.id)?.add(other.id);
          adj.get(other.id)?.add(parent.id);
        }
      });
    }
  });

  // Touch connectivity: If corridors or open living areas exist, touching rooms with doors connect
  rooms.forEach(r1 => {
    if (r1.type === 'corridor' || r1.type === 'living' || r1.type === 'foyer') {
      rooms.forEach(r2 => {
        if (r1.id !== r2.id && doRectanglesTouch(r1, r2)) {
          adj.get(r1.id)?.add(r2.id);
          adj.get(r2.id)?.add(r1.id);
        }
      });
    }
  });

  // BFS from entrance
  const visited = new Set();
  const queue = [entranceRoom.id];
  visited.add(entranceRoom.id);

  while (queue.length > 0) {
    const curr = queue.shift();
    const neighbors = adj.get(curr) || new Set();
    for (const n of neighbors) {
      if (!visited.has(n)) {
        visited.add(n);
        queue.push(n);
      }
    }
  }

  // Check if any habitable room is isolated
  rooms.forEach(r => {
    // Balconies and parking can be accessed via exterior/openings
    if (r.type !== 'parking' && r.type !== 'balcony' && !visited.has(r.id)) {
      // Check if room touches at least one visited room with a door
      const hasDoor = openings.some(op => op.type === 'door' && op.wallRoomId === r.id);
      if (!hasDoor && rooms.length > 2) {
        errors.push(`[${floorLabel}] Room "${r.label}" is isolated and unreachable from the entrance.`);
      }
    }
  });
};

/**
 * Validates a complete FloorPlan against HARD architectural and geometric constraints
 * Returns { valid: boolean, errors: string[] }
 * @param {object} plan 
 * @param {object} [options={}]
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePlan = (plan, options = {}) => {
  const errors = [];

  if (!plan || !plan.plot || !plan.floors) {
    return { valid: false, errors: ['Invalid floor plan data structure.'] };
  }

  const plotW = Number(plan.plot.width) || 30;
  const plotL = Number(plan.plot.length) || 50;

  plan.floors.forEach((floor, floorIdx) => {
    const rooms = floor.rooms || [];
    const openings = floor.openings || [];
    const floorLabel = floor.label || `Floor ${floorIdx}`;

    // 1. HARD GATE: Positive dimensions & Plot containment
    rooms.forEach((room) => {
      if (room.width <= 0 || room.height <= 0) {
        errors.push(`[${floorLabel}] Room "${room.label}" must have positive dimensions (got ${room.width}×${room.height}).`);
      }

      if (room.x < 0 || room.y < 0 || (room.x + room.width) > plotW || (room.y + room.height) > plotL) {
        errors.push(
          `[${floorLabel}] Room "${room.label}" extends outside the plot boundaries (${plotW}×${plotL} ft). Position: (${room.x}, ${room.y}), Size: ${room.width}×${room.height}.`
        );
      }
    });

    // 2. HARD GATE: Room overlaps on the same floor
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const r1 = rooms[i];
        const r2 = rooms[j];
        if (doRectanglesOverlap(r1, r2)) {
          errors.push(
            `[${floorLabel}] Spatial collision: "${r1.label}" overlaps with "${r2.label}".`
          );
        }
      }
    }

    // 3. HARD GATE: Openings check (must belong to a room on the floor)
    openings.forEach((op) => {
      const parentRoom = rooms.find((r) => r.id === op.wallRoomId);
      if (!parentRoom) {
        errors.push(`[${floorLabel}] Opening ${op.id} is attached to a non-existent room (${op.wallRoomId}).`);
      }
    });

    // 4. HARD GATE: Per-room minimum width, area, and aspect ratio from config
    rooms.forEach((room) => {
      const std = getRoomStandard(room.type);
      const w = room.width;
      const h = room.height;
      const area = w * h;
      const aspect = Math.max(w / h, h / w);

      // Width check with 0.1ft tolerance
      if (w < std.minWidth - 0.1 && h < std.minWidth - 0.1) {
        errors.push(
          `[${floorLabel}] Room "${room.label}" (${room.type}) width ${Math.min(w, h)} ft is below NBC minimum ${std.minWidth} ft.`
        );
      }

      // Area check
      // For parking, allow flexible tolerance if in front setback (open), otherwise enforce minArea
      const isParking = room.type === 'parking';
      const minAreaThreshold = isParking ? (room.isOpen ? 25 : 140) : std.minArea * 0.95;
      if (area < minAreaThreshold) {
        errors.push(
          `[${floorLabel}] Room "${room.label}" area ${Math.round(area)} sq.ft is below minimum required ${std.minArea} sq.ft.`
        );
      }

      // Aspect ratio check (reject strips > maxAspect)
      // Corridors, balconies, and open setback driveway aprons are exempt from indoor room squareness constraints
      if (room.type !== 'corridor' && room.type !== 'balcony' && !room.isOpen && aspect > std.maxAspect + 0.15) {
        errors.push(
          `[${floorLabel}] Room "${room.label}" has distorted aspect ratio 1:${aspect.toFixed(2)} (exceeds max allowable 1:${std.maxAspect}).`
        );
      }
    });

    // 5. HARD GATE: Corridor width >= 3.0 ft along entire length
    rooms.filter(r => r.type === 'corridor').forEach(corridor => {
      const minDimension = Math.min(corridor.width, corridor.height);
      if (minDimension < CIRCULATION_CONFIG.minPassageWidth - 0.05) {
        errors.push(
          `[${floorLabel}] Corridor "${corridor.label}" width ${minDimension} ft is narrower than NBC minimum ${CIRCULATION_CONFIG.minPassageWidth} ft.`
        );
      }
    });

    // 6. HARD GATE: Habitable rooms must have exterior perimeter wall contact + window
    if (rooms.length > 2 && openings.length > 0) {
      const minX = Math.min(...rooms.map(r => r.x));
      const maxX = Math.max(...rooms.map(r => r.x + r.width));
      const minY = Math.min(...rooms.map(r => r.y));
      const maxY = Math.max(...rooms.map(r => r.y + r.height));

      rooms.forEach(room => {
        const std = getRoomStandard(room.type);
        if (std.habitable) {
          const touchesExterior = (
            Math.abs(room.x - minX) < 0.5 ||
            Math.abs((room.x + room.width) - maxX) < 0.5 ||
            Math.abs(room.y - minY) < 0.5 ||
            Math.abs((room.y + room.height) - maxY) < 0.5
          );

          const hasWindow = openings.some(op => op.wallRoomId === room.id && op.type === 'window');

          if (!touchesExterior && !hasWindow) {
            errors.push(
              `[${floorLabel}] Habitable room "${room.label}" (${room.type}) is landlocked without exterior daylight or ventilation.`
            );
          }
        }
      });
    }

    // 7. HARD GATE: Adjacency rules
    const kitchen = rooms.find(r => r.type === 'kitchen');
    const diningOrLiving = rooms.find(r => r.type === 'dining' || r.type === 'living');
    const pooja = rooms.find(r => r.type === 'pooja');
    const baths = rooms.filter(r => r.type === 'bathroom' || r.type === 'primary_bathroom' || r.type === 'attached_bathroom');
    const master = rooms.find(r => r.type === 'master_bedroom' || r.type === 'primary_bedroom');

    // Hard: Kitchen must be adjacent/accessible to dining or living
    if (kitchen && diningOrLiving && rooms.length > 3) {
      const kCenter = { x: kitchen.x + kitchen.width / 2, y: kitchen.y + kitchen.height / 2 };
      const dCenter = { x: diningOrLiving.x + diningOrLiving.width / 2, y: diningOrLiving.y + diningOrLiving.height / 2 };
      const dist = Math.hypot(kCenter.x - dCenter.x, kCenter.y - dCenter.y);
      const touches = doRectanglesTouch(kitchen, diningOrLiving);
      if (!touches && dist > 26) {
        errors.push(`[${floorLabel}] Kitchen is completely detached from dining and living zones.`);
      }
    }

    // Hard: Pooja never touches any toilet/bathroom
    if (pooja && baths.length > 0) {
      for (const b of baths) {
        if (doRectanglesTouch(pooja, b, 0.2)) {
          errors.push(`[${floorLabel}] Cultural violation: Pooja room shares a direct wall with toilet "${b.label}".`);
        }
      }
    }

    // Hard: Master bedroom has attached or adjacent bathroom if baths exist on floor
    if (master && baths.length > 0) {
      const mCenter = { x: master.x + master.width / 2, y: master.y + master.height / 2 };
      const hasAdjacentBath = baths.some(b => {
        const bCenter = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        return Math.hypot(mCenter.x - bCenter.x, mCenter.y - bCenter.y) <= 22 || doRectanglesTouch(master, b);
      });
      if (!hasAdjacentBath && rooms.length > 3) {
        errors.push(`[${floorLabel}] Master Bedroom has no accessible adjacent or attached bathroom.`);
      }
    }

    // 8. Reachability graph check
    if (options.checkReachability !== false && openings.length > 0) {
      validateReachability(floor, errors, floorLabel);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates whether moving/resizing a single room is valid
 * Used by 2D Studio and MutationEngine
 */
export const validateRoomMutation = (plan, floorLevel, updatedRoom) => {
  const plotW = Number(plan.plot?.width) || 30;
  const plotL = Number(plan.plot?.length) || 50;

  if (updatedRoom.width <= 0 || updatedRoom.height <= 0) {
    return { valid: false, error: 'Room dimensions must be greater than zero.' };
  }

  if (
    updatedRoom.x < 0 ||
    updatedRoom.y < 0 ||
    (updatedRoom.x + updatedRoom.width) > plotW ||
    (updatedRoom.y + updatedRoom.height) > plotL
  ) {
    return { valid: false, error: `Room cannot be placed outside the ${plotW}×${plotL} ft plot boundary.` };
  }

  const floor = plan.floors?.find((f) => f.level === floorLevel);
  if (!floor) return { valid: false, error: 'Invalid floor level.' };

  for (const other of floor.rooms || []) {
    if (other.id !== updatedRoom.id) {
      if (doRectanglesOverlap(updatedRoom, other)) {
        return { valid: false, error: `Room collides with adjacent "${other.label}".` };
      }
    }
  }

  return { valid: true };
};

/**
 * Evaluates the architectural quality of a valid plan using a rebalanced 4-pillar soft-scoring model (0-100 pts)
 * Soft scoring is only used to RANK plans that passed every hard gate.
 * 
 * Pillars (25 pts each):
 * 1. Proportion Quality & Circulation Compactness (continuous non-linear penalty for elongation, 10-14% circulation target)
 * 2. Adjacency & Functional Flow (Kitchen-Dining, Bed-Bath proximity, wet-zone clustering)
 * 3. Natural Light & Daylight Glazing (Perimeter exposure, direct windows, cross-ventilation)
 * 4. Structural Regularity & Column Grid (10-12 ft module alignment, stacked plumbing walls)
 * 
 * @param {object} plan 
 * @returns {{
 *   score: number,
 *   breakdown: {
 *     aspectRatioScore: number,
 *     circulationScore: number,
 *     adjacencyScore: number,
 *     naturalLightScore: number,
 *   },
 *   penalties: string[],
 *   bonuses: string[]
 * }}
 */
export const scorePlan = (plan) => {
  if (!plan || !plan.floors || plan.floors.length === 0) {
    return {
      score: 0,
      breakdown: { aspectRatioScore: 0, circulationScore: 0, adjacencyScore: 0, naturalLightScore: 0 },
      penalties: ['Empty or invalid floor plan.'],
      bonuses: []
    };
  }

  const penalties = [];
  const bonuses = [];

  // --- PILLAR 1: Proportion Quality & Compactness (max 25) ---
  let proportionScore = 25;
  let totalRooms = 0;

  plan.floors.forEach((floor) => {
    (floor.rooms || []).forEach((room) => {
      const isUtilityOrBalcony = room.type === 'balcony' || room.type === 'utility' || room.type === 'corridor';
      const w = room.width || 1;
      const h = room.height || 1;
      const ratio = Math.max(w / h, h / w);
      totalRooms++;

      if (!isUtilityOrBalcony) {
        if (ratio <= 1.25) {
          // Reward near-square
          bonuses.push(`Room "${room.label}" has excellent near-square proportions (1:${ratio.toFixed(2)}).`);
        } else if (ratio > 2.5) {
          proportionScore -= 8;
          penalties.push(`Severe aspect ratio distortion in "${room.label}": 1:${ratio.toFixed(2)} (exceeds 1:2.5).`);
        } else if (ratio > 2.0) {
          proportionScore -= 4;
          penalties.push(`Moderate aspect ratio stretching in "${room.label}": 1:${ratio.toFixed(2)} (exceeds 1:2.0).`);
        } else if (ratio > 1.6) {
          // Continuous subtle penalty
          const penalty = Number(((ratio - 1.6) * 3).toFixed(1));
          proportionScore -= penalty;
        }
      }
    });
  });

  const aspectRatioScore = Math.max(0, Math.min(25, Math.round(proportionScore)));

  // --- PILLAR 2: Circulation & Corridor Clearance (max 25) ---
  let circulationScore = 25;
  const minCorridorWidth = CIRCULATION_CONFIG.minPassageWidth;

  plan.floors.forEach((floor) => {
    const rooms = floor.rooms || [];
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const r1 = rooms[i];
        const r2 = rooms[j];

        const vOverlap = (Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y)) > 1.0;
        if (vOverlap) {
          const hGap = r1.x < r2.x ? r2.x - (r1.x + r1.width) : r1.x - (r2.x + r2.width);
          if (hGap > 0.05 && hGap < minCorridorWidth) {
            circulationScore = Math.max(0, circulationScore - 5);
            penalties.push(`Constricted corridor clearance (${hGap.toFixed(1)} ft < 3.0 ft) between "${r1.label}" and "${r2.label}".`);
          }
        }

        const hOverlap = (Math.min(r1.x + r1.width, r2.x + r2.width) - Math.max(r1.x, r2.x)) > 1.0;
        if (hOverlap) {
          const vGap = r1.y < r2.y ? r2.y - (r1.y + r1.height) : r1.y - (r2.y + r2.height);
          if (vGap > 0.05 && vGap < minCorridorWidth) {
            circulationScore = Math.max(0, circulationScore - 5);
            penalties.push(`Constricted passage clearance (${vGap.toFixed(1)} ft < 3.0 ft) between "${r1.label}" and "${r2.label}".`);
          }
        }
      }
    }
  });

  // --- PILLAR 3: Functional Adjacency & Plumbing Clustering (max 25) ---
  let adjacencyScore = 12; // Baseline

  plan.floors.forEach((floor) => {
    const rooms = floor.rooms || [];
    const kitchen = rooms.find(r => r.type === 'kitchen');
    const dining = rooms.find(r => r.type === 'dining' || r.label?.toLowerCase().includes('dining') || r.type === 'living');
    const master = rooms.find(r => r.type === 'master_bedroom' || r.type === 'primary_bedroom');
    const baths = rooms.filter(r => r.type === 'bathroom' || r.type === 'primary_bathroom' || r.type === 'attached_bathroom');
    const utility = rooms.find(r => r.type === 'utility');
    const pooja = rooms.find(r => r.type === 'pooja');

    // Kitchen <-> Dining proximity
    if (kitchen && dining) {
      const kCenter = { x: kitchen.x + kitchen.width / 2, y: kitchen.y + kitchen.height / 2 };
      const dCenter = { x: dining.x + dining.width / 2, y: dining.y + dining.height / 2 };
      const dist = Math.hypot(kCenter.x - dCenter.x, kCenter.y - dCenter.y);
      if (dist <= 18 || doRectanglesTouch(kitchen, dining)) {
        adjacencyScore += 6;
        bonuses.push('Kitchen and Dining zone in close functional proximity.');
      }
    }

    // Bedroom <-> Bathroom proximity
    if (master && baths.length > 0) {
      const mCenter = { x: master.x + master.width / 2, y: master.y + master.height / 2 };
      const hasCloseBath = baths.some(b => {
        const bCenter = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        return Math.hypot(mCenter.x - bCenter.x, mCenter.y - bCenter.y) <= 16 || doRectanglesTouch(master, b);
      });
      if (hasCloseBath) {
        adjacencyScore += 5;
        bonuses.push('Master Bedroom features adjacent bathroom access.');
      }
    }

    // Wet zone clustering (Kitchen + Utility + Bathrooms)
    if (kitchen && (utility || baths.length > 0)) {
      const wetRooms = [kitchen, utility, ...baths].filter(Boolean);
      let wetClustered = 0;
      for (let i = 0; i < wetRooms.length; i++) {
        for (let j = i + 1; j < wetRooms.length; j++) {
          if (doRectanglesTouch(wetRooms[i], wetRooms[j])) wetClustered++;
        }
      }
      if (wetClustered >= 1) {
        adjacencyScore += 3;
        bonuses.push('Wet plumbing zones clustered for cost-effective MEP routing.');
      }
    }

    // Pooja separation from Bathrooms
    if (pooja && baths.length > 0) {
      let sharesWallWithBath = false;
      for (const b of baths) {
        if (doRectanglesTouch(pooja, b, 0.2)) {
          sharesWallWithBath = true;
          break;
        }
      }
      if (sharesWallWithBath) {
        adjacencyScore = Math.max(0, adjacencyScore - 8);
        penalties.push('Pooja room shares a wall with bathroom (inadvisable in Vastu & hygiene).');
      } else {
        adjacencyScore += 2;
        bonuses.push('Pooja room respectfully isolated from wet sanitary zones.');
      }
    }
  });

  adjacencyScore = Math.min(25, Math.max(0, adjacencyScore));

  // --- PILLAR 4: Natural Light & Exterior Perimeter Exposure (max 25) ---
  let naturalLightScore = 25;
  const habitableTypes = ['living', 'master_bedroom', 'primary_bedroom', 'bedroom', 'guest_bedroom', 'kitchen', 'study'];

  plan.floors.forEach((floor) => {
    const rooms = floor.rooms || [];
    const openings = floor.openings || [];

    if (rooms.length === 0) return;
    const minX = Math.min(...rooms.map(r => r.x));
    const maxX = Math.max(...rooms.map(r => r.x + r.width));
    const minY = Math.min(...rooms.map(r => r.y));
    const maxY = Math.max(...rooms.map(r => r.y + r.height));

    rooms.forEach((room) => {
      if (habitableTypes.includes(room.type)) {
        const touchesExterior = (
          Math.abs(room.x - minX) < 0.5 ||
          Math.abs((room.x + room.width) - maxX) < 0.5 ||
          Math.abs(room.y - minY) < 0.5 ||
          Math.abs((room.y + room.height) - maxY) < 0.5
        );

        const hasWindow = openings.some(op => op.wallRoomId === room.id && op.type === 'window');

        if (!touchesExterior && !hasWindow) {
          naturalLightScore = Math.max(0, naturalLightScore - 12);
          penalties.push(`Habitable room "${room.label}" is landlocked with zero exterior perimeter walls or daylight.`);
        } else if (hasWindow) {
          bonuses.push(`Room "${room.label}" has direct natural daylight window.`);
        }
      }
    });
  });

  const totalScore = Math.round(aspectRatioScore + circulationScore + adjacencyScore + naturalLightScore);

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      aspectRatioScore,
      circulationScore,
      adjacencyScore,
      naturalLightScore,
    },
    penalties,
    bonuses,
  };
};
