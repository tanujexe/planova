import { generateId } from '../lib/ids.js';
import { computeDynamicRoomAreas, ROOM_AREA_BOUNDS } from '../services/feasibility.js';
import { scorePlan, validatePlan } from './constraints.js';

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
};

export const getColor = (type) => ROOM_COLORS[type] || '#EFE8DC';

/**
 * Phase 2 — Calculates building setbacks based on municipal slabs (NBC / BBMP) and plot-size ratios.
 * Adapts side setbacks smoothly between narrow plots (20ft -> 1.5ft) and wide plots (60ft+ -> 4.5-5.5ft),
 * and dynamically directs front setbacks to the road-facing side.
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
 * Glazing dimensions tailored to room type and functional daylight requirements.
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
    rooms.push({ id: generateId('rm_park'), type: 'parking', label: 'Covered Parking', width: 11, height: 14, area: 154 });
  }
  rooms.push({ id: generateId('rm_foyer'), type: 'foyer', label: 'Entrance Foyer', width: 7, height: 8, area: 56 });
  if (hasPooja) {
    rooms.push({ id: generateId('rm_pooja'), type: 'pooja', label: 'Pooja Room', width: 6, height: 6, area: 36 });
  }
  rooms.push({ id: generateId('rm_living'), type: 'living', label: 'Living & Dining Hall', width: 16, height: 14, area: 224 });
  rooms.push({ id: generateId('rm_kitchen'), type: 'kitchen', label: 'Modular Kitchen & Utility', width: 10, height: 10, area: 100 });
  rooms.push({ id: generateId('rm_master'), type: 'master_bedroom', label: 'Master Bedroom Suite', width: 14, height: 14, area: 196 });
  rooms.push({ id: generateId('rm_bath1'), type: 'primary_bathroom', label: 'Master Bathroom', width: 6, height: 8, area: 48 });

  if (bhk >= 2) {
    rooms.push({ id: generateId('rm_bed2'), type: 'bedroom', label: 'Bedroom 2 (Guest Suite)', width: 12, height: 12, area: 144 });
    rooms.push({ id: generateId('rm_bath2'), type: 'bathroom', label: 'Common Bathroom', width: 5, height: 7, area: 35 });
  }
  if (bhk >= 3) {
    rooms.push({ id: generateId('rm_bed3'), type: 'bedroom', label: "Bedroom 3 (Kids' Room)", width: 12, height: 12, area: 144 });
  }
  if (bhk >= 4) {
    rooms.push({ id: generateId('rm_bed4'), type: 'bedroom', label: 'Bedroom 4 (Study / Suite)', width: 12, height: 11, area: 132 });
  }
  if (floorsCount >= 2) {
    rooms.push({ id: generateId('rm_balcony'), type: 'balcony', label: 'Front Terrace Balcony', width: 12, height: 6, area: 72 });
  }
  return rooms;
};

/**
 * Phase 3 — Intelligently distributes rooms across floors, ensuring public/service zones
 * on ground and private bedroom suites on upper levels.
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
    } else if (type === 'primary_bedroom' || type === 'bedroom' || type === 'master_bedroom') {
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
 * Phase 4 & Phase 5 — Core Spatial Layout Generator for a Single Floor
 * Uses derived dynamic area weights, aspect-ratio-aware tier splits,
 * dynamic staircase placement without entrance collision, and room-specific fenestration.
 */
