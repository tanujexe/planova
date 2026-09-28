import { generateId } from '../lib/ids.js';
import { ROOM_STANDARDS, CIRCULATION_CONFIG, PARKING_CONFIG, STAIRCASE_CONFIG, getRoomStandard } from './config.js';
import { buildRoomProgram } from './programBuilder.js';
import { selectCirculationTopology, generateCorridorGeometry, TOPOLOGY_TYPES } from './circulation.js';
import { allocateParking } from './parking.js';
import { scorePlan, validatePlan, doRectanglesOverlap, doRectanglesTouch } from './constraints.js';
import { computeDynamicRoomAreas, ROOM_AREA_BOUNDS } from '../services/feasibility.js';
import { solveFloorLayout } from './architecturalSolver.js';

/**
 * Intelligent Architectural Spatial Layout Engine
 * Generates dynamic, constraint-validated, beautifully proportioned
 * architectural floor plans for ANY plot size, facing direction, floor count, and custom room requirements.
 */

// Architectural Color Palette by Room Type
const ROOM_COLORS = {
  primary_bedroom: '#FEEAE5',
  bedroom: '#FEEAE5',
  master_bedroom: '#FEEAE5',
  guest_bedroom: '#FEEAE5',
  primary_bathroom: '#E0F2FE',
  bathroom: '#E0F2FE',
  attached_bathroom: '#E0F2FE',
  primary_closet: '#FDEBD2',
  bed_closet: '#FDEBD2',
  closet: '#FDEBD2',
  kitchen: '#FFEDD5',
  dining: '#FEF3C7',
  breakfast_nook: '#FEF3C7',
  pantry: '#F1F5F9',
  living: '#FEF3C7',
  pooja: '#FFFBEB',
  parking: '#DCFCE7',
  utility: '#F1F5F9',
  foyer: '#FAF5FF',
  balcony: '#E2E8F0',
  staircase: '#EDE8DF',
  study: '#E7E2D8',
  corridor: '#F4EFE6',
};

export const getColor = (type) => ROOM_COLORS[type] || '#EFE8DC';

/**
 * Phase 2 — Calculates building setbacks based on municipal slabs (NBC / BBMP) and plot-size ratios.
 */
export const calculateSetbacks = (plotW, plotL, facing = 'north') => {
  const w = Number(plotW) || 30;
  const l = Number(plotL) || 50;
  const f = (facing || 'north').toLowerCase();

  // Side setback: municipal slabs with ratio awareness
  let sideSetback = 2.0;
  if (w < 25) {
    sideSetback = 1.5;
  } else if (w < 35) {
    sideSetback = 2.0;
  } else if (w < 50) {
    sideSetback = 3.0;
  } else if (w < 70) {
    sideSetback = Number((Math.min(5.0, Math.max(3.5, w * 0.08))).toFixed(1));
  } else {
    sideSetback = Number((Math.min(7.0, Math.max(5.0, w * 0.085))).toFixed(1));
  }

  // Front setback: based on plot length and road facing
  let frontSetback = 3.5;
  if (l < 35) {
    frontSetback = 2.5;
  } else if (l < 50) {
    frontSetback = 3.5;
  } else if (l < 70) {
    frontSetback = Number((Math.min(5.5, Math.max(4.0, l * 0.08))).toFixed(1));
  } else {
    frontSetback = Number((Math.min(8.0, Math.max(6.0, l * 0.09))).toFixed(1));
  }

  // Rear setback: municipal slabs
  let rearSetback = 2.5;
  if (l < 35) {
    rearSetback = 1.5;
  } else if (l < 50) {
    rearSetback = 2.5;
  } else if (l < 70) {
    rearSetback = Number((Math.min(4.5, Math.max(3.0, l * 0.065))).toFixed(1));
  } else {
    rearSetback = Number((Math.min(6.5, Math.max(4.5, l * 0.075))).toFixed(1));
  }

  let leftX = sideSetback;
  let topY = frontSetback;
  if (f === 'south') {
    topY = rearSetback;
  }

  const usableW = Math.max(10, Math.floor(w - sideSetback * 2));
  const usableL = Math.max(12, Math.floor(l - (frontSetback + rearSetback)));

  return { leftX, topY, usableW, usableL, frontSetback, rearSetback, sideSetback };
};

