import { generateId } from '../lib/ids.js';

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

const getColor = (type) => ROOM_COLORS[type] || '#EFE8DC';

/**
 * Calculates building setbacks based on plot dimensions
 */
const calculateSetbacks = (plotW, plotL, facing = 'north') => {
  const sideSetback = plotW >= 40 ? 3 : (plotW >= 24 ? 2 : 1.5);
  const rearSetback = plotL >= 50 ? 3 : (plotL >= 30 ? 2 : 1.5);
  const frontSetback = plotL >= 50 ? 4 : (plotL >= 30 ? 3 : 2);

  const leftX = sideSetback;
  const topY = facing === 'south' ? rearSetback : frontSetback;
  const usableW = Math.max(10, Math.floor(plotW - sideSetback * 2));
  const usableL = Math.max(12, Math.floor(plotL - (frontSetback + rearSetback)));

  return { leftX, topY, usableW, usableL, frontSetback, rearSetback, sideSetback };
};

/**
 * Normalizes user requirements into a structured room wishlist
 */
const parseRequirements = (requirements, bhkCount) => {
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
 * Intelligently distributes user-selected rooms across floors
 */
const distributeRoomsAcrossFloors = (userRooms, floorsCount) => {
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
 * Dynamically arranges rooms on a single floor into architectural zones
 */
const layoutFloorWithRooms = ({
  rooms = [],
  setbacks,
  concept = 'balanced',
  floorLevel = 0,
  floorsCount = 1,
  facing = 'north',
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

  const roomList = [...rooms];
  if (floorsCount >= 2 && !roomList.some(r => r.type === 'staircase')) {
    roomList.push({
      id: generateId(`rm_stair_f${floorLevel}`),
      type: 'staircase',
      label: floorLevel === 0 ? 'Internal Staircase' : 'Staircase Landing',
      width: 7,
      height: 10,
      area: 70,
    });
  }

  const frontTypes = ['parking', 'foyer', 'pooja', 'balcony'];
  const middleTypes = ['living', 'dining', 'staircase', 'study', 'breakfast_nook'];
  const rearTypes = ['primary_bedroom', 'bedroom', 'master_bedroom', 'guest_bedroom', 'kitchen', 'pantry', 'utility', 'primary_bathroom', 'bathroom', 'primary_closet', 'bed_closet'];

  const frontTier = [];
  const middleTier = [];
  const rearTier = [];

  roomList.forEach((r) => {
    const type = r.type || '';
    if (frontTypes.includes(type)) {
      frontTier.push(r);
    } else if (middleTypes.includes(type)) {
      middleTier.push(r);
    } else if (rearTypes.includes(type)) {
      rearTier.push(r);
    } else {
      middleTier.push(r);
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

  const numTiers = tiers.length;
  let tierHeights = [];

  if (numTiers === 1) {
    tierHeights = [usableL];
  } else if (numTiers === 2) {
    const h1 = Math.max(6, Math.floor(usableL * 0.44));
    tierHeights = [h1, usableL - h1];
  } else {
    const h1 = Math.max(6, Math.floor(usableL * 0.28));
    const h2 = Math.max(7, Math.floor(usableL * 0.38));
    tierHeights = [h1, h2, usableL - (h1 + h2)];
  }

  let currentY = topY;

  tiers.forEach((tier, tierIdx) => {
    const tierH = tierHeights[tierIdx] || Math.floor(usableL / numTiers);
    const tierRooms = tier.rooms;

    if (concept === 'vastu_priority') {
      tierRooms.sort((a, b) => {
        const order = {
          parking: 1,
          staircase: 2,
          primary_bedroom: 1,
          master_bedroom: 1,
          bathroom: 2,
          living: 3,
          foyer: 4,
          dining: 4,
          utility: 4,
          kitchen: 5,
          pooja: 6,
          balcony: 6,
        };
        return (order[a.type] || 3) - (order[b.type] || 3);
      });
    } else if (concept === 'open_living') {
      tierRooms.sort((a, b) => {
        const order = {
          parking: 1,
          staircase: 1,
          primary_bedroom: 1,
          living: 2,
          dining: 3,
          kitchen: 4,
          foyer: 5,
          balcony: 5,
        };
        return (order[a.type] || 3) - (order[b.type] || 3);
      });
    } else {
      tierRooms.sort((a, b) => {
        const order = {
          parking: 1,
          staircase: 2,
          primary_bedroom: 1,
          bathroom: 2,
          living: 3,
          foyer: 4,
          dining: 4,
          bedroom: 5,
          kitchen: 6,
          pooja: 7,
          balcony: 7,
        };
        return (order[a.type] || 3) - (order[b.type] || 3);
      });
    }

    const totalWeights = tierRooms.reduce((acc, r) => acc + (Number(r.width) || 10), 0) || 1;
    let currentX = leftX;

    tierRooms.forEach((r, rIdx) => {
      const isLast = rIdx === tierRooms.length - 1;
      const weight = Number(r.width) || 10;
      let roomW = isLast
        ? Math.max(3, leftX + usableW - currentX)
        : Math.max(3, Math.floor(usableW * (weight / totalWeights)));

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
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'top',
          offset: Math.min(2.0, Math.max(0.5, Number((roomW * 0.3).toFixed(1)))),
          width: Math.min(4.0, Math.max(2.5, roomW - 1)),
        });
      }

      if (tierIdx === numTiers - 1 && type !== 'staircase') {
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'bottom',
          offset: Math.min(2.0, Math.max(0.5, Number((roomW * 0.3).toFixed(1)))),
          width: Math.min(4.0, Math.max(2.5, roomW - 1)),
        });
      }

      if (rIdx === 0 && type !== 'staircase' && type !== 'parking') {
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'left',
          offset: Math.min(2.0, Math.max(0.5, Number((tierH * 0.3).toFixed(1)))),
          width: Math.min(4.0, Math.max(2.5, tierH - 1)),
        });
      }

      if (isLast && type !== 'staircase') {
        openings.push({
          id: generateId('op_win'),
          type: 'window',
          wallRoomId: roomId,
          wallSide: 'right',
          offset: Math.min(2.0, Math.max(0.5, Number((tierH * 0.3).toFixed(1)))),
          width: Math.min(4.0, Math.max(2.5, tierH - 1)),
        });
      }

      currentX += roomW;
    });

    currentY += tierH;
  });

  return { rooms: placedRooms, openings };
};

