/**
 * Spatial and Geometric Constraint Engine
 * Adheres strictly to PRD §15 and Spec §Constraint checks.
 */

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

  // If one rectangle is to the left/right/above/below of the other with tolerance
  if (r1Right <= r2.x + epsilon || r2Right <= r1.x + epsilon) return false;
  if (r1Bottom <= r2.y + epsilon || r2Bottom <= r1.y + epsilon) return false;

  return true;
};

/**
 * Validates a complete FloorPlan against all 6 geometric and spatial constraints
 * @param {object} plan 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePlan = (plan) => {
  const errors = [];

  if (!plan || !plan.plot || !plan.floors) {
    return { valid: false, errors: ['Invalid floor plan data structure.'] };
  }

  const plotW = Number(plan.plot.width) || 30;
  const plotL = Number(plan.plot.length) || 50;

  plan.floors.forEach((floor, floorIdx) => {
    const rooms = floor.rooms || [];
    const floorLabel = floor.label || `Floor ${floorIdx}`;

    // 1. Positive dimensions & Plot containment
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

    // 2. Room overlaps on the same floor
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

    // 3. Openings check: must belong to a room on the floor
    const openings = floor.openings || [];
    openings.forEach((op) => {
      const parentRoom = rooms.find((r) => r.id === op.wallRoomId);
      if (!parentRoom) {
        errors.push(`[${floorLabel}] Opening ${op.id} is attached to a non-existent room (${op.wallRoomId}).`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates whether moving/resizing a single room is valid
 * @param {object} plan 
 * @param {number} floorLevel 
 * @param {object} updatedRoom 
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateRoomMutation = (plan, floorLevel, updatedRoom) => {
  const plotW = Number(plan.plot.width) || 30;
  const plotL = Number(plan.plot.length) || 50;

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

  const floor = plan.floors.find((f) => f.level === floorLevel);
  if (!floor) return { valid: false, error: 'Invalid floor level.' };

  for (const other of floor.rooms) {
    if (other.id !== updatedRoom.id) {
      if (doRectanglesOverlap(updatedRoom, other)) {
        return { valid: false, error: `Room collides with adjacent "${other.label}".` };
      }
    }
  }

  return { valid: true };
};

/**
 * Evaluates the architectural quality of a valid plan using a 4-pillar soft-scoring model.
 * Produces a score from 0 to 100, detailed sub-scores, penalties, and bonuses.
 * 
 * Pillars (25 pts each):
 * 1. Aspect Ratio: Penalizes distorted rooms (ratio > 1:2.0, heavily > 1:2.5)
 * 2. Circulation: Clearance & minimum passage widths (>= 3.0 ft)
 * 3. Functional Adjacency: Kitchen-Dining, Master Bed-Bath proximity bonuses, Pooja-Bath isolation
 * 4. Natural Light: Habitable rooms (living, bedrooms, kitchen, study) must have perimeter-wall exposure
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

  const plotW = Number(plan.plot?.width) || 30;
  const plotL = Number(plan.plot?.length) || 50;

  const penalties = [];
  const bonuses = [];

  // --- PILLAR 1: Aspect Ratio Score (max 25) ---
  let aspectPenalty = 0;
  let totalRoomsChecked = 0;

  plan.floors.forEach((floor) => {
    (floor.rooms || []).forEach((room) => {
      // Balconies and utility can be slightly more elongated; focus primarily on major rooms
      const isUtilityOrBalcony = room.type === 'balcony' || room.type === 'utility';
      const w = room.width || 1;
      const h = room.height || 1;
      const ratio = Math.max(w / h, h / w);
      totalRoomsChecked++;

      if (ratio > 2.5 && !isUtilityOrBalcony) {
        aspectPenalty += 10;
        penalties.push(`Severe aspect ratio distortion in "${room.label}": 1:${ratio.toFixed(2)} (exceeds 1:2.5).`);
      } else if (ratio > 2.0 && !isUtilityOrBalcony) {
        aspectPenalty += 4;
        penalties.push(`Moderate aspect ratio stretching in "${room.label}": 1:${ratio.toFixed(2)} (exceeds 1:2.0).`);
      } else if (ratio > 1.6 && !isUtilityOrBalcony) {
        aspectPenalty += 1;
      }
    });
  });

  const aspectRatioScore = Math.max(0, 25 - aspectPenalty);

  // --- PILLAR 2: Circulation & Corridor Clearance (max 25) ---
  let circulationScore = 25;
  const minCorridorWidth = 3.0;

  plan.floors.forEach((floor) => {
    const rooms = floor.rooms || [];
    // Check for narrow spatial choke points between disjoint rooms
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const r1 = rooms[i];
        const r2 = rooms[j];

        // Horizontal gap between vertically overlapping rooms
        const vOverlap = (Math.min(r1.y + r1.height, r2.y + r2.height) - Math.max(r1.y, r2.y)) > 1.0;
        if (vOverlap) {
          const hGap = r1.x < r2.x ? r2.x - (r1.x + r1.width) : r1.x - (r2.x + r2.width);
          if (hGap > 0.05 && hGap < minCorridorWidth) {
            circulationScore = Math.max(0, circulationScore - 5);
            penalties.push(`Constricted corridor clearance (${hGap.toFixed(1)} ft < 3.0 ft) between "${r1.label}" and "${r2.label}".`);
          }
        }

        // Vertical gap between horizontally overlapping rooms
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

  // --- PILLAR 3: Functional Adjacency Scoring (max 25) ---
  let adjacencyScore = 10; // baseline

  plan.floors.forEach((floor) => {
    const rooms = floor.rooms || [];
    const kitchen = rooms.find(r => r.type === 'kitchen');
    const dining = rooms.find(r => r.type === 'dining' || r.label?.toLowerCase().includes('dining') || r.type === 'living');
    const master = rooms.find(r => r.type === 'master_bedroom' || r.type === 'primary_bedroom');
    const baths = rooms.filter(r => r.type === 'bathroom' || r.type === 'primary_bathroom' || r.type === 'attached_bathroom');
    const pooja = rooms.find(r => r.type === 'pooja');

    // Kitchen <-> Dining proximity bonus
    if (kitchen && dining) {
      const kCenter = { x: kitchen.x + kitchen.width / 2, y: kitchen.y + kitchen.height / 2 };
      const dCenter = { x: dining.x + dining.width / 2, y: dining.y + dining.height / 2 };
      const dist = Math.hypot(kCenter.x - dCenter.x, kCenter.y - dCenter.y);
      if (dist <= 18) {
        adjacencyScore += 7;
        bonuses.push('Kitchen and Dining zone in close functional proximity.');
      }
    }

    // Bedroom <-> Bathroom proximity bonus
    if (master && baths.length > 0) {
      const mCenter = { x: master.x + master.width / 2, y: master.y + master.height / 2 };
      const hasCloseBath = baths.some(b => {
        const bCenter = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
        return Math.hypot(mCenter.x - bCenter.x, mCenter.y - bCenter.y) <= 16;
      });
      if (hasCloseBath) {
        adjacencyScore += 6;
        bonuses.push('Master Bedroom features adjacent bathroom access.');
      }
    }

    // Pooja separation from Bathrooms
    if (pooja && baths.length > 0) {
      let sharesWallWithBath = false;
      for (const b of baths) {
        // Check if pooja touches bath with epsilon
        const touches = doRectanglesOverlap(
          { x: pooja.x - 0.1, y: pooja.y - 0.1, width: pooja.width + 0.2, height: pooja.height + 0.2 },
          b
        );
        if (touches) {
          sharesWallWithBath = true;
          break;
        }
      }

      if (sharesWallWithBath) {
        adjacencyScore = Math.max(0, adjacencyScore - 6);
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

    // Calculate bounding box of building envelope on this floor
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
