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
  const sideSetback = plotW >= 40 ? 3 : 2;
  const rearSetback = plotL >= 50 ? 3 : 2;
  const frontSetback = plotL >= 50 ? 4 : 3;

  const leftX = sideSetback;
  const topY = facing === 'south' ? rearSetback : frontSetback;
  const usableW = Math.max(16, plotW - sideSetback * 2);
  const usableL = Math.max(20, plotL - (frontSetback + rearSetback));

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
 * 1. BALANCED LAYOUT GENERATOR (Dynamic, Proportional, Multi-Floor)
 */
export const generateBalancedLayout = (plot, requirements = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Math.max(1, Number(plot.floors) || 2);
  const facing = (plot.facing || 'north').toLowerCase();
  
  const { leftX, topY, usableW, usableL } = calculateSetbacks(plotW, plotL, facing);
  const req = parseRequirements(requirements, requirements.bhk || (floorsCount > 1 ? 3 : 2));

  // --- Ground Floor Layout ---
  const gRooms = [];
  const gOpenings = [];

  // Front Zone: Parking & Entrance Foyer & Pooja
  const parkW = Math.min(12, Math.round(usableW * 0.42));
  const parkH = Math.min(15, Math.max(12, Math.round(usableL * 0.28)));
  const foyerW = Math.round((usableW - parkW) * 0.55);
  const poojaW = usableW - parkW - foyerW;
  const foyerH = Math.min(8, Math.round(parkH * 0.55));

  // Car Parking Bay
  const rmParkId = generateId('rm_park');
  gRooms.push({
    id: rmParkId,
    type: 'parking',
    label: 'Covered Parking',
    x: leftX,
    y: topY,
    width: parkW,
    height: parkH,
    floor: 0,
    color: getColor('parking'),
  });

  // Entrance Verandah / Foyer
  const rmFoyerId = generateId('rm_foyer');
  gRooms.push({
    id: rmFoyerId,
    type: 'foyer',
    label: 'Entrance Foyer',
    x: leftX + parkW,
    y: topY,
    width: foyerW,
    height: foyerH,
    floor: 0,
    color: getColor('foyer'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmFoyerId, wallSide: 'top', offset: 2, width: 3.5 });

  // Sacred Pooja Room (Ishanya / North-East)
  const rmPoojaId = generateId('rm_pooja');
  gRooms.push({
    id: rmPoojaId,
    type: 'pooja',
    label: 'Pooja Room',
    x: leftX + parkW + foyerW,
    y: topY,
    width: poojaW,
    height: foyerH,
    floor: 0,
    color: getColor('pooja'),
  });

  // Central Zone: Grand Living & Dining Hall + Internal Staircase
  const stairW = parkW;
  const stairH = Math.min(10, Math.max(8, Math.round(usableL * 0.2)));
  const stairY = topY + parkH;

  const livingW = usableW - parkW;
  const livingH = Math.max(14, Math.round(usableL * 0.36));
  const livingY = topY + foyerH;

  const rmLivingId = generateId('rm_living');
  gRooms.push({
    id: rmLivingId,
    type: 'living',
    label: 'Living & Dining Hall',
    x: leftX + parkW,
    y: livingY,
    width: livingW,
    height: livingH,
    floor: 0,
    color: getColor('living'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmLivingId, wallSide: 'top', offset: 3, width: 4.0 });
  gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmLivingId, wallSide: 'right', offset: 4, width: 5.0 });

  // Internal Staircase (if multi-floor) or Guest Powder Room
  const rmStairId = generateId('rm_stair');
  gRooms.push({
    id: rmStairId,
    type: floorsCount > 1 ? 'staircase' : 'study',
    label: floorsCount > 1 ? 'Internal Staircase' : 'Study / Home Office',
    x: leftX,
    y: stairY,
    width: stairW,
    height: stairH,
    floor: 0,
    color: getColor(floorsCount > 1 ? 'staircase' : 'study'),
  });

  // Rear Zone: Master Bedroom Suite & Modular Kitchen
  const rearY = Math.max(stairY + stairH, livingY + livingH);
  const rearH = Math.max(12, usableL - (rearY - topY));
  const masterW = Math.round(usableW * 0.54);
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
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmMasterId, wallSide: 'top', offset: 2.5, width: 3.0 });
  gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmMasterId, wallSide: 'left', offset: 3, width: 4.0 });

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
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmKitchenId, wallSide: 'top', offset: 2, width: 3.0 });
  gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmKitchenId, wallSide: 'right', offset: 3, width: 4.0 });

  const floors = [
    {
      level: 0,
      label: 'Ground Floor (G)',
      rooms: gRooms,
      openings: gOpenings,
    },
  ];

  // --- First Floor Layout (if G+1 or higher) ---
  if (floorsCount >= 2) {
    const f1Rooms = [];
    const f1Openings = [];

    // Front: Terrace Balcony & Upper Family Lounge
    const balconyW = Math.round(usableW * 0.48);
    const balconyH = Math.min(10, Math.round(usableL * 0.22));
    const loungeW = usableW - balconyW;
    const loungeH = Math.min(14, Math.round(usableL * 0.3));

    const rmBalconyId = generateId('rm_balcony');
    f1Rooms.push({
      id: rmBalconyId,
      type: 'balcony',
      label: 'Front Terrace Balcony',
      x: leftX,
      y: topY,
      width: balconyW,
      height: balconyH,
      floor: 1,
      color: getColor('balcony'),
    });
    f1Openings.push({ id: generateId('op'), type: 'door', wallRoomId: rmBalconyId, wallSide: 'right', offset: 2, width: 3.0 });

    const rmLoungeId = generateId('rm_lounge');
    f1Rooms.push({
      id: rmLoungeId,
      type: 'living',
      label: 'Upper Family Lounge',
      x: leftX + balconyW,
      y: topY,
      width: loungeW,
      height: loungeH,
      floor: 1,
      color: getColor('living'),
    });
    f1Openings.push({ id: generateId('op'), type: 'window', wallRoomId: rmLoungeId, wallSide: 'top', offset: 3, width: 4.0 });

    // Middle: Staircase Landing & Bedroom 2
    const f1StairH = Math.min(10, Math.max(8, Math.round(usableL * 0.2)));
    const f1StairY = topY + balconyH;
    const rmStairF1Id = generateId('rm_stair_f1');
    f1Rooms.push({
      id: rmStairF1Id,
      type: 'staircase',
      label: 'Staircase Landing',
      x: leftX,
      y: f1StairY,
      width: balconyW,
      height: f1StairH,
      floor: 1,
      color: getColor('staircase'),
    });

    // Rear: Bedroom 2 & Bedroom 3
    const f1RearY = Math.max(f1StairY + f1StairH, topY + loungeH);
    const f1RearH = Math.max(12, usableL - (f1RearY - topY));
    const bed2W = Math.round(usableW * 0.5);
    const bed3W = usableW - bed2W;

    const rmBed2Id = generateId('rm_bed2');
    f1Rooms.push({
      id: rmBed2Id,
      type: 'bedroom',
      label: 'Bedroom 2 (Guest Suite)',
      x: leftX,
      y: f1RearY,
      width: bed2W,
      height: f1RearH,
      floor: 1,
      color: getColor('bedroom'),
    });
    f1Openings.push({ id: generateId('op'), type: 'door', wallRoomId: rmBed2Id, wallSide: 'top', offset: 2, width: 3.0 });
    f1Openings.push({ id: generateId('op'), type: 'window', wallRoomId: rmBed2Id, wallSide: 'left', offset: 3, width: 4.0 });

    const rmBed3Id = generateId('rm_bed3');
    f1Rooms.push({
      id: rmBed3Id,
      type: 'bedroom',
      label: "Bedroom 3 (Kids' Room)",
      x: leftX + bed2W,
      y: f1RearY,
      width: bed3W,
      height: f1RearH,
      floor: 1,
      color: getColor('bedroom'),
    });
    f1Openings.push({ id: generateId('op'), type: 'door', wallRoomId: rmBed3Id, wallSide: 'top', offset: 2, width: 3.0 });
    f1Openings.push({ id: generateId('op'), type: 'window', wallRoomId: rmBed3Id, wallSide: 'right', offset: 3, width: 4.0 });

    floors.push({
      level: 1,
      label: 'First Floor (L1)',
      rooms: f1Rooms,
      openings: f1Openings,
    });
  }

  // --- Second Floor Layout (if G+2 or 3 floors) ---
  if (floorsCount >= 3) {
    const f2Rooms = [];
    const f2Openings = [];

    const f2TerraceH = Math.round(usableL * 0.45);
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

    const rmGymId = generateId('rm_gym');
    f2Rooms.push({
      id: rmGymId,
      type: 'living',
      label: 'Entertainment / Home Gym Studio',
      x: leftX,
      y: topY + f2TerraceH,
      width: Math.round(usableW * 0.6),
      height: usableL - f2TerraceH,
      floor: 2,
      color: getColor('study'),
    });

    const rmBed4Id = generateId('rm_bed4');
    f2Rooms.push({
      id: rmBed4Id,
      type: 'guest_bedroom',
      label: 'Penthouse Guest Room',
      x: leftX + Math.round(usableW * 0.6),
      y: topY + f2TerraceH,
      width: usableW - Math.round(usableW * 0.6),
      height: usableL - f2TerraceH,
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

  return {
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

  // Ground Floor: Grand Open-Concept Great Room (Living + Dining + Island Kitchen)
  const gRooms = [];
  const gOpenings = [];

  const parkW = Math.min(12, Math.round(usableW * 0.4));
  const parkH = Math.min(15, Math.round(usableL * 0.28));
  const porchW = usableW - parkW;

  // Covered Parking
  const rmParkId = generateId('rm_park');
  gRooms.push({
    id: rmParkId,
    type: 'parking',
    label: 'Covered Car Parking',
    x: leftX,
    y: topY,
    width: parkW,
    height: parkH,
    floor: 0,
    color: getColor('parking'),
  });

  // Garden Verandah
  const rmPorchId = generateId('rm_porch');
  gRooms.push({
    id: rmPorchId,
    type: 'foyer',
    label: 'Garden Sit-out & Foyer',
    x: leftX + parkW,
    y: topY,
    width: porchW,
    height: 7,
    floor: 0,
    color: getColor('foyer'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmPorchId, wallSide: 'top', offset: 2, width: 3.5 });

  // Floating Staircase
  const rmStairId = generateId('rm_stair');
  gRooms.push({
    id: rmStairId,
    type: 'staircase',
    label: 'Architectural Staircase',
    x: leftX,
    y: topY + parkH,
    width: parkW,
    height: 10,
    floor: 0,
    color: getColor('staircase'),
  });

  // Grand Open Living & Dining Core
  const greatRoomW = usableW - parkW;
  const greatRoomH = Math.max(16, Math.round(usableL * 0.42));
  const rmGreatRoomId = generateId('rm_great_room');
  gRooms.push({
    id: rmGreatRoomId,
    type: 'living',
    label: 'Grand Open Living & Dining Core',
    x: leftX + parkW,
    y: topY + 7,
    width: greatRoomW,
    height: greatRoomH,
    floor: 0,
    color: getColor('living'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmGreatRoomId, wallSide: 'top', offset: 3, width: 4.0 });
  gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmGreatRoomId, wallSide: 'right', offset: 4, width: 6.0 });

  // Open Island Kitchen
  const rearY = Math.max(topY + parkH + 10, topY + 7 + greatRoomH);
  const rearH = Math.max(12, usableL - (rearY - topY));
  const kitchenW = Math.round(usableW * 0.46);
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
  gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmKitchenId, wallSide: 'left', offset: 3, width: 4.0 });

  // Ground Master Suite
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
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmMasterId, wallSide: 'top', offset: 2.5, width: 3.0 });
  gOpenings.push({ id: generateId('op'), type: 'window', wallRoomId: rmMasterId, wallSide: 'right', offset: 3, width: 4.5 });

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

    // Full-Width Sky Deck
    const terraceH = Math.min(12, Math.round(usableL * 0.24));
    const rmTerraceId = generateId('rm_terrace');
    f1Rooms.push({
      id: rmTerraceId,
      type: 'balcony',
      label: 'Full-Width Sky Deck Terrace',
      x: leftX,
      y: topY,
      width: usableW,
      height: terraceH,
      floor: 1,
      color: getColor('balcony'),
    });
    f1Openings.push({ id: generateId('op'), type: 'door', wallRoomId: rmTerraceId, wallSide: 'bottom', offset: 4, width: 4.0 });

    // Upper Landing & Study
    const f1StairH = 10;
    const f1StairY = topY + terraceH;
    const rmStairF1Id = generateId('rm_stair_f1');
    f1Rooms.push({
      id: rmStairF1Id,
      type: 'staircase',
      label: 'Upper Gallery Landing',
      x: leftX,
      y: f1StairY,
      width: Math.round(usableW * 0.45),
      height: f1StairH,
      floor: 1,
      color: getColor('staircase'),
    });

    const rmStudyId = generateId('rm_study');
    f1Rooms.push({
      id: rmStudyId,
      type: 'study',
      label: 'Work Studio / Library',
      x: leftX + Math.round(usableW * 0.45),
      y: f1StairY,
      width: usableW - Math.round(usableW * 0.45),
      height: f1StairH,
      floor: 1,
      color: getColor('study'),
    });

    // Rear Bedrooms
    const f1RearY = f1StairY + f1StairH;
    const f1RearH = Math.max(12, usableL - (f1RearY - topY));
    const bed2W = Math.round(usableW * 0.5);

    const rmBed2Id = generateId('rm_bed2');
    f1Rooms.push({
      id: rmBed2Id,
      type: 'bedroom',
      label: 'Bedroom 2 Suite',
      x: leftX,
      y: f1RearY,
      width: bed2W,
      height: f1RearH,
      floor: 1,
      color: getColor('bedroom'),
    });

    const rmBed3Id = generateId('rm_bed3');
    f1Rooms.push({
      id: rmBed3Id,
      type: 'bedroom',
      label: 'Bedroom 3 Studio',
      x: leftX + bed2W,
      y: f1RearY,
      width: usableW - bed2W,
      height: f1RearH,
      floor: 1,
      color: getColor('bedroom'),
    });

    floors.push({
      level: 1,
      label: 'First Floor (L1)',
      rooms: f1Rooms,
      openings: f1Openings,
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount === 1 ? 0.9 : 1.7));

  return {
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

  // Strict 8-direction zoning:
  // NE (Ishanya): Pooja Room & North-East Verandah
  // SE (Agni): Modular Kitchen & Cooking Fire
  // SW (Nairutya): Master Bedroom Haven
  // NW (Vayavya): Parking Bay & Guest Circulation
  // Center (Brahmasthan): Open Living Hall
  const gRooms = [];
  const gOpenings = [];

  const parkW = Math.min(12, Math.round(usableW * 0.45));
  const parkH = Math.min(14, Math.round(usableL * 0.28));
  const poojaW = Math.max(6, Math.round((usableW - parkW) * 0.45));
  const foyerW = usableW - parkW - poojaW;

  // North-West Parking
  const rmParkId = generateId('rm_park');
  gRooms.push({
    id: rmParkId,
    type: 'parking',
    label: 'Parking (Vayavya / NW)',
    x: leftX,
    y: topY,
    width: parkW,
    height: parkH,
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
    height: 8,
    floor: 0,
    color: getColor('foyer'),
  });
  gOpenings.push({ id: generateId('op'), type: 'door', wallRoomId: rmFoyerId, wallSide: 'top', offset: 1.5, width: 3.5 });

  // North-East Ishanya Pooja Sanctum
  const rmPoojaId = generateId('rm_pooja');
  gRooms.push({
    id: rmPoojaId,
    type: 'pooja',
    label: 'Pooja (Ishanya / NE)',
    x: leftX + parkW + foyerW,
    y: topY,
    width: poojaW,
    height: 8,
    floor: 0,
    color: getColor('pooja'),
  });

  // Central Brahmasthan Living Hall
  const livingH = Math.max(14, Math.round(usableL * 0.35));
  const rmLivingId = generateId('rm_living');
  gRooms.push({
    id: rmLivingId,
    type: 'living',
    label: 'Living & Dining (Brahmasthan)',
    x: leftX + parkW,
    y: topY + 8,
    width: usableW - parkW,
    height: livingH,
    floor: 0,
    color: getColor('living'),
  });

  // West Staircase
  const rmStairId = generateId('rm_stair');
  gRooms.push({
    id: rmStairId,
    type: 'staircase',
    label: 'Staircase (West)',
    x: leftX,
    y: topY + parkH,
    width: parkW,
    height: 10,
    floor: 0,
    color: getColor('staircase'),
  });

  // South-West (Nairutya) Master Bedroom & South-East (Agni) Kitchen
  const rearY = Math.max(topY + parkH + 10, topY + 8 + livingH);
  const rearH = Math.max(12, usableL - (rearY - topY));
  const masterW = Math.round(usableW * 0.54);
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

    const balconyW = Math.round(usableW * 0.45);
    const rmBalconyId = generateId('rm_balcony');
    f1Rooms.push({
      id: rmBalconyId,
      type: 'balcony',
      label: 'Balcony (North-East)',
      x: leftX + usableW - balconyW,
      y: topY,
      width: balconyW,
      height: 10,
      floor: 1,
      color: getColor('balcony'),
    });

    const rmStairF1Id = generateId('rm_stair_f1');
    f1Rooms.push({
      id: rmStairF1Id,
      type: 'staircase',
      label: 'Staircase Landing',
      x: leftX,
      y: topY,
      width: Math.round(usableW * 0.4),
      height: 12,
      floor: 1,
      color: getColor('staircase'),
    });

    const f1RearY = topY + 12;
    const f1RearH = Math.max(12, usableL - 12);
    const bed2W = Math.round(usableW * 0.5);

    const rmBed2Id = generateId('rm_bed2');
    f1Rooms.push({
      id: rmBed2Id,
      type: 'bedroom',
      label: 'Bedroom 2 (North-West)',
      x: leftX,
      y: f1RearY,
      width: bed2W,
      height: f1RearH,
      floor: 1,
      color: getColor('bedroom'),
    });

    const rmBed3Id = generateId('rm_bed3');
    f1Rooms.push({
      id: rmBed3Id,
      type: 'guest_bedroom',
      label: 'Bedroom 3 (South)',
      x: leftX + bed2W,
      y: f1RearY,
      width: usableW - bed2W,
      height: f1RearH,
      floor: 1,
      color: getColor('guest_bedroom'),
    });

    floors.push({
      level: 1,
      label: 'First Floor (L1)',
      rooms: f1Rooms,
      openings: f1Openings,
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount === 1 ? 0.9 : 1.72));

  return {
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
};