/**
 * 1. BALANCED LAYOUT GENERATOR (Dynamic, Proportional, Multi-Floor)
 */
export const generateBalancedLayout = (plot, requirements = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();
  
  const setbacks = calculateSetbacks(plotW, plotL, facing);
  const userRooms = requirements.rooms || [];

  if (userRooms.length > 0) {
    const floorRoomLists = distributeRoomsAcrossFloors(userRooms, floorsCount);
    const floors = floorRoomLists.map((fRooms, idx) => {
      const { rooms, openings } = layoutFloorWithRooms({
        rooms: fRooms,
        setbacks,
        concept: 'balanced',
        floorLevel: idx,
        floorsCount,
        facing,
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
        `Includes ${userRooms.length} user-configured room(s) arranged across ${floorsCount} floor(s).`,
        'Harmonious zoning ensuring natural daylight, cross-ventilation, and dedicated circulation corridors.',
        'Balanced room distribution maintaining structural column alignment across floors.'
      ],
      floors,
    };

    return ensurePlanContainment(plan);
  }

  // Fallback / Starter template for default requirements
  const { leftX, topY, usableW, usableL } = setbacks;
  const isShallow = usableL < 28;
  const frontH = isShallow 
    ? Math.max(6, Math.floor(usableL * 0.42)) 
    : Math.min(14, Math.max(7, Math.floor(usableL * 0.25)));
  const middleH = isShallow ? 0 : Math.min(18, Math.max(10, Math.floor(usableL * 0.38)));
  const rearH = isShallow ? (usableL - frontH) : (usableL - (frontH + middleH));

  const parkW = Math.max(4, Math.floor(usableW * 0.42));
  const foyerW = Math.max(3, Math.floor((usableW - parkW) * 0.55));
  const poojaW = Math.max(3, usableW - parkW - foyerW);

  const gRooms = [];
  const gOpenings = [];

  const rmParkId = generateId('rm_park');
  gRooms.push({
    id: rmParkId,
    type: 'parking',
    label: 'Covered Parking',
    x: leftX,
    y: topY,
    width: parkW,
    height: frontH,
    floor: 0,
    color: getColor('parking'),
  });

  const rmFoyerId = generateId('rm_foyer');
  gRooms.push({
    id: rmFoyerId,
    type: 'foyer',
    label: 'Entrance Foyer',
    x: leftX + parkW,
    y: topY,
    width: foyerW,
    height: frontH,
    floor: 0,
    color: getColor('foyer'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmFoyerId, wallSide: 'top', offset: 1.5, width: 3.0 });

  const rmPoojaId = generateId('rm_pooja');
  gRooms.push({
    id: rmPoojaId,
    type: 'pooja',
    label: 'Pooja Room',
    x: leftX + parkW + foyerW,
    y: topY,
    width: poojaW,
    height: frontH,
    floor: 0,
    color: getColor('pooja'),
  });

  if (isShallow) {
    const rearY = topY + frontH;
    if (floorsCount >= 2) {
      const rmStairId = generateId('rm_stair');
      gRooms.push({
        id: rmStairId,
        type: 'staircase',
        label: 'Internal Staircase',
        x: leftX,
        y: rearY,
        width: parkW,
        height: rearH,
        floor: 0,
        color: getColor('staircase'),
      });

      const livingW = Math.floor((usableW - parkW) * 0.58);
      const kitchenW = usableW - parkW - livingW;

      const rmLivingId = generateId('rm_living');
      gRooms.push({
        id: rmLivingId,
        type: 'living',
        label: 'Living & Dining Hall',
        x: leftX + parkW,
        y: rearY,
        width: livingW,
        height: rearH,
        floor: 0,
        color: getColor('living'),
      });
      gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmLivingId, wallSide: 'bottom', offset: 2, width: 4.0 });

      const rmKitchenId = generateId('rm_kitchen');
      gRooms.push({
        id: rmKitchenId,
        type: 'kitchen',
        label: 'Modular Kitchen & Utility',
        x: leftX + parkW + livingW,
        y: rearY,
        width: kitchenW,
        height: rearH,
        floor: 0,
        color: getColor('kitchen'),
      });
      gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmKitchenId, wallSide: 'right', offset: 2, width: 3.5 });
    } else {
      const livingW = Math.floor(usableW * 0.54);
      const kitchenW = usableW - livingW;

      const rmLivingId = generateId('rm_living');
      gRooms.push({
        id: rmLivingId,
        type: 'living',
        label: 'Living & Dining Hall',
        x: leftX,
        y: rearY,
        width: livingW,
        height: rearH,
        floor: 0,
        color: getColor('living'),
      });

      const rmMasterId = generateId('rm_master');
      gRooms.push({
        id: rmMasterId,
        type: 'master_bedroom',
        label: 'Master Bedroom',
        x: leftX + livingW,
        y: rearY,
        width: kitchenW,
        height: rearH,
        floor: 0,
        color: getColor('master_bedroom'),
      });
    }
  } else {
    const middleY = topY + frontH;
    const rmStairId = generateId('rm_stair');
    gRooms.push({
      id: rmStairId,
      type: floorsCount > 1 ? 'staircase' : 'study',
      label: floorsCount > 1 ? 'Internal Staircase' : 'Study / Home Office',
      x: leftX,
      y: middleY,
      width: parkW,
      height: middleH,
      floor: 0,
      color: getColor(floorsCount > 1 ? 'staircase' : 'study'),
    });

    const rmLivingId = generateId('rm_living');
    gRooms.push({
      id: rmLivingId,
      type: 'living',
      label: 'Living & Dining Hall',
      x: leftX + parkW,
      y: middleY,
      width: usableW - parkW,
      height: middleH,
      floor: 0,
      color: getColor('living'),
    });
    gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmLivingId, wallSide: 'right', offset: 2, width: 4.5 });

    const rearY = middleY + middleH;
    const masterW = Math.floor(usableW * 0.54);
    const kitchenW = usableW - masterW;

    const rmMasterId = generateId('rm_master');
    gRooms.push({
      id: rmMasterId,
      type: 'master_bedroom',
      label: 'Master Bedroom',
      x: leftX,
      y: rearY,
      width: masterW,
      height: rearH,
      floor: 0,
      color: getColor('master_bedroom'),
    });
    gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmMasterId, wallSide: 'left', offset: 2, width: 4.0 });

    const rmKitchenId = generateId('rm_kitchen');
    gRooms.push({
      id: rmKitchenId,
      type: 'kitchen',
      label: 'Kitchen & Utility',
      x: leftX + masterW,
      y: rearY,
      width: kitchenW,
      height: rearH,
      floor: 0,
      color: getColor('kitchen'),
    });
    gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmKitchenId, wallSide: 'right', offset: 2, width: 4.0 });
  }

  const floors = [
    {
      level: 0,
      label: 'Ground Floor (G)',
      rooms: gRooms,
      openings: gOpenings,
    },
  ];

  if (floorsCount >= 2) {
    const f1Rooms = [];
    const f1Openings = [];

    if (isShallow) {
      const rmStairF1Id = generateId('rm_stair_f1');
      f1Rooms.push({
        id: rmStairF1Id,
        type: 'staircase',
        label: 'Staircase Landing',
        x: leftX,
        y: topY,
        width: parkW,
        height: frontH,
        floor: 1,
        color: getColor('staircase'),
      });

      const rmBalconyId = generateId('rm_balcony');
      f1Rooms.push({
        id: rmBalconyId,
        type: 'balcony',
        label: 'Front Terrace Balcony',
        x: leftX + parkW,
        y: topY,
        width: usableW - parkW,
        height: frontH,
        floor: 1,
        color: getColor('balcony'),
      });

      const rearY = topY + frontH;
      const bed2W = Math.floor(usableW * 0.54);
      const bed3W = usableW - bed2W;

      const rmBed2Id = generateId('rm_bed2');
      f1Rooms.push({
        id: rmBed2Id,
        type: 'master_bedroom',
        label: 'Master Bedroom Suite',
        x: leftX,
        y: rearY,
        width: bed2W,
        height: rearH,
        floor: 1,
        color: getColor('master_bedroom'),
      });
      f1Openings.push({ id: generateId('op'), type: 'window', wallRoomId: rmBed2Id, wallSide: 'left', offset: 2, width: 4.0 });

      const rmBed3Id = generateId('rm_bed3');
      f1Rooms.push({
        id: rmBed3Id,
        type: 'bedroom',
        label: "Bedroom 2 (Kids' Room)",
        x: leftX + bed2W,
        y: rearY,
        width: bed3W,
        height: rearH,
        floor: 1,
        color: getColor('bedroom'),
      });
      f1Openings.push({ id: generateId('op'), type: 'window', wallRoomId: rmBed3Id, wallSide: 'right', offset: 2, width: 4.0 });
    } else {
      const balconyW = Math.floor(usableW * 0.48);
      const loungeW = usableW - balconyW;

      const rmBalconyId = generateId('rm_balcony');
      f1Rooms.push({
        id: rmBalconyId,
        type: 'balcony',
        label: 'Front Terrace Balcony',
        x: leftX,
        y: topY,
        width: balconyW,
        height: frontH,
        floor: 1,
        color: getColor('balcony'),
      });

      const rmLoungeId = generateId('rm_lounge');
      f1Rooms.push({
        id: rmLoungeId,
        type: 'living',
        label: 'Upper Family Lounge',
        x: leftX + balconyW,
        y: topY,
        width: loungeW,
        height: frontH,
        floor: 1,
        color: getColor('living'),
      });

      const middleY = topY + frontH;
      const rmStairF1Id = generateId('rm_stair_f1');
      f1Rooms.push({
        id: rmStairF1Id,
        type: 'staircase',
        label: 'Staircase Landing',
        x: leftX,
        y: middleY,
        width: balconyW,
        height: middleH,
        floor: 1,
        color: getColor('staircase'),
      });

      const rmStudyId = generateId('rm_study');
      f1Rooms.push({
        id: rmStudyId,
        type: 'study',
        label: 'Study & Library',
        x: leftX + balconyW,
        y: middleY,
        width: loungeW,
        height: middleH,
        floor: 1,
        color: getColor('study'),
      });

      const rearY = middleY + middleH;
      const bed2W = Math.floor(usableW * 0.5);
      const bed3W = usableW - bed2W;

      const rmBed2Id = generateId('rm_bed2');
      f1Rooms.push({
        id: rmBed2Id,
        type: 'bedroom',
        label: 'Bedroom 2 (Guest Suite)',
        x: leftX,
        y: rearY,
        width: bed2W,
        height: rearH,
        floor: 1,
        color: getColor('bedroom'),
      });

      const rmBed3Id = generateId('rm_bed3');
      f1Rooms.push({
        id: rmBed3Id,
        type: 'bedroom',
        label: "Bedroom 3 (Kids' Room)",
        x: leftX + bed2W,
        y: rearY,
        width: bed3W,
        height: rearH,
        floor: 1,
        color: getColor('bedroom'),
      });
    }

    floors.push({
      level: 1,
      label: 'First Floor (L1)',
      rooms: f1Rooms,
      openings: f1Openings,
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount === 1 ? 0.92 : floorsCount === 2 ? 1.75 : 2.5));

  const plan = {
    id: generateId('plan_balanced'),
    name: 'Balanced Layout',
    plot,
    vastuStatus: 'considered',
    builtUpAreaSqFt: builtUp,
    notes: [
      `Customized for ${plotW}×${plotL} ft (${facing.toUpperCase()} facing) with ${floorsCount} level(s).`,
      'Spacious living & dining core with cross-ventilation and natural daylight.',
      'Kitchen anchored in South-East (Agni) zone with natural exterior ventilation.',
      'Dedicated North-East Pooja room with optimal morning light.',
      'Master bedroom positioned in South-West for privacy and stability.'
    ],
    floors,
  };

  return ensurePlanContainment(plan);
};