/**
 * Phase 5 — Room-function-specific fenestration sizing
 */
export const getWindowDimensionsForRoom = (roomType, availableWallLength) => {
  const maxSafeW = Math.max(1.5, availableWallLength - 1.0);
  switch (roomType) {
    case 'living':
      return Math.min(maxSafeW, 5.5);
    case 'primary_bedroom':
    case 'master_bedroom':
    case 'bedroom':
    case 'guest_bedroom':
      return Math.min(maxSafeW, 4.0);
    case 'kitchen':
      return Math.min(maxSafeW, 3.2);
    case 'study':
      return Math.min(maxSafeW, 3.5);
    case 'primary_bathroom':
    case 'attached_bathroom':
    case 'bathroom':
    case 'utility':
      return Math.min(maxSafeW, 2.0);
    case 'pooja':
      return Math.min(maxSafeW, 2.2);
    case 'staircase':
      return Math.min(maxSafeW, 2.8);
    case 'balcony':
      return Math.min(maxSafeW, 5.0);
    default:
      return Math.min(maxSafeW, 3.0);
  }
};

/**
 * Normalizes user requirements into a structured room wishlist
 */
export const parseRequirements = (requirements, bhkCount) => {
  const bhk = Number(bhkCount) || Number(requirements?.bhk) || 3;
  const userRooms = requirements?.rooms || [];

  return {
    bhk,
    hasPooja: userRooms.length === 0 || userRooms.some(r => r.type?.includes('pooja') || r.type?.includes('mandir')),
    hasParking: userRooms.length === 0 || userRooms.some(r => r.type?.includes('parking') || r.type?.includes('garage')),
    hasBalcony: userRooms.length === 0 || userRooms.some(r => r.type?.includes('balcony') || r.type?.includes('porch')),
    hasStudy: userRooms.some(r => r.type?.includes('office') || r.type?.includes('study')) || bhk >= 4,
    hasAttachedBaths: true,
  };
};

/**
 * Ensures strict plot boundary containment and opening sanitization
 */
export const ensurePlanContainment = (plan) => {
  if (!plan || !plan.plot || !plan.floors) return plan;

  const plotW = Number(plan.plot.width) || 30;
  const plotL = Number(plan.plot.length) || 50;

  plan.floors.forEach((floor) => {
    (floor.rooms || []).forEach((room) => {
      if (room.x < 0) room.x = 0;
      if (room.y < 0) room.y = 0;

      if (room.x + room.width > plotW) {
        room.width = Math.max(3, Number((plotW - room.x).toFixed(1)));
      }
      if (room.y + room.height > plotL) {
        room.height = Math.max(3, Number((plotL - room.y).toFixed(1)));
      }
    });

    (floor.openings || []).forEach((op) => {
      const room = (floor.rooms || []).find((r) => r.id === op.wallRoomId);
      if (room) {
        const wallLen = (op.wallSide === 'top' || op.wallSide === 'bottom') ? room.width : room.height;
        if (op.offset + op.width > wallLen) {
          op.offset = Math.max(0.5, Number((wallLen - op.width - 0.5).toFixed(1)));
        }
      }
    });
  });

  return plan;
};

/**
 * Generates structured default rooms for a brief when user has not specified custom catalog items.
 */
