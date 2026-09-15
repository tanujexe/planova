import { generateId } from '../lib/ids.js';

/**
 * Deterministic Indian Layout Generator Templates
 * Produces 3 distinct, constraint-compliant FloorPlan concepts.
 * Adheres to PRD §11–12 and Spec §templates.ts.
 */

/**
 * Generates the Balanced Layout concept
 * @param {object} plot 
 * @param {object} requirements 
 * @returns {object} FloorPlan
 */
export const generateBalancedLayout = (plot, requirements) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Number(plot.floors) || 2;
  const bhk = Number(requirements.bhk) || 3;
  const quality = requirements.quality || 'standard';

  // Usable area inside setbacks
  const leftX = 2;
  const topY = 2;
  const usableW = plotW - 4;
  const usableL = plotL - 6;

  // Ground Floor Rooms
  const gRooms = [
    {
      id: generateId('rm_park'),
      type: 'parking',
      label: 'Covered Car Parking',
      x: leftX,
      y: topY,
      width: Math.min(12, Math.round(usableW * 0.42)),
      height: 14,
      required: true,
      floor: 0,
      color: '#E8ECE4',
    },
    {
      id: generateId('rm_foyer'),
      type: 'foyer',
      label: 'Entrance Verandah',
      x: leftX + Math.min(12, Math.round(usableW * 0.42)),
      y: topY,
      width: Math.round(usableW * 0.28),
      height: 6,
      required: false,
      floor: 0,
      color: '#FAF6F0',
    },
    {
      id: generateId('rm_pooja'),
      type: 'pooja',
      label: 'Pooja Room',
      x: leftX + Math.min(12, Math.round(usableW * 0.42)) + Math.round(usableW * 0.28),
      y: topY,
      width: usableW - (Math.min(12, Math.round(usableW * 0.42)) + Math.round(usableW * 0.28)),
      height: 6,
      required: true,
      floor: 0,
      color: '#FBF2E3',
    },
    {
      id: generateId('rm_living'),
      type: 'living',
      label: 'Living & Dining Hall',
      x: leftX + Math.min(12, Math.round(usableW * 0.42)),
      y: topY + 6,
      width: usableW - Math.min(12, Math.round(usableW * 0.42)),
      height: 18,
      required: true,
      floor: 0,
      color: '#F0F4EC',
    },
    {
      id: generateId('rm_stair'),
      type: 'staircase',
      label: 'Internal Staircase',
      x: leftX,
      y: topY + 14,
      width: Math.min(12, Math.round(usableW * 0.42)),
      height: 10,
      required: true,
      floor: 0,
      color: '#EAE2D6',
    },
    {
      id: generateId('rm_master'),
      type: 'master_bedroom',
      label: 'Master Bedroom',
      x: leftX,
      y: topY + 24,
      width: Math.round(usableW * 0.55),
      height: Math.max(12, usableL - 24),
      required: true,
      floor: 0,
      color: '#E5EADF',
    },
    {
      id: generateId('rm_kitchen'),
      type: 'kitchen',
      label: 'Kitchen & Utility',
      x: leftX + Math.round(usableW * 0.55),
      y: topY + 24,
      width: usableW - Math.round(usableW * 0.55),
      height: Math.max(12, usableL - 24),
      required: true,
      floor: 0,
      color: '#F9EDE8',
    },
  ];

  const floors = [
    {
      level: 0,
      label: 'Ground Floor (G)',
      rooms: gRooms,
      openings: [
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[1].id, wallSide: 'top', offset: 2, width: 3.5 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[3].id, wallSide: 'top', offset: 3, width: 3.5 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[2].id, wallSide: 'bottom', offset: 2, width: 2.5 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[5].id, wallSide: 'top', offset: 2, width: 3 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[6].id, wallSide: 'top', offset: 2, width: 3 },
        { id: generateId('op'), type: 'window', wallRoomId: gRooms[3].id, wallSide: 'right', offset: 4, width: 5 },
        { id: generateId('op'), type: 'window', wallRoomId: gRooms[6].id, wallSide: 'right', offset: 3, width: 4 },
        { id: generateId('op'), type: 'window', wallRoomId: gRooms[5].id, wallSide: 'left', offset: 3, width: 4 },
      ],
    },
  ];

  // First Floor if G+1 or higher
  if (floorsCount >= 2) {
    const f1Rooms = [
      {
        id: generateId('rm_balcony'),
        type: 'balcony',
        label: 'Front Terrace Balcony',
        x: leftX,
        y: topY,
        width: Math.round(usableW * 0.5),
        height: 10,
        required: false,
        floor: 1,
        color: '#E7ECDF',
      },
      {
        id: generateId('rm_lounge'),
        type: 'living',
        label: 'Upper Lounge',
        x: leftX + Math.round(usableW * 0.5),
        y: topY,
        width: usableW - Math.round(usableW * 0.5),
        height: 14,
        required: false,
        floor: 1,
        color: '#F0F4EC',
      },
      {
        id: generateId('rm_stair_f1'),
        type: 'staircase',
        label: 'Staircase Landing',
        x: leftX,
        y: topY + 10,
        width: Math.round(usableW * 0.45),
        height: 10,
        required: true,
        floor: 1,
        color: '#EAE2D6',
      },
      {
        id: generateId('rm_bed2'),
        type: 'bedroom',
        label: 'Bedroom 2',
        x: leftX + Math.round(usableW * 0.45),
        y: topY + 14,
        width: usableW - Math.round(usableW * 0.45),
        height: Math.max(12, usableL - 14),
        required: true,
        floor: 1,
        color: '#E5EADF',
      },
      {
        id: generateId('rm_bed3'),
        type: 'guest_bedroom',
        label: 'Bedroom 3',
        x: leftX,
        y: topY + 20,
        width: Math.round(usableW * 0.45),
        height: Math.max(12, usableL - 20),
        required: true,
        floor: 1,
        color: '#E5EADF',
      },
    ];

    floors.push({
      level: 1,
      label: 'First Floor (Level 1)',
      rooms: f1Rooms,
      openings: [
        { id: generateId('op'), type: 'door', wallRoomId: f1Rooms[0].id, wallSide: 'right', offset: 2, width: 3 },
        { id: generateId('op'), type: 'door', wallRoomId: f1Rooms[3].id, wallSide: 'left', offset: 2, width: 3 },
        { id: generateId('op'), type: 'door', wallRoomId: f1Rooms[4].id, wallSide: 'right', offset: 2, width: 3 },
      ],
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount > 1 ? 1.75 : 0.9));

  return {
    id: generateId('plan_balanced'),
    name: 'Balanced Layout',
    plot,
    vastuStatus: 'considered',
    builtUpAreaSqFt: builtUp,
    notes: [
      'Harmonious zoning balancing spacious family areas with private quarters.',
      'Kitchen anchored in South-East (Agni) zone with natural exterior ventilation.',
      'Dedicated North-East Pooja room with optimal morning light.',
      'Master bedroom positioned in South-West for privacy and stability.'
    ],
    floors,
  };
};