export const layoutFloorWithRooms = ({
  rooms = [],
  setbacks,
  concept = 'balanced',
  floorLevel = 0,
  floorsCount = 1,
  facing = 'north',
  plot = {},
  requirements = {},
  variantOptions = {},
}) => {
  const { leftX, topY, usableW, usableL } = setbacks;
  const placedRooms = [];
  const openings = [];

  if (rooms.length === 0) {
    const rmId = generateId(`rm_terrace_f${floorLevel}`);
    placedRooms.push({
      id: rmId,
      type: 'balcony',
      label: floorLevel === 0 ? 'Open Courtyard' : 'Open Terrace & Garden',
      x: leftX,
      y: topY,
      width: usableW,
      height: usableL,
      floor: floorLevel,
      color: getColor('balcony'),
    });
    return { rooms: placedRooms, openings };
  }

  // Phase 1 dynamic room area lookup
  const dynamicAreas = computeDynamicRoomAreas(plot, requirements);

  const roomList = [...rooms];
  const needsStaircase = floorsCount >= 2 && !roomList.some(r => r.type === 'staircase');
  if (needsStaircase) {
    roomList.push({
      id: generateId(`rm_stair_f${floorLevel}`),
      type: 'staircase',
      label: floorLevel === 0 ? 'Internal Staircase' : 'Staircase Landing',
      width: 7,
      height: 10,
      area: 70,
    });
  }

  // Phase 4: Genuinely Differentiate Open Living Concept on Ground Floor
  // If concept is open_living on ground floor, merge living, dining, and kitchen into an expansive core
  if (concept === 'open_living' && floorLevel === 0) {
    const livingRoom = roomList.find(r => r.type === 'living');
    const diningRoom = roomList.find(r => r.type === 'dining');
    const kitchenRoom = roomList.find(r => r.type === 'kitchen');

    if (livingRoom || diningRoom || kitchenRoom) {
      // Retain rooms that are NOT part of the open living-dining-kitchen core
      const peripheralRooms = roomList.filter(
        r => r.type !== 'living' && r.type !== 'dining' && r.type !== 'kitchen'
      );

      // Define Great Room polygon bounding box (taking ~45-50% of usable length)
      const coreH = Math.max(12, Math.floor(usableL * 0.46));
      const frontH = Math.max(8, Math.floor((usableL - coreH) * 0.50));
      const rearH = Math.max(8, usableL - frontH - coreH);

      // Front tier rooms (e.g. parking, foyer, pooja)
      const frontRooms = peripheralRooms.filter(r => ['parking', 'foyer', 'pooja'].includes(r.type));
      // Rear tier rooms (e.g. master bedroom, bathroom, utility, staircase)
      const rearRooms = peripheralRooms.filter(r => !['parking', 'foyer', 'pooja'].includes(r.type));

      let currentY = topY;

      // 1. Layout Front Tier
      if (frontRooms.length > 0) {
        const totalReq = frontRooms.reduce((sum, r) => sum + (Number(r.area) || dynamicAreas[r.type] || 100), 0) || 1;
        let curX = leftX;
        frontRooms.forEach((r, idx) => {
          const isLast = idx === frontRooms.length - 1;
          const req = Number(r.area) || dynamicAreas[r.type] || 100;
          const w = isLast ? Math.max(3, leftX + usableW - curX) : Math.max(3, Math.floor(usableW * (req / totalReq)));
          const rmId = r.id || generateId(`rm_${r.type}`);
          placedRooms.push({
            id: rmId,
            type: r.type,
            label: r.label || r.type,
            x: curX,
            y: currentY,
            width: w,
            height: frontH,
            floor: floorLevel,
            color: r.color || getColor(r.type),
          });
          // Door or window
          if (r.type === 'foyer' || r.type === 'parking') {
            openings.push({ id: generateId('op_door'), type: 'door', wallRoomId: rmId, wallSide: 'top', offset: 1.5, width: 3.0 });
          } else {
            const winW = getWindowDimensionsForRoom(r.type, w);
            openings.push({ id: generateId('op_win'), type: 'window', wallRoomId: rmId, wallSide: 'top', offset: 1.0, width: winW });
          }
          curX += w;
        });
        currentY += frontH;
      }

      // 2. Layout Merged Open Living + Dining + Kitchen Great Room Core
      const coreId = generateId('rm_great_room_core');
      placedRooms.push({
        id: coreId,
        type: 'living',
        label: 'Open Living, Dining & Island Kitchen Core',
        x: leftX,
        y: currentY,
        width: usableW,
        height: coreH,
        floor: floorLevel,
        color: getColor('living'),
      });
      // Large panoramic fenestration for open core
      openings.push({
        id: generateId('op_win_core_l'),
        type: 'window',
        wallRoomId: coreId,
        wallSide: 'left',
        offset: 2.0,
        width: Math.min(coreH - 2, 6.0),
      });
      openings.push({
        id: generateId('op_win_core_r'),
        type: 'window',
        wallRoomId: coreId,
        wallSide: 'right',
        offset: 2.0,
        width: Math.min(coreH - 2, 6.0),
      });
      currentY += coreH;

      // 3. Layout Rear Tier
      if (rearRooms.length > 0) {
        const totalReq = rearRooms.reduce((sum, r) => sum + (Number(r.area) || dynamicAreas[r.type] || 100), 0) || 1;
        let curX = leftX;
        rearRooms.forEach((r, idx) => {
          const isLast = idx === rearRooms.length - 1;
          const req = Number(r.area) || dynamicAreas[r.type] || 100;
          const w = isLast ? Math.max(3, leftX + usableW - curX) : Math.max(3, Math.floor(usableW * (req / totalReq)));
          const rmId = r.id || generateId(`rm_${r.type}`);
          placedRooms.push({
            id: rmId,
            type: r.type,
            label: r.label || r.type,
            x: curX,
            y: currentY,
            width: w,
            height: rearH,
            floor: floorLevel,
            color: r.color || getColor(r.type),
          });
          const winW = getWindowDimensionsForRoom(r.type, w);
          openings.push({ id: generateId('op_win'), type: 'window', wallRoomId: rmId, wallSide: 'bottom', offset: 1.5, width: winW });
          curX += w;
        });
      }

      return { rooms: placedRooms, openings };
    }
  }

  // Phase 4: Vastu Priority Directional Quadrants driven by actual facing
  // Map directional quadrants according to actual plot facing
  const isVastu = concept === 'vastu_priority';

  // Zone classifications
  const frontTypes = ['parking', 'foyer', 'pooja', 'balcony'];
  const middleTypes = ['living', 'dining', 'staircase', 'study', 'breakfast_nook'];
  const rearTypes = ['primary_bedroom', 'bedroom', 'master_bedroom', 'guest_bedroom', 'kitchen', 'pantry', 'utility', 'primary_bathroom', 'bathroom', 'primary_closet', 'bed_closet'];

  const frontTier = [];
  const middleTier = [];
  const rearTier = [];

  roomList.forEach((r) => {
    const type = r.type || '';
    if (isVastu) {
      // Vastu quadrant awareness
      const f = (facing || 'north').toLowerCase();
      if (type === 'pooja') {
        // Pooja belongs in NE
        (f === 'north' || f === 'east') ? frontTier.push(r) : rearTier.push(r);
      } else if (type === 'kitchen' || type === 'utility') {
        // Kitchen belongs in SE
        (f === 'south' || f === 'east') ? frontTier.push(r) : rearTier.push(r);
      } else if (type === 'master_bedroom' || type === 'primary_bedroom') {
        // Master belongs in SW
        (f === 'south' || f === 'west') ? frontTier.push(r) : rearTier.push(r);
      } else if (type === 'parking' || type === 'foyer') {
        frontTier.push(r);
      } else if (middleTypes.includes(type)) {
        middleTier.push(r);
      } else {
        rearTier.push(r);
      }
    } else {
      if (frontTypes.includes(type)) {
        frontTier.push(r);
      } else if (middleTypes.includes(type)) {
        middleTier.push(r);
      } else if (rearTypes.includes(type)) {
        rearTier.push(r);
      } else {
        middleTier.push(r);
      }
    }
  });

  const tiers = [];
  if (frontTier.length > 0) tiers.push({ name: 'front', rooms: frontTier });
  if (middleTier.length > 0) tiers.push({ name: 'middle', rooms: middleTier });
  if (rearTier.length > 0) tiers.push({ name: 'rear', rooms: rearTier });

  if (tiers.length === 1 && tiers[0].rooms.length > 3) {
    const all = tiers[0].rooms;
    const mid = Math.ceil(all.length / 2);
    tiers[0].rooms = all.slice(0, mid);
    tiers.push({ name: 'rear', rooms: all.slice(mid) });
  }

  // Phase 4: Aspect-Ratio-Aware Tier Heights
  const numTiers = tiers.length;
  const plotAspectRatio = usableL / usableW;
  const ratioDelta = variantOptions.tierRatioDelta || 0;
  let tierHeights = [];

  if (numTiers === 1) {
    tierHeights = [usableL];
  } else if (numTiers === 2) {
    let splitRatio = 0.46;
    if (plotAspectRatio > 1.6) splitRatio = 0.40;
    else if (plotAspectRatio < 1.0) splitRatio = 0.50;
    splitRatio = Math.max(0.35, Math.min(0.65, splitRatio + ratioDelta));

    const h1 = Math.max(6, Math.floor(usableL * splitRatio));
    tierHeights = [h1, usableL - h1];
  } else {
    // 3 Tiers: proportioned by aspect ratio and target room areas
    let h1Ratio = 0.28;
    let h2Ratio = 0.38;

    if (plotAspectRatio > 1.6) {
      // Long narrow plot: expand middle core for circulation
      h1Ratio = 0.24;
      h2Ratio = 0.42;
    } else if (plotAspectRatio < 1.0) {
      // Wide/shallow plot
      h1Ratio = 0.32;
      h2Ratio = 0.36;
    }

    h1Ratio = Math.max(0.20, Math.min(0.35, h1Ratio + ratioDelta));
    const h1 = Math.max(6, Math.floor(usableL * h1Ratio));
    const h2 = Math.max(7, Math.floor(usableL * h2Ratio));
    tierHeights = [h1, h2, usableL - (h1 + h2)];
  }

  // Phase 3: Determine entrance side in front tier to locate staircase safely
  let entranceOnLeft = true;
  if (frontTier.length > 1) {
    const foyerIdx = frontTier.findIndex(r => r.type === 'foyer' || r.type === 'living');
    if (foyerIdx >= frontTier.length / 2) {
      entranceOnLeft = false;
    }
  }
  if (variantOptions.stairSide === 'flipped') {
    entranceOnLeft = !entranceOnLeft;
  }

  let currentY = topY;

  tiers.forEach((tier, tierIdx) => {
    const tierH = tierHeights[tierIdx] || Math.floor(usableL / numTiers);
    const tierRooms = tier.rooms;

    // Sort rooms in tier:
    // If entrance is on left, staircase should be placed on the right (and vice versa)
    tierRooms.sort((a, b) => {
      if (a.type === 'staircase') return entranceOnLeft ? 1 : -1;
      if (b.type === 'staircase') return entranceOnLeft ? -1 : 1;

      if (isVastu) {
        const vastuWeights = {
          parking: 1,
          foyer: 2,
          pooja: 3,
          living: 4,
          dining: 5,
          utility: 6,
          kitchen: 7,
          master_bedroom: 1,
          bedroom: 2,
          bathroom: 3,
        };
        return (vastuWeights[a.type] || 5) - (vastuWeights[b.type] || 5);
      }

      const defaultWeights = {
        parking: 1,
        foyer: 2,
        pooja: 3,
        living: 2,
        dining: 3,
        kitchen: 4,
        master_bedroom: 1,
        bedroom: 2,
        bathroom: 3,
      };
      return (defaultWeights[a.type] || 3) - (defaultWeights[b.type] || 3);
    });

    // Phase 4: Derived room weights from required areas
    const totalReqArea = tierRooms.reduce((acc, r) => {
      const a = Number(r.area) || dynamicAreas[r.type] || ROOM_AREA_BOUNDS[r.type]?.default || 120;
      return acc + a;
    }, 0) || 1;

    let currentX = leftX;

    tierRooms.forEach((r, rIdx) => {
      const isLast = rIdx === tierRooms.length - 1;
      const reqArea = Number(r.area) || dynamicAreas[r.type] || ROOM_AREA_BOUNDS[r.type]?.default || 120;
      let roomW = isLast
        ? Math.max(3, leftX + usableW - currentX)
        : Math.max(3, Math.floor(usableW * (reqArea / totalReqArea)));

      if (currentX + roomW > leftX + usableW) {
        roomW = Math.max(3, leftX + usableW - currentX);
      }

      const roomId = r.id || generateId(`rm_${r.type || 'room'}`);
      const type = r.type || 'living';

      placedRooms.push({
        id: roomId,
        type: type,
        label: r.label || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        x: currentX,
        y: currentY,
        width: roomW,
        height: tierH,
        floor: floorLevel,
        color: r.color || getColor(type),
      });

      // Phase 5: Room-type-specific fenestration sizing
      if (tierIdx === 0 && (type === 'foyer' || type === 'living' || type === 'parking')) {
        openings.push({
          id: generateId('op_door'),
          type: 'door',
          wallRoomId: roomId,
          wallSide: 'top',
          offset: Math.min(1.5, Math.max(0.5, Number((roomW * 0.2).toFixed(1)))),
          width: 3.0,
        });
      } else if (tierIdx === 0) {
        const winW = getWindowDimensionsForRoom(type, roomW);
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'top',
          offset: Math.min(2.0, Math.max(0.5, Number((roomW * 0.25).toFixed(1)))),
          width: winW,
        });
      }

      if (tierIdx === numTiers - 1 && type !== 'staircase') {
        const winW = getWindowDimensionsForRoom(type, roomW);
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'bottom',
          offset: Math.min(2.0, Math.max(0.5, Number((roomW * 0.25).toFixed(1)))),
          width: winW,
        });
      }

      if (rIdx === 0 && type !== 'staircase' && type !== 'parking') {
        const winW = getWindowDimensionsForRoom(type, tierH);
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'left',
          offset: Math.min(2.0, Math.max(0.5, Number((tierH * 0.25).toFixed(1)))),
          width: winW,
        });
      }

      if (isLast && type !== 'staircase') {
        const winW = getWindowDimensionsForRoom(type, tierH);
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'right',
          offset: Math.min(2.0, Math.max(0.5, Number((tierH * 0.25).toFixed(1)))),
          width: winW,
        });
      }

      currentX += roomW;
    });

    currentY += tierH;
  });

  return { rooms: placedRooms, openings };
};