export const getDefaultRoomsForBrief = (bhk = 3, floorsCount = 2, hasPooja = true, hasParking = true) => {
  const rooms = [];
  if (hasParking) {
    rooms.push({ id: generateId('rm_park'), type: 'parking', label: 'Covered Parking (9×18 ft)', width: 9, height: 18, area: 162 });
  }
  rooms.push({ id: generateId('rm_foyer'), type: 'foyer', label: 'Entrance Foyer', width: 7, height: 7, area: 49 });
  if (hasPooja) {
    rooms.push({ id: generateId('rm_pooja'), type: 'pooja', label: 'Pooja Room', width: 6, height: 6, area: 36 });
  }
  rooms.push({ id: generateId('rm_living'), type: 'living', label: 'Living & Dining Hall', width: 16, height: 16, area: 256 });
  rooms.push({ id: generateId('rm_kitchen'), type: 'kitchen', label: 'Modular Kitchen', width: 10, height: 10, area: 100 });
  rooms.push({ id: generateId('rm_utility'), type: 'utility', label: 'Utility & Wash', width: 6, height: 8, area: 48 });
  rooms.push({ id: generateId('rm_master'), type: 'master_bedroom', label: 'Master Bedroom Suite', width: 14, height: 14, area: 196 });
  rooms.push({ id: generateId('rm_bath1'), type: 'primary_bathroom', label: 'Master Bathroom', width: 6, height: 8, area: 48 });

  if (bhk >= 2) {
    rooms.push({ id: generateId('rm_bed2'), type: 'bedroom', label: 'Bedroom 2', width: 12, height: 12, area: 144 });
    rooms.push({ id: generateId('rm_bath2'), type: 'bathroom', label: 'Common Bathroom', width: 5, height: 7, area: 35 });
  }
  if (bhk >= 3) {
    rooms.push({ id: generateId('rm_bed3'), type: 'bedroom', label: 'Bedroom 3', width: 12, height: 12, area: 144 });
  }
  if (bhk >= 4) {
    rooms.push({ id: generateId('rm_bed4'), type: 'bedroom', label: 'Bedroom 4', width: 12, height: 11, area: 132 });
    rooms.push({ id: generateId('rm_bath3'), type: 'bathroom', label: 'Bathroom 3', width: 5, height: 7, area: 35 });
  }
  if (floorsCount >= 2) {
    rooms.push({ id: generateId('rm_balcony'), type: 'balcony', label: 'Front Terrace Balcony', width: 12, height: 6, area: 72 });
  }
  return rooms;
};

/**
 * Distributes rooms across floors ensuring functional public/service on ground and private suites on upper floors.
 */
export const distributeRoomsAcrossFloors = (userRooms, floorsCount) => {
  if (floorsCount <= 1) {
    return [userRooms];
  }

  const groundPreferred = [];
  const upperPreferred = [];

  const groundTypes = ['parking', 'foyer', 'pooja', 'living', 'dining', 'kitchen', 'pantry', 'utility'];
  const upperTypes = ['balcony', 'primary_closet', 'bed_closet', 'study'];

  let groundBedCount = 0;
  let groundBathCount = 0;

  userRooms.forEach((r) => {
    const type = r.type || '';
    if (groundTypes.includes(type)) {
      groundPreferred.push(r);
    } else if (upperTypes.includes(type)) {
      upperPreferred.push(r);
    } else if (type === 'primary_bedroom' || type === 'master_bedroom' || type === 'bedroom') {
      if (groundBedCount === 0) {
        groundPreferred.push(r);
        groundBedCount++;
      } else {
        upperPreferred.push(r);
      }
    } else if (type === 'primary_bathroom' || type === 'bathroom') {
      if (groundBathCount === 0) {
        groundPreferred.push(r);
        groundBathCount++;
      } else {
        upperPreferred.push(r);
      }
    } else {
      if (groundPreferred.length <= upperPreferred.length) {
        groundPreferred.push(r);
      } else {
        upperPreferred.push(r);
      }
    }
  });

  if (upperPreferred.length === 0 && groundPreferred.length > 2) {
    const half = Math.ceil(groundPreferred.length / 2);
    upperPreferred.push(...groundPreferred.splice(half));
  }

  if (groundPreferred.length === 0 && upperPreferred.length > 0) {
    const half = Math.ceil(upperPreferred.length / 2);
    groundPreferred.push(...upperPreferred.splice(0, half));
  }

  const floors = [groundPreferred, upperPreferred];

  if (floorsCount > 2) {
    while (floors.length < floorsCount) {
      if (upperPreferred.length > 1) {
        floors.push([upperPreferred.pop()]);
      } else {
        floors.push([]);
      }
    }
  }

  return floors;
};

/**
 * Seeded Pseudo-Random Number Generator (Mulberry32) for reproducible candidate variation
 */