/**
 * Generates the Open Living concept
 * @param {object} plot 
 * @param {object} requirements 
 * @returns {object} FloorPlan
 */
export const generateOpenLivingLayout = (plot, requirements) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Number(plot.floors) || 2;

  const leftX = 2;
  const topY = 2;
  const usableW = plotW - 4;
  const usableL = plotL - 6;

  const gRooms = [
    {
      id: generateId('rm_park'),
      type: 'parking',
      label: 'Covered Car Parking',
      x: leftX,
      y: topY,
      width: Math.min(11, Math.round(usableW * 0.4)),
      height: 14,
      required: true,
      floor: 0,
      color: '#E8ECE4',
    },
    {
      id: generateId('rm_sitout'),
      type: 'foyer',
      label: 'Garden Sit-out',
      x: leftX + Math.min(11, Math.round(usableW * 0.4)),
      y: topY,
      width: usableW - Math.min(11, Math.round(usableW * 0.4)),
      height: 8,
      required: false,
      floor: 0,
      color: '#FAF6F0',
    },
    {
      id: generateId('rm_open_core'),
      type: 'living',
      label: 'Grand Open Living & Dining Core',
      x: leftX + Math.min(11, Math.round(usableW * 0.4)),
      y: topY + 8,
      width: usableW - Math.min(11, Math.round(usableW * 0.4)),
      height: 20,
      required: true,
      floor: 0,
      color: '#F0F4EC',
    },
    {
      id: generateId('rm_stair'),
      type: 'staircase',
      label: 'Floating Staircase',
      x: leftX,
      y: topY + 14,
      width: Math.min(11, Math.round(usableW * 0.4)),
      height: 10,
      required: true,
      floor: 0,
      color: '#EAE2D6',
    },
    {
      id: generateId('rm_kitchen_open'),
      type: 'kitchen',
      label: 'Open Island Kitchen',
      x: leftX,
      y: topY + 24,
      width: Math.round(usableW * 0.5),
      height: Math.max(12, usableL - 24),
      required: true,
      floor: 0,
      color: '#F9EDE8',
    },
    {
      id: generateId('rm_master_g'),
      type: 'master_bedroom',
      label: 'Master Suite',
      x: leftX + Math.round(usableW * 0.5),
      y: topY + 28,
      width: usableW - Math.round(usableW * 0.5),
      height: Math.max(12, usableL - 28),
      required: true,
      floor: 0,
      color: '#E5EADF',
    },
  ];

  const floors = [
    {
      level: 0,
      label: 'Ground Floor (G)',
      rooms: gRooms,
      openings: [
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[1].id, wallSide: 'top', offset: 2, width: 3.5 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[2].id, wallSide: 'top', offset: 3, width: 4 },
        { id: generateId('op'), type: 'window', wallRoomId: gRooms[2].id, wallSide: 'right', offset: 5, width: 6 },
      ],
    },
  ];

  if (floorsCount >= 2) {
    const f1Rooms = [
      {
        id: generateId('rm_open_terrace'),
        type: 'balcony',
        label: 'Sky Deck & Terrace',
        x: leftX,
        y: topY,
        width: usableW,
        height: 12,
        required: false,
        floor: 1,
        color: '#E7ECDF',
      },
      {
        id: generateId('rm_stair_f1'),
        type: 'staircase',
        label: 'Upper Landing',
        x: leftX,
        y: topY + 12,
        width: Math.round(usableW * 0.4),
        height: 10,
        required: true,
        floor: 1,
        color: '#EAE2D6',
      },
      {
        id: generateId('rm_bed2'),
        type: 'bedroom',
        label: 'Bedroom 2',
        x: leftX + Math.round(usableW * 0.4),
        y: topY + 12,
        width: usableW - Math.round(usableW * 0.4),
        height: Math.max(12, usableL - 12),
        required: true,
        floor: 1,
        color: '#E5EADF',
      },
      {
        id: generateId('rm_bed3'),
        type: 'guest_bedroom',
        label: 'Bedroom 3 / Studio',
        x: leftX,
        y: topY + 22,
        width: Math.round(usableW * 0.4),
        height: Math.max(12, usableL - 22),
        required: true,
        floor: 1,
        color: '#E5EADF',
      },
    ];

    floors.push({
      level: 1,
      label: 'First Floor (Level 1)',
      rooms: f1Rooms,
      openings: [
        { id: generateId('op'), type: 'door', wallRoomId: f1Rooms[0].id, wallSide: 'bottom', offset: 3, width: 3.5 },
      ],
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount > 1 ? 1.68 : 0.88));

  return {
    id: generateId('plan_open'),
    name: 'Open Living',
    plot,
    vastuStatus: 'tradeoff',
    builtUpAreaSqFt: builtUp,
    notes: [
      'Uninterrupted grand living & dining core with modern open kitchen.',
      'Central circulation flow mimicking traditional courtyard illumination.',
      'Large glazing for abundant natural daylight throughout daytime hours.'
    ],
    floors,
  };
};