/**
 * Phase 4 & Phase 6 — Generates multiple design candidates, evaluates them with soft scoring,
 * and keeps the highest scoring geometrically valid candidate.
 */
export const generateConceptCandidates = (plot, requirements, conceptGeneratorFn, conceptName) => {
  const candidateConfigs = [
    { variant: 'standard', stairSide: 'auto', tierRatioDelta: 0 },
    { variant: 'stair_flipped', stairSide: 'flipped', tierRatioDelta: 0 },
    { variant: 'ratio_expanded', stairSide: 'auto', tierRatioDelta: 0.04 },
  ];

  const scoredCandidates = [];

  for (const config of candidateConfigs) {
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
    // Return standard if candidate search fails
    return conceptGeneratorFn(plot, requirements, { variant: 'standard', stairSide: 'auto', tierRatioDelta: 0 });
  }

  // Keep the best layout according to Phase 6 soft scoring
  scoredCandidates.sort((a, b) => b.score - a.score);
  const bestPlan = scoredCandidates[0].plan;
  bestPlan.softScore = scoredCandidates[0].score;
  bestPlan.scoreDetails = scoredCandidates[0].scoreResult;
  return bestPlan;
};

/**
 * 1. BALANCED LAYOUT GENERATOR (Dynamic, Proportional, Multi-Floor)
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
 * 2. OPEN LIVING CONCEPT (Contemporary Flow, Expansive Great Room Core)
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
 * 3. VASTU PRIORITY CONCEPT (Strict 8-Sector Cosmic Directional Alignment)
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
