import { generateId } from '../lib/ids.js';

/**
 * Intelligent Architectural Spatial Layout Engine
 * Generates dynamic, constraint-validated, beautifully proportioned
 * architectural floor plans for ANY plot size, facing direction, floor count, and custom room requirements.
 */

// Architectural Color Palette by Room Type
const ROOM_COLORS = {
  living: '#EFE8DC',
  dining: '#ECE3D4',
  kitchen: '#E8ECF2',
  utility: '#E2E7ED',
  master_bedroom: '#E5DCCE',
  bedroom: '#EAE1D5',
  guest_bedroom: '#EAE1D5',
  pooja: '#FEF3C7',
  bathroom: '#DCE5ED',
  attached_bathroom: '#DCE5ED',
  balcony: '#A27B5C',
  foyer: '#F7F3EB',
  parking: '#CAD1D8',
  staircase: '#D5CCC1',
  study: '#E7E2D8',
  closet: '#F4EEE6',
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
 * 1. BALANCED LAYOUT GENERATOR (Dynamic, Proportional, Multi-Floor)
 */
export const generateBalancedLayout = (plot, requirements = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();
  
  const { leftX, topY, usableW, usableL } = calculateSetbacks(plotW, plotL, facing);
  const req = parseRequirements(requirements, requirements.bhk || (floorsCount > 1 ? 3 : 2));

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

  // Front Zone: Parking & Entrance Foyer & Pooja
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
    // 2-Tier Layout for shallow plots
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
    // 3-Tier Layout for deep plots
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

  // First Floor Layout (if G+1 or higher)
  if (floorsCount >= 2) {
    const f1Rooms = [];
    const f1Openings = [];

    if (isShallow) {
      // 2-Tier First Floor
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
      // 3-Tier First Floor
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

  // Second Floor Layout (if G+2 or 3 floors)
  if (floorsCount >= 3) {
    const f2Rooms = [];
    const f2Openings = [];

    const f2TerraceH = Math.floor(usableL * 0.45);
    const rmTerraceId = generateId('rm_terrace');
    f2Rooms.push({
      id: rmTerraceId,
      type: 'balcony',
      label: 'Open Sky Terrace & Pergola',
      x: leftX,
      y: topY,
      width: usableW,
      height: f2TerraceH,
      floor: 2,
      color: getColor('balcony'),
    });

    const f2RearH = usableL - f2TerraceH;
    const f2GymW = Math.floor(usableW * 0.6);

    const rmGymId = generateId('rm_gym');
    f2Rooms.push({
      id: rmGymId,
      type: 'living',
      label: 'Entertainment / Home Gym Studio',
      x: leftX,
      y: topY + f2TerraceH,
      width: f2GymW,
      height: f2RearH,
      floor: 2,
      color: getColor('study'),
    });

    const rmBed4Id = generateId('rm_bed4');
    f2Rooms.push({
      id: rmBed4Id,
      type: 'guest_bedroom',
      label: 'Penthouse Guest Room',
      x: leftX + f2GymW,
      y: topY + f2TerraceH,
      width: usableW - f2GymW,
      height: f2RearH,
      floor: 2,
      color: getColor('guest_bedroom'),
    });

    floors.push({
      level: 2,
      label: 'Second Floor (L2)',
      rooms: f2Rooms,
      openings: f2Openings,
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

  const { leftX, topY, usableW, usableL } = calculateSetbacks(plotW, plotL, facing);

  const isShallow = usableL < 28;
  const frontH = isShallow 
    ? Math.max(6, Math.floor(usableL * 0.42)) 
    : Math.min(14, Math.max(7, Math.floor(usableL * 0.25)));
  const middleH = isShallow ? 0 : Math.min(18, Math.max(10, Math.floor(usableL * 0.38)));
  const rearH = isShallow ? (usableL - frontH) : (usableL - (frontH + middleH));

  const parkW = Math.min(12, Math.max(8, Math.floor(usableW * 0.4)));
  const porchW = usableW - parkW;

  const gRooms = [];
  const gOpenings = [];

  // Front Zone: Covered Parking & Garden Sit-out
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
        label: 'Grand Open Living & Dining Core',
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
        label: 'Grand Open Living & Dining Core',
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
    // 3-Tier Layout for deep plots
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
      label: 'Grand Open Living & Dining Core',
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

  const { leftX, topY, usableW, usableL } = calculateSetbacks(plotW, plotL, facing);

  const isShallow = usableL < 28;
  const frontH = isShallow 
    ? Math.max(6, Math.floor(usableL * 0.42)) 
    : Math.min(14, Math.max(7, Math.floor(usableL * 0.25)));
  const middleH = isShallow ? 0 : Math.min(18, Math.max(10, Math.floor(usableL * 0.38)));
  const parkW = Math.max(4, Math.floor(usableW * 0.42));
  const foyerW = Math.max(3, Math.floor((usableW - parkW) * 0.5));
  const poojaW = Math.max(3, usableW - parkW - foyerW);

  const gRooms = [];
  const gOpenings = [];

  // North-West Parking
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

  // North Entrance Foyer
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

  // North-East Ishanya Pooja Sanctum
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
    // 3-Tier Layout for deep plots
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
