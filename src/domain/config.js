/**
 * Architectural Standards & Municipal Bye-Law Configuration
 * Single Source of Truth for Indian Residential Bye-Laws (NBC / Local Municipal Corporation Defaults)
 * 
 * Convention: Coordinates (x, y, width, height) use the CLEAR-DIMENSION convention:
 * Dimensions represent net usable room space inside plaster-finished wall faces.
 * External wall thickness is 0.75 ft (9-inch brick/RCC), internal partitions are 0.375 ft (4.5-inch).
 */

export const WALL_CONFIG = {
  external: 0.75, // 9 inches
  internal: 0.375, // 4.5 inches
  dimensionConvention: 'clear_dimensions', // Clear room dimension between finished faces
};

export const ROOM_STANDARDS = {
  living: {
    minArea: 100,
    minWidth: 8.0,
    maxAspect: 2.0,
    preferredAspect: 1.3,
    priority: 1, // Core space
    habitable: true,
  },
  dining: {
    minArea: 60,
    minWidth: 7.0,
    maxAspect: 2.0,
    preferredAspect: 1.25,
    priority: 3, // Optional or can merge with living
    habitable: true,
  },
  master_bedroom: {
    minArea: 100,
    minWidth: 9.0, // Master bedroom preferred >= 9-10ft
    maxAspect: 2.0,
    preferredAspect: 1.15,
    priority: 1, // Core space
    habitable: true,
  },
  primary_bedroom: {
    minArea: 100,
    minWidth: 9.0,
    maxAspect: 2.0,
    preferredAspect: 1.15,
    priority: 1,
    habitable: true,
  },
  bedroom: {
    minArea: 100,
    minWidth: 8.0,
    maxAspect: 2.0,
    preferredAspect: 1.2,
    priority: 2,
    habitable: true,
  },
  guest_bedroom: {
    minArea: 80,
    minWidth: 8.0,
    maxAspect: 2.0,
    preferredAspect: 1.2,
    priority: 3,
    habitable: true,
  },
  kitchen: {
    minArea: 48,
    minWidth: 6.0,
    maxAspect: 2.0,
    preferredAspect: 1.35,
    priority: 1,
    habitable: true,
  },
  bathroom: {
    minArea: 20,
    minWidth: 3.5,
    maxAspect: 2.5,
    preferredAspect: 1.4,
    priority: 2,
    habitable: false,
  },
  primary_bathroom: {
    minArea: 25,
    minWidth: 4.0,
    maxAspect: 2.5,
    preferredAspect: 1.4,
    priority: 2,
    habitable: false,
  },
  attached_bathroom: {
    minArea: 20,
    minWidth: 3.5,
    maxAspect: 2.5,
    preferredAspect: 1.4,
    priority: 2,
    habitable: false,
  },
  wc: {
    minArea: 12,
    minWidth: 3.0,
    maxAspect: 2.5,
    preferredAspect: 1.3,
    priority: 3,
    habitable: false,
  },
  pooja: {
    minArea: 16,
    minWidth: 4.0,
    maxAspect: 1.5,
    preferredAspect: 1.1,
    priority: 2,
    habitable: false,
  },
  study: {
    minArea: 60,
    minWidth: 7.0,
    maxAspect: 2.0,
    preferredAspect: 1.25,
    priority: 4, // Drop/shrink candidate if space tight
    habitable: true,
  },
  utility: {
    minArea: 24,
    minWidth: 4.0,
    maxAspect: 2.5,
    preferredAspect: 1.5,
    priority: 3,
    habitable: false,
  },
  dressing: {
    minArea: 24,
    minWidth: 4.0,
    maxAspect: 2.5,
    preferredAspect: 1.2,
    priority: 4,
    habitable: false,
  },
  foyer: {
    minArea: 25,
    minWidth: 4.0,
    maxAspect: 2.2,
    preferredAspect: 1.4,
    priority: 3,
    habitable: false,
  },
  balcony: {
    minArea: 30,
    minWidth: 3.5,
    maxAspect: 3.0,
    preferredAspect: 2.0,
    priority: 4,
    habitable: false,
  },
  staircase: {
    minArea: 60,
    minWidth: 6.0,
    maxAspect: 2.0,
    preferredAspect: 1.4,
    priority: 1, // Core vertical circulation
    habitable: false,
  },
  parking: {
    minArea: 162, // 9 x 18 ft NBC single car bay
    minWidth: 9.0,
    maxAspect: 2.5,
    preferredAspect: 2.0,
    priority: 2,
    habitable: false,
  },
  corridor: {
    minArea: 15,
    minWidth: 3.0,
    maxAspect: 10.0,
    preferredAspect: 4.0,
    priority: 1,
    habitable: false,
  },
};

export const CIRCULATION_CONFIG = {
  minPassageWidth: 3.0,
  preferredPassageWidth: 3.5,
  targetPercentageMin: 0.10, // 10% of gross built-up
  targetPercentageMax: 0.14, // 14% of gross built-up
};

export const PARKING_CONFIG = {
  bayWidth: 9.0,
  bayLength: 18.0,
  minBayArea: 162, // 9 * 18
  twoWheelerWidth: 3.5,
  twoWheelerLength: 7.0,
  maxGroundEnvelopeWidthRatio: 0.35, // Covered parking <= 35% of envelope width
};

export const STAIRCASE_CONFIG = {
  minFlightWidth: 3.0,
  coreWidth: 7.0,
  coreLength: 10.0,
  coreArea: 70,
};

/**
 * Returns standard bounds for any room type with safe fallbacks
 */
export const getRoomStandard = (type) => {
  const norm = (type || '').toLowerCase();
  return ROOM_STANDARDS[norm] || {
    minArea: 40,
    minWidth: 5.0,
    maxAspect: 2.5,
    preferredAspect: 1.25,
    priority: 3,
    habitable: false,
  };
};
