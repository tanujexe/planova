/**
 * Dimension-First Architectural Program Builder
 * Replaces naive area-slicing with target (W × D) dimensioning, aspect-ratio scaling,
 * and priority-based graceful degradation (shrink -> drop -> infeasible).
 * 
 * Priority Levels:
 * 1 = Core non-negotiable (Living, Master Bedroom, Kitchen, Staircase)
 * 2 = Essential functional (Bathrooms, Bedroom 2, Pooja)
 * 3 = Secondary functional (Bedroom 3, Utility, Dining as separate room)
 * 4 = Optional flex space (Study, Balcony, Guest Bed)
 * 5 = Luxury optional (Pantry, Breakfast Nook, Foyer enlargement)
 */

import { ROOM_STANDARDS, getRoomStandard } from './config.js';
import { generateId } from '../lib/ids.js';

export const BASE_ROOM_PROGRAM = {
  living: {
    S: { w: 14.0, d: 16.0 }, // 224 sqft
    M: { w: 15.0, d: 18.0 }, // 270 sqft
    L: { w: 18.0, d: 22.0 }, // 396 sqft
  },
  dining: {
    S: { w: 9.0, d: 10.0 },  // 90 sqft
    M: { w: 10.0, d: 12.0 }, // 120 sqft
    L: { w: 12.0, d: 14.0 }, // 168 sqft
  },
  kitchen: {
    S: { w: 7.0, d: 9.0 },   // 63 sqft
    M: { w: 9.0, d: 11.0 },  // 99 sqft
    L: { w: 10.0, d: 13.0 }, // 130 sqft
  },
  master_bedroom: {
    S: { w: 12.0, d: 13.0 }, // 156 sqft
    M: { w: 13.0, d: 14.5 }, // 188.5 sqft
    L: { w: 15.0, d: 17.0 }, // 255 sqft
  },
  bedroom: {
    S: { w: 10.0, d: 11.0 }, // 110 sqft
    M: { w: 11.0, d: 12.5 }, // 137.5 sqft
    L: { w: 12.5, d: 14.0 }, // 175 sqft
  },
  guest_bedroom: {
    S: { w: 10.0, d: 10.5 }, // 105 sqft
    M: { w: 10.5, d: 12.0 }, // 126 sqft
    L: { w: 12.0, d: 13.0 }, // 156 sqft
  },
  bathroom: {
    S: { w: 4.5, d: 6.0 },   // 27 sqft
    M: { w: 5.0, d: 7.5 },   // 37.5 sqft
    L: { w: 6.0, d: 8.5 },   // 51 sqft
  },
  primary_bathroom: {
    S: { w: 5.0, d: 7.0 },   // 35 sqft
    M: { w: 6.0, d: 8.5 },   // 51 sqft
    L: { w: 7.0, d: 10.0 },  // 70 sqft
  },
  attached_bathroom: {
    S: { w: 4.5, d: 6.5 },   // 29.25 sqft
    M: { w: 5.0, d: 7.5 },   // 37.5 sqft
    L: { w: 6.0, d: 8.5 },   // 51 sqft
  },
  pooja: {
    S: { w: 4.5, d: 4.5 },   // 20.25 sqft
    M: { w: 5.5, d: 5.5 },   // 30.25 sqft
    L: { w: 7.0, d: 7.0 },   // 49 sqft
  },
  study: {
    S: { w: 8.0, d: 9.0 },   // 72 sqft
    M: { w: 9.0, d: 11.0 },  // 99 sqft
    L: { w: 11.0, d: 13.0 }, // 143 sqft
  },
  utility: {
    S: { w: 4.5, d: 6.0 },   // 27 sqft
    M: { w: 5.5, d: 7.0 },   // 38.5 sqft
    L: { w: 6.5, d: 8.5 },   // 55.25 sqft
  },
  foyer: {
    S: { w: 5.0, d: 6.0 },   // 30 sqft
    M: { w: 6.5, d: 7.5 },   // 48.75 sqft
    L: { w: 8.0, d: 9.0 },   // 72 sqft
  },
  balcony: {
    S: { w: 4.0, d: 9.0 },   // 36 sqft
    M: { w: 5.0, d: 12.0 },  // 60 sqft
    L: { w: 6.0, d: 16.0 },  // 96 sqft
  },
  staircase: {
    S: { w: 6.5, d: 10.0 },  // 65 sqft
    M: { w: 7.0, d: 10.5 },  // 73.5 sqft
    L: { w: 8.0, d: 11.0 },  // 88 sqft
  },
};