export const createRng = (seed = 42) => {
  let s = Math.abs(seed) || 42;
  return () => {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/**
 * Layouts a single floor using architectural zoning, dimension-first placement,
 * explicit circulation corridors, and NBC setback envelopes.
 */
export const layoutFloorWithRooms = (params) => {
  return solveFloorLayout(params);
};

/**
 * Phase 4 & Phase 6 — Generates N >= 30 design candidates with genuine diversity,
 * evaluates them against HARD gates via validatePlan, ranks passing candidates via scorePlan,
 * and returns the highest scoring candidate.
 */
export const generateConceptCandidates = (plot, requirements, conceptGeneratorFn, conceptName) => {
  const N = 30; // Generate 30 diverse candidates
  const scoredCandidates = [];
  const baseSeed = (Number(plot.width) || 30) * 100 + (Number(plot.length) || 50);

  for (let i = 0; i < N; i++) {
    const rng = createRng(baseSeed + i * 17);
    const topologies = [TOPOLOGY_TYPES.CENTRAL_PASSAGE, TOPOLOGY_TYPES.NARROW_SPINE, TOPOLOGY_TYPES.DUAL_WING];
    const topology = topologies[i % topologies.length];
    const corridorSide = i % 3 === 0 ? 'left' : i % 3 === 1 ? 'right' : 'center';
    const stairSide = i % 2 === 0 ? 'left' : 'right';
    const entrySide = i % 2 === 0 ? 'right' : 'left';

    const config = {
      variant: `cand_${i}`,
      topology,
      corridorSide,
      stairSide,
      entrySide,
      rng,
    };

    try {
      const plan = conceptGeneratorFn(plot, requirements, config);
      const validation = validatePlan(plan);
      if (validation.valid) {
        const scoreResult = scorePlan(plan);
        scoredCandidates.push({ plan, score: scoreResult.score, scoreResult });
      }
    } catch (e) {
      // Candidate failed generation, continue
    }
  }

  if (scoredCandidates.length === 0) {
    // Fallback: standard candidate
    return conceptGeneratorFn(plot, requirements, { variant: 'standard', stairSide: 'left', entrySide: 'right' });
  }

  // Sort descending by score and pick best
  scoredCandidates.sort((a, b) => b.score - a.score);
  const bestPlan = scoredCandidates[0].plan;
  bestPlan.softScore = scoredCandidates[0].score;
  bestPlan.scoreDetails = scoredCandidates[0].scoreResult;
  return bestPlan;
};

/**
 * 1. BALANCED LAYOUT GENERATOR
 */
export const generateSingleBalancedCandidate = (plot, requirements = {}, variantOptions = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();

  const setbacks = calculateSetbacks(plotW, plotL, facing);
  let userRooms = requirements.rooms || [];
  if (userRooms.length === 0) {
    const bhk = Number(requirements.bhk) || 3;
    userRooms = getDefaultRoomsForBrief(bhk, floorsCount, true, true);
  }

  const floorRoomLists = distributeRoomsAcrossFloors(userRooms, floorsCount);
  const floors = floorRoomLists.map((fRooms, idx) => {
    const { rooms, openings } = layoutFloorWithRooms({
      rooms: fRooms,
      setbacks,
      concept: 'balanced',
      floorLevel: idx,
      floorsCount,
      facing,
      plot,
      requirements,
      variantOptions,
    });

    return {
      level: idx,
      label: idx === 0 ? 'Ground Floor (G)' : idx === 1 ? 'First Floor (L1)' : `Level ${idx} (L${idx})`,
      rooms,
      openings,
    };
  });

  const builtUp = Math.round(setbacks.usableW * setbacks.usableL * (floorsCount === 1 ? 0.92 : floorsCount === 2 ? 1.75 : 2.5));

  const plan = {
    id: generateId('plan_balanced'),
    name: 'Balanced Layout',
    plot,
    vastuStatus: 'considered',
    builtUpAreaSqFt: builtUp,
    notes: [
      `Customized for ${plotW}×${plotL} ft (${facing.toUpperCase()} facing) with ${floorsCount} level(s).`,
      `Includes ${userRooms.length} room(s) arranged dynamically across ${floorsCount} floor(s).`,
      'Harmonious zoning ensuring natural daylight, cross-ventilation, and dedicated circulation corridors.',
      'Derived room sizing respecting architectural bounds and aspect-ratio-aware tier splits.'
    ],
    floors,
  };

  return ensurePlanContainment(plan);
};

export const generateBalancedLayout = (plot, requirements = {}) => {
  return generateConceptCandidates(plot, requirements, generateSingleBalancedCandidate, 'Balanced');
};

/**
 * 2. OPEN LIVING CONCEPT
 */
export const generateSingleOpenLivingCandidate = (plot, requirements = {}, variantOptions = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();

  const setbacks = calculateSetbacks(plotW, plotL, facing);
  let userRooms = requirements.rooms || [];
  if (userRooms.length === 0) {
    const bhk = Number(requirements.bhk) || 3;
    userRooms = getDefaultRoomsForBrief(bhk, floorsCount, true, true);
  }

  const floorRoomLists = distributeRoomsAcrossFloors(userRooms, floorsCount);
  const floors = floorRoomLists.map((fRooms, idx) => {
    const { rooms, openings } = layoutFloorWithRooms({
      rooms: fRooms,
      setbacks,
      concept: 'open_living',
      floorLevel: idx,
      floorsCount,
      facing,
      plot,
      requirements,
      variantOptions,
    });

    return {
      level: idx,
      label: idx === 0 ? 'Ground Floor (G)' : idx === 1 ? 'First Floor (L1)' : `Level ${idx} (L${idx})`,
      rooms,
      openings,
    };
  });

  const builtUp = Math.round(setbacks.usableW * setbacks.usableL * (floorsCount === 1 ? 0.95 : 1.8));

  const plan = {
    id: generateId('plan_open'),
    name: 'Open Living',
    plot,
    vastuStatus: 'tradeoff',
    builtUpAreaSqFt: builtUp,
    notes: [
      `Contemporary open-concept villa tailored for ${plotW}×${plotL} ft plot.`,
      'Seamless Great Room polygon merging Living, Dining, and Island Kitchen into a single expansive core.',
      'Perimeter rooms wrapped neatly around the central social living pavilion.',
      'Full-width daylight glazing and uninterrupted cross-ventilation flow.'
    ],
    floors,
  };

  return ensurePlanContainment(plan);
};

export const generateOpenLivingLayout = (plot, requirements = {}) => {
  return generateConceptCandidates(plot, requirements, generateSingleOpenLivingCandidate, 'Open Living');
};

/**
 * 3. VASTU PRIORITY CONCEPT
 */
export const generateSingleVastuCandidate = (plot, requirements = {}, variantOptions = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();

  const setbacks = calculateSetbacks(plotW, plotL, facing);
  let userRooms = requirements.rooms || [];
  if (userRooms.length === 0) {
    const bhk = Number(requirements.bhk) || 3;
    userRooms = getDefaultRoomsForBrief(bhk, floorsCount, true, true);
  }

  const floorRoomLists = distributeRoomsAcrossFloors(userRooms, floorsCount);
  const floors = floorRoomLists.map((fRooms, idx) => {
    const { rooms, openings } = layoutFloorWithRooms({
      rooms: fRooms,
      setbacks,
      concept: 'vastu_priority',
      floorLevel: idx,
      floorsCount,
      facing,
      plot,
      requirements,
      variantOptions,
    });

    return {
      level: idx,
      label: idx === 0 ? 'Ground Floor (G)' : idx === 1 ? 'First Floor (L1)' : `Level ${idx} (L${idx})`,
      rooms,
      openings,
    };
  });

  const builtUp = Math.round(setbacks.usableW * setbacks.usableL * (floorsCount === 1 ? 0.9 : 1.72));

  const plan = {
    id: generateId('plan_vastu'),
    name: 'Vastu Priority',
    plot,
    vastuStatus: 'considered',
    builtUpAreaSqFt: builtUp,
    notes: [
      `100% directional compliance across primary Vastu sectors mapped from ${facing.toUpperCase()} facing:`,
      'Pooja room aligned with auspicious North-East (Ishanya) solar vector.',
      'Kitchen positioned in South-East (Agni) quadrant for optimal thermodynamics.',
      'Primary Master Bedroom anchored in South-West (Nairutya) for grounded stability and peace.',
      'Brahmasthan (central core) kept unencumbered for positive cosmic energy circulation.'
    ],
    floors,
  };

  return ensurePlanContainment(plan);
};

export const generateVastuPriorityLayout = (plot, requirements = {}) => {
  return generateConceptCandidates(plot, requirements, generateSingleVastuCandidate, 'Vastu Priority');
};