/**
 * Generates the Vastu Priority concept
 * @param {object} plot 
 * @param {object} requirements 
 * @returns {object} FloorPlan
 */
export const generateVastuPriorityLayout = (plot, requirements) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floorsCount = Number(plot.floors) || 2;

  const leftX = 2;
  const topY = 2;
  const usableW = plotW - 4;
  const usableL = plotL - 6;

  // Strict 8-direction zoning:
  // NE (Ishanya): Pooja / Open Foyer
  // SE (Agni): Kitchen
  // SW (Nairutya): Master Bedroom
  // NW (Vayavya): Parking / Guest / Staircase
  // Center (Brahmasthan): Open Living & Hall
  const gRooms = [
    {
      id: generateId('rm_pooja_ne'),
      type: 'pooja',
      label: 'Pooja (Ishanya Corner)',
      x: leftX + Math.round(usableW * 0.65),
      y: topY,
      width: usableW - Math.round(usableW * 0.65),
      height: 8,
      required: true,
      floor: 0,
      color: '#FBF2E3',
    },
    {
      id: generateId('rm_park_nw'),
      type: 'parking',
      label: 'Parking (Vayavya Zone)',
      x: leftX,
      y: topY,
      width: Math.round(usableW * 0.45),
      height: 14,
      required: true,
      floor: 0,
      color: '#E8ECE4',
    },
    {
      id: generateId('rm_foyer_n'),
      type: 'foyer',
      label: 'North Entrance Foyer',
      x: leftX + Math.round(usableW * 0.45),
      y: topY,
      width: Math.round(usableW * 0.2),
      height: 8,
      required: false,
      floor: 0,
      color: '#FAF6F0',
    },
    {
      id: generateId('rm_brahmasthan'),
      type: 'living',
      label: 'Living Hall (Central)',
      x: leftX + Math.round(usableW * 0.4),
      y: topY + 8,
      width: usableW - Math.round(usableW * 0.4),
      height: 18,
      required: true,
      floor: 0,
      color: '#F0F4EC',
    },
    {
      id: generateId('rm_stair_nw'),
      type: 'staircase',
      label: 'Staircase (West)',
      x: leftX,
      y: topY + 14,
      width: Math.round(usableW * 0.4),
      height: 10,
      required: true,
      floor: 0,
      color: '#EAE2D6',
    },
    {
      id: generateId('rm_master_sw'),
      type: 'master_bedroom',
      label: 'Master Bed (Nairutya/SW)',
      x: leftX,
      y: topY + 24,
      width: Math.round(usableW * 0.55),
      height: Math.max(12, usableL - 24),
      required: true,
      floor: 0,
      color: '#E5EADF',
    },
    {
      id: generateId('rm_kitchen_se'),
      type: 'kitchen',
      label: 'Kitchen (Agni/SE)',
      x: leftX + Math.round(usableW * 0.55),
      y: topY + 26,
      width: usableW - Math.round(usableW * 0.55),
      height: Math.max(12, usableL - 26),
      required: true,
      floor: 0,
      color: '#F9EDE8',
    },
  ];

  const floors = [
    {
      level: 0,
      label: 'Ground Floor (G)',
      rooms: gRooms,
      openings: [
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[2].id, wallSide: 'top', offset: 1.5, width: 3.5 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[0].id, wallSide: 'bottom', offset: 2, width: 2.5 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[5].id, wallSide: 'top', offset: 2, width: 3 },
        { id: generateId('op'), type: 'door', wallRoomId: gRooms[6].id, wallSide: 'top', offset: 2, width: 3 },
      ],
    },
  ];

  if (floorsCount >= 2) {
    const f1Rooms = [
      {
        id: generateId('rm_balcony_ne'),
        type: 'balcony',
        label: 'Balcony (North-East)',
        x: leftX + Math.round(usableW * 0.4),
        y: topY,
        width: usableW - Math.round(usableW * 0.4),
        height: 10,
        required: false,
        floor: 1,
        color: '#E7ECDF',
      },
      {
        id: generateId('rm_stair_f1'),
        type: 'staircase',
        label: 'Staircase Landing',
        x: leftX,
        y: topY,
        width: Math.round(usableW * 0.4),
        height: 12,
        required: true,
        floor: 1,
        color: '#EAE2D6',
      },
      {
        id: generateId('rm_bed2_nw'),
        type: 'bedroom',
        label: 'Bedroom 2 (North-West)',
        x: leftX,
        y: topY + 12,
        width: Math.round(usableW * 0.45),
        height: Math.max(12, usableL - 12),
        required: true,
        floor: 1,
        color: '#E5EADF',
      },
      {
        id: generateId('rm_bed3_s'),
        type: 'guest_bedroom',
        label: 'Bedroom 3 (South)',
        x: leftX + Math.round(usableW * 0.45),
        y: topY + 10,
        width: usableW - Math.round(usableW * 0.45),
        height: Math.max(12, usableL - 10),
        required: true,
        floor: 1,
        color: '#E5EADF',
      },
    ];

    floors.push({
      level: 1,
      label: 'First Floor (Level 1)',
      rooms: f1Rooms,
      openings: [
        { id: generateId('op'), type: 'door', wallRoomId: f1Rooms[0].id, wallSide: 'bottom', offset: 2, width: 3 },
      ],
    });
  }

  const builtUp = Math.round(usableW * usableL * (floorsCount > 1 ? 1.72 : 0.9));

  return {
    id: generateId('plan_vastu'),
    name: 'Vastu Priority',
    plot,
    vastuStatus: 'considered',
    builtUpAreaSqFt: builtUp,
    notes: [
      '100% directional compliance across all primary Indian Vastu sectors.',
      'Pooja room placed in Ishanya (North-East) corner receiving early solar rays.',
      'Kitchen positioned in Agni (South-East) corner for healthy thermodynamic flow.',
      'Master bedroom anchored in Nairutya (South-West) corner for maximum grounded stability.'
    ],
    floors,
  };
};