/**
 * Builds a structured, dimension-first architectural room program
 * @param {object} plot 
 * @param {object} requirements 
 * @param {'S'|'M'|'L'} [sizeTier='M']
 * @returns {{
 *   feasible: boolean,
 *   program: Array<object>,
 *   droppedRooms: Array<object>,
 *   shrunkRooms: Array<object>,
 *   reason?: string,
 *   suggestion?: string,
 *   totalTargetArea: number,
 *   usableCapacity: number
 * }}
 */
export const buildRoomProgram = (plot, requirements = {}, sizeTier = 'M') => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floors = Math.max(1, Number(plot.floors) || 2);
  const bhk = Number(requirements.bhk) || 3;
  const tier = ['S', 'M', 'L'].includes(sizeTier) ? sizeTier : 'M';

  // Usable envelope estimation (assuming average setbacks 2ft sides, 3.5ft front, 2.5ft rear)
  const approxUsableW = Math.max(10, plotW - 4.0);
  const approxUsableL = Math.max(12, plotL - 6.0);
  const usableGroundFootprint = approxUsableW * approxUsableL;
  const totalUsableEnvelope = usableGroundFootprint * floors;

  // Circulation & wall target allowance (12% circulation + 8% walls = 20% overhead)
  const netUsableCapacity = Math.round(totalUsableEnvelope * 0.80);

  // Plot scaling factor: scales target room dimensions smoothly
  const plotArea = plotW * plotL;
  const plotScale = Math.min(1.25, Math.max(0.88, Math.sqrt(plotArea / 1500)));

  // 1. Initial room candidate list
  const requestedRooms = requirements.rooms && requirements.rooms.length > 0
    ? [...requirements.rooms]
    : [];

  const candidateProgram = [];

  const addRoomToProgram = (type, label, priority, optional = false, floorPref = 'any') => {
    const std = getRoomStandard(type);
    const preset = BASE_ROOM_PROGRAM[type]?.[tier] || { w: std.minWidth * 1.2, d: std.minWidth * 1.5 };

    // Apply plot scale
    let targetW = Number((Math.max(std.minWidth, preset.w * plotScale)).toFixed(1));
    let targetD = Number((Math.max(std.minWidth, preset.d * plotScale)).toFixed(1));

    // Ensure within max aspect ratio
    const aspect = Math.max(targetW / targetD, targetD / targetW);
    if (aspect > std.maxAspect) {
      if (targetW > targetD) {
        targetW = Number((targetD * std.maxAspect).toFixed(1));
      } else {
        targetD = Number((targetW * std.maxAspect).toFixed(1));
      }
    }

    const minArea = std.minArea;
    if (targetW * targetD < minArea) {
      targetD = Number((minArea / targetW).toFixed(1));
    }

    candidateProgram.push({
      id: generateId(`prog_${type}`),
      type,
      label,
      priority,
      optional,
      floorPref, // 'ground' | 'upper' | 'any'
      targetW,
      targetD,
      targetArea: Math.round(targetW * targetD),
      minW: std.minWidth,
      minD: std.minWidth,
      minArea: std.minArea,
      maxAspect: std.maxAspect,
      habitable: std.habitable,
    });
  };

  // Build program from wishlist or BHK defaults
  if (requestedRooms.length > 0) {
    requestedRooms.forEach((r) => {
      const type = r.type || 'bedroom';
      const std = getRoomStandard(type);
      addRoomToProgram(type, r.label || std.label || type, std.priority, r.optional || false, r.floor || 'any');
    });
  } else {
    // Standard BHK Program
    addRoomToProgram('foyer', 'Entrance Foyer', 3, true, 'ground');
    addRoomToProgram('living', 'Living Hall', 1, false, 'ground');
    addRoomToProgram('dining', 'Dining Space', 3, true, 'ground');
    addRoomToProgram('kitchen', 'Modular Kitchen', 1, false, 'ground');
    addRoomToProgram('utility', 'Utility & Wash', 3, true, 'ground');

    const hasPooja = requirements.hasPooja !== false;
    if (hasPooja) {
      addRoomToProgram('pooja', 'Pooja Room', 2, false, 'ground');
    }

    // Bedrooms
    addRoomToProgram('master_bedroom', 'Master Bedroom Suite', 1, false, floors > 1 ? 'upper' : 'ground');
    addRoomToProgram('primary_bathroom', 'Master Bathroom', 2, false, floors > 1 ? 'upper' : 'ground');

    if (bhk >= 2) {
      addRoomToProgram('bedroom', 'Bedroom 2', 2, false, 'any');
      addRoomToProgram('bathroom', 'Common Bathroom', 2, false, 'ground');
    }

    if (bhk >= 3) {
      addRoomToProgram('bedroom', 'Bedroom 3', 3, false, 'upper');
    }

    if (bhk >= 4) {
      addRoomToProgram('bedroom', 'Bedroom 4', 3, false, 'upper');
      addRoomToProgram('bathroom', 'Bathroom 3', 3, true, 'upper');
    }

    if (bhk >= 4 || requirements.hasStudy) {
      addRoomToProgram('study', 'Home Study / Office', 4, true, 'upper');
    }

    if (floors > 1) {
      addRoomToProgram('balcony', 'Front Balcony', 4, true, 'upper');
    }
  }

  // Calculate sum of target areas
  let totalTargetArea = candidateProgram.reduce((sum, r) => sum + r.targetArea, 0);
  const droppedRooms = [];
  const shrunkRooms = [];

  // 2. Degradation Step 1: Shrink low-priority rooms toward their minimums if exceeding capacity
  if (totalTargetArea > netUsableCapacity) {
    // Sort descending by priority (5, 4, 3, 2, 1)
    for (let p = 5; p >= 2; p--) {
      for (const room of candidateProgram.filter(r => r.priority === p)) {
        if (totalTargetArea <= netUsableCapacity) break;

        const maxShrinkArea = room.targetArea - room.minArea;
        if (maxShrinkArea > 5) {
          const neededReduction = totalTargetArea - netUsableCapacity;
          const actualReduction = Math.min(maxShrinkArea, neededReduction);

          const newArea = room.targetArea - actualReduction;
          const shrinkRatio = Math.sqrt(newArea / room.targetArea);

          const oldW = room.targetW;
          const oldD = room.targetD;
          room.targetW = Number((Math.max(room.minW, room.targetW * shrinkRatio)).toFixed(1));
          room.targetD = Number((Math.max(room.minD, room.targetD * shrinkRatio)).toFixed(1));
          room.targetArea = Math.round(room.targetW * room.targetD);

          totalTargetArea -= (oldW * oldD - room.targetArea);
          shrunkRooms.push({ id: room.id, label: room.label, oldArea: oldW * oldD, newArea: room.targetArea });
        }
      }
    }
  }

  // 3. Degradation Step 2: Drop optional rooms (priority 4 and 5) if still exceeding capacity
  if (totalTargetArea > netUsableCapacity) {
    const dropCandidates = candidateProgram.filter(r => r.optional || r.priority >= 4);
    for (const r of dropCandidates) {
      if (totalTargetArea <= netUsableCapacity) break;
      const idx = candidateProgram.findIndex(item => item.id === r.id);
      if (idx !== -1) {
        const [dropped] = candidateProgram.splice(idx, 1);
        totalTargetArea -= dropped.targetArea;
        droppedRooms.push(dropped);
      }
    }
  }

  // 4. Degradation Step 3: Check feasibility - Never squeeze below minimums
  const minRequiredProgramArea = candidateProgram.reduce((sum, r) => sum + r.minArea, 0);
  if (minRequiredProgramArea > netUsableCapacity) {
    const deficitSqFt = minRequiredProgramArea - netUsableCapacity;
    let suggestion = '';
    if (floors === 1) {
      suggestion = `Add a floor (G+1) to gain ~${usableGroundFootprint} sq.ft of built-up space.`;
    } else {
      suggestion = `Reduce requirement from ${bhk}BHK to ${Math.max(1, bhk - 1)}BHK or increase plot footprint.`;
    }

    return {
      feasible: false,
      program: candidateProgram,
      droppedRooms,
      shrunkRooms,
      reason: `Requested ${bhk}BHK program requires minimum ${minRequiredProgramArea} sq.ft, but usable envelope supports max ${netUsableCapacity} sq.ft on ${floors} floor(s) (Deficit: ${deficitSqFt} sq.ft).`,
      suggestion,
      totalTargetArea,
      usableCapacity: netUsableCapacity,
    };
  }

  return {
    feasible: true,
    program: candidateProgram,
    droppedRooms,
    shrunkRooms,
    totalTargetArea,
    usableCapacity: netUsableCapacity,
  };
};