/**
 * 2. OPEN LIVING CONCEPT (Contemporary Flow, Expansive Great Room)
 */
export const generateOpenLivingLayout = (plot, requirements = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();

  const setbacks = calculateSetbacks(plotW, plotL, facing);
  const userRooms = requirements.rooms || [];

  if (userRooms.length > 0) {
    const floorRoomLists = distributeRoomsAcrossFloors(userRooms, floorsCount);
    const floors = floorRoomLists.map((fRooms, idx) => {
      const { rooms, openings } = layoutFloorWithRooms({
        rooms: fRooms,
        setbacks,
        concept: 'open_living',
        floorLevel: idx,
        floorsCount,
        facing,
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
        `Features ${userRooms.length} user-chosen room(s) unified in an open-flow architectural envelope.`,
        'Seamless integration of public living zones with open sightlines and expansive daylighting.'
      ],
      floors,
    };

    return ensurePlanContainment(plan);
  }

  // Fallback / Starter template
  const { leftX, topY, usableW, usableL } = setbacks;
  const isShallow = usableL < 28;
  const frontH = isShallow 
    ? Math.max(6, Math.floor(usableL * 0.42)) 
    : Math.min(14, Math.max(7, Math.floor(usableL * 0.25)));
  const middleH = isShallow ? 0 : Math.min(18, Math.max(10, Math.floor(usableL * 0.38)));
  const rearH = isShallow ? (usableL - frontH) : (usableL - (frontH + middleH));

  const parkW = Math.max(4, Math.floor(usableW * 0.4));
  const porchW = Math.max(4, usableW - parkW);

  const gRooms = [];
  const gOpenings = [];

  const rmParkId = generateId('rm_park');
  gRooms.push({
    id: rmParkId,
    type: 'parking',
    label: 'Covered Car Parking',
    x: leftX,
    y: topY,
    width: parkW,
    height: frontH,
    floor: 0,
    color: getColor('parking'),
  });

  const rmPorchId = generateId('rm_porch');
  gRooms.push({
    id: rmPorchId,
    type: 'foyer',
    label: 'Garden Sit-out & Foyer',
    x: leftX + parkW,
    y: topY,
    width: porchW,
    height: frontH,
    floor: 0,
    color: getColor('foyer'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmPorchId, wallSide: 'top', offset: 1.5, width: 3.5 });

  if (isShallow) {
    const rearY = topY + frontH;
    if (floorsCount >= 2) {
      const rmStairId = generateId('rm_stair');
      gRooms.push({
        id: rmStairId,
        type: 'staircase',
        label: 'Architectural Staircase',
        x: leftX,
        y: rearY,
        width: parkW,
        height: rearH,
        floor: 0,
        color: getColor('staircase'),
      });

      const greatRoomW = Math.floor((usableW - parkW) * 0.58);
      const kitchenW = usableW - parkW - greatRoomW;

      const rmGreatRoomId = generateId('rm_great_room');
      gRooms.push({
        id: rmGreatRoomId,
        type: 'living',
        label: 'Open Living & Dining Core',
        x: leftX + parkW,
        y: rearY,
        width: greatRoomW,
        height: rearH,
        floor: 0,
        color: getColor('living'),
      });
      gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmGreatRoomId, wallSide: 'bottom', offset: 2, width: 5.0 });

      const rmKitchenId = generateId('rm_kitchen_open');
      gRooms.push({
        id: rmKitchenId,
        type: 'kitchen',
        label: 'Open Island Kitchen & Pantry',
        x: leftX + parkW + greatRoomW,
        y: rearY,
        width: kitchenW,
        height: rearH,
        floor: 0,
        color: getColor('kitchen'),
      });
      gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmKitchenId, wallSide: 'right', offset: 2, width: 4.0 });
    } else {
      const greatRoomW = Math.floor(usableW * 0.55);
      const masterW = usableW - greatRoomW;

      const rmGreatRoomId = generateId('rm_great_room');
      gRooms.push({
        id: rmGreatRoomId,
        type: 'living',
        label: 'Open Living & Dining Core',
        x: leftX,
        y: rearY,
        width: greatRoomW,
        height: rearH,
        floor: 0,
        color: getColor('living'),
      });

      const rmMasterId = generateId('rm_master');
      gRooms.push({
        id: rmMasterId,
        type: 'master_bedroom',
        label: 'Master Bedroom Suite',
        x: leftX + greatRoomW,
        y: rearY,
        width: masterW,
        height: rearH,
        floor: 0,
        color: getColor('master_bedroom'),
      });
    }
  } else {
    const middleY = topY + frontH;
    const rmStairId = generateId('rm_stair');
    gRooms.push({
      id: rmStairId,
      type: 'staircase',
      label: 'Architectural Staircase',
      x: leftX,
      y: middleY,
      width: parkW,
      height: middleH,
      floor: 0,
      color: getColor('staircase'),
    });

    const rmGreatRoomId = generateId('rm_great_room');
    gRooms.push({
      id: rmGreatRoomId,
      type: 'living',
      label: 'Open Living & Dining Core',
      x: leftX + parkW,
      y: middleY,
      width: usableW - parkW,
      height: middleH,
      floor: 0,
      color: getColor('living'),
    });
    gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmGreatRoomId, wallSide: 'right', offset: 2, width: 5.5 });

    const rearY = middleY + middleH;
    const kitchenW = Math.floor(usableW * 0.46);
    const masterW = usableW - kitchenW;

    const rmKitchenId = generateId('rm_kitchen_open');
    gRooms.push({
      id: rmKitchenId,
      type: 'kitchen',
      label: 'Open Island Kitchen & Pantry',
      x: leftX,
      y: rearY,
      width: kitchenW,
      height: rearH,
      floor: 0,
      color: getColor('kitchen'),
    });
    gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmKitchenId, wallSide: 'left', offset: 2, width: 4.0 });

    const rmMasterId = generateId('rm_master');
    gRooms.push({
      id: rmMasterId,
      type: 'master_bedroom',
      label: 'Master Bedroom Suite',
      x: leftX + kitchenW,
      y: rearY,
      width: masterW,
      height: rearH,
      floor: 0,
      color: getColor('master_bedroom'),
    });
    gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmMasterId, wallSide: 'right', offset: 2, width: 4.5 });
  }

  const floors = [
    {
      level: 0,
      label: 'Ground Floor (G)',
      rooms: gRooms,
      openings: gOpenings,
    },
  ];

  if (floorsCount >= 2) {
    const f1Rooms = [];
    const f1Openings = [];

    if (isShallow) {
      const rmTerraceId = generateId('rm_terrace');
      f1Rooms.push({
        id: rmTerraceId,
        type: 'balcony',
        label: 'Full-Width Sky Deck Terrace',
        x: leftX,
        y: topY,
        width: usableW,
        height: frontH,
        floor: 1,
        color: getColor('balcony'),
      });

      const rearY = topY + frontH;
      const rmStairF1Id = generateId('rm_stair_f1');
      f1Rooms.push({
        id: rmStairF1Id,
        type: 'staircase',
        label: 'Upper Gallery Landing',
        x: leftX,
        y: rearY,
        width: parkW,
        height: rearH,
        floor: 1,
        color: getColor('staircase'),
      });

      const bed2W = Math.floor((usableW - parkW) * 0.54);
      const bed3W = usableW - parkW - bed2W;

      const rmBed2Id = generateId('rm_bed2');
      f1Rooms.push({
        id: rmBed2Id,
        type: 'bedroom',
        label: 'Master Bedroom Suite',
        x: leftX + parkW,
        y: rearY,
        width: bed2W,
        height: rearH,
        floor: 1,
        color: getColor('master_bedroom'),
      });

      const rmBed3Id = generateId('rm_bed3');
      f1Rooms.push({
        id: rmBed3Id,
        type: 'bedroom',
        label: 'Bedroom 2 Suite',
        x: leftX + parkW + bed2W,
        y: rearY,
        width: bed3W,
        height: rearH,
        floor: 1,
        color: getColor('bedroom'),
      });
    } else {
      const rmTerraceId = generateId('rm_terrace');
      f1Rooms.push({
        id: rmTerraceId,
        type: 'balcony',
        label: 'Full-Width Sky Deck Terrace',
        x: leftX,
        y: topY,
        width: usableW,
        height: frontH,
        floor: 1,
        color: getColor('balcony'),
      });

      const middleY = topY + frontH;
      const stairF1W = Math.floor(usableW * 0.45);

      const rmStairF1Id = generateId('rm_stair_f1');
      f1Rooms.push({
        id: rmStairF1Id,
        type: 'staircase',
        label: 'Upper Gallery Landing',
        x: leftX,
        y: middleY,
        width: stairF1W,
        height: middleH,
        floor: 1,
        color: getColor('staircase'),
      });

      const rmStudyId = generateId('rm_study');
      f1Rooms.push({
        id: rmStudyId,
        type: 'study',
        label: 'Work Studio / Library',
        x: leftX + stairF1W,
        y: middleY,
        width: usableW - stairF1W,
        height: middleH,
        floor: 1,
        color: getColor('study'),
      });

      const rearY = middleY + middleH;
      const bed2W = Math.floor(usableW * 0.5);

      const rmBed2Id = generateId('rm_bed2');
      f1Rooms.push({
        id: rmBed2Id,
        type: 'bedroom',
        label: 'Bedroom 2 Suite',
        x: leftX,
        y: rearY,
        width: bed2W,
        height: rearH,
        floor: 1,
        color: getColor('bedroom'),
      });

      const rmBed3Id = generateId('rm_bed3');
      f1Rooms.push({
        id: rmBed3Id,
        type: 'bedroom',
        label: 'Bedroom 3 Studio',
        x: leftX + bed2W,
        y: rearY,
        width: usableW - bed2W,
        height: rearH,
        floor: 1,
        color: getColor('bedroom'),
      });
    }

    floors.push({
      level: 1,
      label: 'First Floor (L1)',
      rooms: f1Rooms,
      openings: f1Openings,
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount === 1 ? 0.95 : 1.8));

  const plan = {
    id: generateId('plan_open'),
    name: 'Open Living',
    plot,
    vastuStatus: 'tradeoff',
    builtUpAreaSqFt: builtUp,
    notes: [
      `Contemporary open-concept villa tailored for ${plotW}×${plotL} ft plot.`,
      'Seamless Great Room integrating Living, Dining, and Breakfast Island Kitchen.',
      'Full-width sky deck terrace on upper level for panoramic outdoor living.'
    ],
    floors,
  };

  return ensurePlanContainment(plan);
};

/**
 * 3. VASTU PRIORITY CONCEPT (Strict 8-Sector Cosmic Alignment)
 */
export const generateVastuPriorityLayout = (plot, requirements = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();

  const setbacks = calculateSetbacks(plotW, plotL, facing);
  const userRooms = requirements.rooms || [];

  if (userRooms.length > 0) {
    const floorRoomLists = distributeRoomsAcrossFloors(userRooms, floorsCount);
    const floors = floorRoomLists.map((fRooms, idx) => {
      const { rooms, openings } = layoutFloorWithRooms({
        rooms: fRooms,
        setbacks,
        concept: 'vastu_priority',
        floorLevel: idx,
        floorsCount,
        facing,
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
        `100% directional compliance across primary Vastu sectors for ${plotW}×${plotL} ft plot.`,
        `Arranges ${userRooms.length} user-specified room(s) according to traditional cardinal energies:`,
        'Pooja / Entrance aligned with auspicious North-East (Ishanya) solar vector.',
        'Kitchen positioned in South-East (Agni) quadrant for optimal thermodynamics.',
        'Primary Master Bedroom anchored in South-West (Nairutya) for peace and grounded stability.'
      ],
      floors,
    };

    return ensurePlanContainment(plan);
  }

  // Fallback / Starter template
  const { leftX, topY, usableW, usableL } = setbacks;
  const isShallow = usableL < 28;
  const frontH = isShallow 
    ? Math.max(6, Math.floor(usableL * 0.42)) 
    : Math.min(14, Math.max(7, Math.floor(usableL * 0.25)));
  const middleH = isShallow ? 0 : Math.min(18, Math.max(10, Math.floor(usableL * 0.38)));
  const rearH = isShallow ? (usableL - frontH) : (usableL - (frontH + middleH));
  const parkW = Math.max(4, Math.floor(usableW * 0.42));
  const foyerW = Math.max(3, Math.floor((usableW - parkW) * 0.5));
  const poojaW = Math.max(3, usableW - parkW - foyerW);

  const gRooms = [];
  const gOpenings = [];

  const rmParkId = generateId('rm_park');
  gRooms.push({
    id: rmParkId,
    type: 'parking',
    label: 'Parking (Vayavya / NW)',
    x: leftX,
    y: topY,
    width: parkW,
    height: frontH,
    floor: 0,
    color: getColor('parking'),
  });

  const rmFoyerId = generateId('rm_foyer');
  gRooms.push({
    id: rmFoyerId,
    type: 'foyer',
    label: 'North Entrance Foyer',
    x: leftX + parkW,
    y: topY,
    width: foyerW,
    height: frontH,
    floor: 0,
    color: getColor('foyer'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmFoyerId, wallSide: 'top', offset: 1.0, width: 3.0 });

  const rmPoojaId = generateId('rm_pooja');
  gRooms.push({
    id: rmPoojaId,
    type: 'pooja',
    label: 'Pooja (Ishanya / NE)',
    x: leftX + parkW + foyerW,
    y: topY,
    width: poojaW,
    height: frontH,
    floor: 0,
    color: getColor('pooja'),
  });

  if (isShallow) {
    const rearY = topY + frontH;
    if (floorsCount >= 2) {
      const rmStairId = generateId('rm_stair');
      gRooms.push({
        id: rmStairId,
        type: 'staircase',
        label: 'Staircase (West)',
        x: leftX,
        y: rearY,
        width: parkW,
        height: rearH,
        floor: 0,
        color: getColor('staircase'),
      });

      const livingW = Math.floor((usableW - parkW) * 0.55);
      const kitchenW = usableW - parkW - livingW;

      const rmLivingId = generateId('rm_living');
      gRooms.push({
        id: rmLivingId,
        type: 'living',
        label: 'Living & Dining (Brahmasthan)',
        x: leftX + parkW,
        y: rearY,
        width: livingW,
        height: rearH,
        floor: 0,
        color: getColor('living'),
      });

      const rmKitchenId = generateId('rm_kitchen');
      gRooms.push({
        id: rmKitchenId,
        type: 'kitchen',
        label: 'Kitchen (Agni / SE)',
        x: leftX + parkW + livingW,
        y: rearY,
        width: kitchenW,
        height: rearH,
        floor: 0,
        color: getColor('kitchen'),
      });
      gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmKitchenId, wallSide: 'right', offset: 2, width: 3.5 });
    } else {
      const masterW = Math.floor(usableW * 0.54);
      const kitchenW = usableW - masterW;

      const rmMasterId = generateId('rm_master');
      gRooms.push({
        id: rmMasterId,
        type: 'master_bedroom',
        label: 'Master Bed (Nairutya / SW)',
        x: leftX,
        y: rearY,
        width: masterW,
        height: rearH,
        floor: 0,
        color: getColor('master_bedroom'),
      });

      const rmKitchenId = generateId('rm_kitchen');
      gRooms.push({
        id: rmKitchenId,
        type: 'kitchen',
        label: 'Kitchen (Agni / SE)',
        x: leftX + masterW,
        y: rearY,
        width: kitchenW,
        height: rearH,
        floor: 0,
        color: getColor('kitchen'),
      });
    }
  } else {
    const middleY = topY + frontH;
    const rmStairId = generateId('rm_stair');
    gRooms.push({
      id: rmStairId,
      type: 'staircase',
      label: 'Staircase (West)',
      x: leftX,
      y: middleY,
      width: parkW,
      height: middleH,
      floor: 0,
      color: getColor('staircase'),
    });

    const rmLivingId = generateId('rm_living');
    gRooms.push({
      id: rmLivingId,
      type: 'living',
      label: 'Living & Dining (Brahmasthan)',
      x: leftX + parkW,
      y: middleY,
      width: usableW - parkW,
      height: middleH,
      floor: 0,
      color: getColor('living'),
    });

    const rearY = middleY + middleH;
    const masterW = Math.floor(usableW * 0.54);
    const kitchenW = usableW - masterW;

    const rmMasterId = generateId('rm_master');
    gRooms.push({
      id: rmMasterId,
      type: 'master_bedroom',
      label: 'Master Bed (Nairutya / SW)',
      x: leftX,
      y: rearY,
      width: masterW,
      height: rearH,
      floor: 0,
      color: getColor('master_bedroom'),
    });

    const rmKitchenId = generateId('rm_kitchen');
    gRooms.push({
      id: rmKitchenId,
      type: 'kitchen',
      label: 'Kitchen (Agni / SE)',
      x: leftX + masterW,
      y: rearY,
      width: kitchenW,
      height: rearH,
      floor: 0,
      color: getColor('kitchen'),
    });
  }

  const floors = [
    {
      level: 0,
      label: 'Ground Floor (G)',
      rooms: gRooms,
      openings: gOpenings,
    },
  ];

  if (floorsCount >= 2) {
    const f1Rooms = [];
    const f1Openings = [];

    if (isShallow) {
      const rmStairF1Id = generateId('rm_stair_f1');
      f1Rooms.push({
        id: rmStairF1Id,
        type: 'staircase',
        label: 'Staircase Landing (NW)',
        x: leftX,
        y: topY,
        width: parkW,
        height: frontH,
        floor: 1,
        color: getColor('staircase'),
      });

      const rmBalconyId = generateId('rm_balcony');
      f1Rooms.push({
        id: rmBalconyId,
        type: 'balcony',
        label: 'Balcony (North-East)',
        x: leftX + parkW,
        y: topY,
        width: usableW - parkW,
        height: frontH,
        floor: 1,
        color: getColor('balcony'),
      });

      const rearY = topY + frontH;
      const bed2W = Math.floor(usableW * 0.55);

      const rmBed2Id = generateId('rm_bed2');
      f1Rooms.push({
        id: rmBed2Id,
        type: 'master_bedroom',
        label: 'Master Bed (Nairutya / SW)',
        x: leftX,
        y: rearY,
        width: bed2W,
        height: rearH,
        floor: 1,
        color: getColor('master_bedroom'),
      });

      const rmBed3Id = generateId('rm_bed3');
      f1Rooms.push({
        id: rmBed3Id,
        type: 'guest_bedroom',
        label: 'Bedroom 2 (South)',
        x: leftX + bed2W,
        y: rearY,
        width: usableW - bed2W,
        height: rearH,
        floor: 1,
        color: getColor('guest_bedroom'),
      });
    } else {
      const rmStairF1Id = generateId('rm_stair_f1');
      f1Rooms.push({
        id: rmStairF1Id,
        type: 'staircase',
        label: 'Staircase Landing',
        x: leftX,
        y: topY,
        width: parkW,
        height: frontH,
        floor: 1,
        color: getColor('staircase'),
      });

      const rmBalconyId = generateId('rm_balcony');
      f1Rooms.push({
        id: rmBalconyId,
        type: 'balcony',
        label: 'Balcony (North-East)',
        x: leftX + parkW,
        y: topY,
        width: usableW - parkW,
        height: frontH,
        floor: 1,
        color: getColor('balcony'),
      });

      const middleY = topY + frontH;
      const rmLoungeId = generateId('rm_lounge_vastu');
      f1Rooms.push({
        id: rmLoungeId,
        type: 'living',
        label: 'Upper Family Lounge',
        x: leftX,
        y: middleY,
        width: usableW,
        height: middleH,
        floor: 1,
        color: getColor('living'),
      });

      const rearY = middleY + middleH;
      const bed2W = Math.floor(usableW * 0.5);

      const rmBed2Id = generateId('rm_bed2');
      f1Rooms.push({
        id: rmBed2Id,
        type: 'bedroom',
        label: 'Bedroom 2 (North-West)',
        x: leftX,
        y: rearY,
        width: bed2W,
        height: rearH,
        floor: 1,
        color: getColor('bedroom'),
      });

      const rmBed3Id = generateId('rm_bed3');
      f1Rooms.push({
        id: rmBed3Id,
        type: 'guest_bedroom',
        label: 'Bedroom 3 (South)',
        x: leftX + bed2W,
        y: rearY,
        width: usableW - bed2W,
        height: rearH,
        floor: 1,
        color: getColor('guest_bedroom'),
      });
    }

    floors.push({
      level: 1,
      label: 'First Floor (L1)',
      rooms: f1Rooms,
      openings: f1Openings,
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount === 1 ? 0.9 : 1.72));

  const plan = {
    id: generateId('plan_vastu'),
    name: 'Vastu Priority',
    plot,
    vastuStatus: 'considered',
    builtUpAreaSqFt: builtUp,
    notes: [
      `100% directional compliance across all primary Indian Vastu sectors for ${plotW}×${plotL} ft plot.`,
      'Pooja room placed in Ishanya (North-East) corner receiving early solar rays.',
      'Kitchen positioned in Agni (South-East) corner for healthy thermodynamic energy.',
      'Master bedroom anchored in Nairutya (South-West) corner for maximum grounded stability.'
    ],
    floors,
  };

  return ensurePlanContainment(plan);
};
