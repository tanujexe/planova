/**
 * Lightweight heuristic feasibility engine for Indian residential briefs.
 * Evaluates requested space vs usable plot footprint.
 * Strictly adheres to PRD §10 and Spec §Feasibility panel.
 */

/**
 * Approximate minimum area guidelines (in sq.ft) for Indian residential rooms
 */
export const ROOM_BASE_AREAS = {
  living: 220,
  dining: 120,
  kitchen: 100,
  utility: 40,
  master_bedroom: 160,
  bedroom: 130,
  bathroom: 40,
  attached_bathroom: 45,
  pooja: 35,
  study: 90,
  balcony: 70,
  car_parking: 140,
  two_wheeler: 25,
  staircase_circulation: 180, // per floor
};

export const ROOM_AREA_BOUNDS = {
  master_bedroom: { min: 130, max: 240, default: 160 },
  primary_bedroom: { min: 130, max: 240, default: 160 },
  bedroom: { min: 100, max: 180, default: 130 },
  guest_bedroom: { min: 100, max: 160, default: 120 },
  living: { min: 160, max: 360, default: 220 },
  dining: { min: 90, max: 200, default: 120 },
  kitchen: { min: 70, max: 160, default: 100 },
  bathroom: { min: 32, max: 70, default: 40 },
  primary_bathroom: { min: 45, max: 100, default: 55 },
  attached_bathroom: { min: 40, max: 80, default: 45 },
  pooja: { min: 20, max: 60, default: 35 },
  study: { min: 65, max: 150, default: 90 },
  utility: { min: 25, max: 60, default: 40 },
  balcony: { min: 40, max: 130, default: 70 },
  parking: { min: 130, max: 240, default: 140 },
  car_parking: { min: 130, max: 240, default: 140 },
  two_wheeler: { min: 20, max: 40, default: 25 },
  staircase: { min: 60, max: 120, default: 70 },
  staircase_circulation: { min: 140, max: 240, default: 180 },
  foyer: { min: 30, max: 90, default: 45 },
};

/**
 * Computes dynamic room areas scaled by plot footprint, floor count, and BHK configuration.
 * Prevents flat room sizing across 2BHK vs 4BHK briefs and enforces architectural bounds.
 * @param {object} plot 
 * @param {object} requirements 
 * @returns {Record<string, number>}
 */
export const computeDynamicRoomAreas = (plot = {}, requirements = {}) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const plotArea = plotW * plotL;
  const bhk = Number(requirements.bhk) || 3;

  // Scale factor: baseline 1500 sq.ft plot, clamped between 0.85 and 1.35
  const plotScale = Math.min(1.35, Math.max(0.85, Math.sqrt(plotArea / 1500)));
  // BHK scale factor: 2BHK compacts slightly, 4BHK/5BHK expands living & master suites
  const bhkScale = Math.min(1.25, Math.max(0.90, 1 + (bhk - 3) * 0.05));
  const compositeScale = plotScale * bhkScale;

  const dynamicAreas = {};
  for (const [roomType, baseArea] of Object.entries(ROOM_BASE_AREAS)) {
    const bounds = ROOM_AREA_BOUNDS[roomType] || { min: Math.round(baseArea * 0.7), max: Math.round(baseArea * 1.5) };
    const scaled = Math.round(baseArea * compositeScale);
    dynamicAreas[roomType] = Math.min(bounds.max, Math.max(bounds.min, scaled));
  }

  return dynamicAreas;
};

/**
 * Checks basic spatial feasibility of a plot and brief
 * @param {object} plot 
 * @param {object} requirements 
 * @returns {{
 *   isFeasible: boolean,
 *   congestionLevel: 'comfortable' | 'tight' | 'highly_constrained' | 'not_feasible',
 *   warnings: Array<string>,
 *   requiredSqFt: number,
 *   availableSqFt: number,
 *   groundUsableSqFt: number,
 *   utilizationRatio: number,
 *   dynamicRoomAreas: Record<string, number>
 * }}
 */
export const checkBriefFeasibility = (plot, requirements) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const floors = Number(plot.floors) || 2;
  const bhk = Number(requirements.bhk) || 3;
  const cars = Number(requirements.parking?.cars) || 1;
  const twoWheelers = Number(requirements.parking?.twoWheelers) || 1;
  const hasPooja = Boolean(requirements.rooms?.some(r => r.type === 'pooja') || requirements.hasPooja);
  const bathrooms = Number(requirements.bathrooms) || 2;

  // 1. Calculate usable ground footprint after approximate setbacks (3ft front, 3ft rear, 2ft sides)
  const usableWidth = Math.max(10, plotW - 4);
  const usableLength = Math.max(15, plotL - 6);
  const groundUsableArea = usableWidth * usableLength;
  const totalUsableBuiltUp = groundUsableArea * floors;

  // 2. Compute dynamic room areas based on plot footprint and BHK configuration
  const dynamicAreas = computeDynamicRoomAreas(plot, requirements);

  // 3. Estimate required space dynamically
  let requiredArea = 0;

  // Common core
  requiredArea += dynamicAreas.living + dynamicAreas.dining + dynamicAreas.kitchen + dynamicAreas.utility;
  if (hasPooja) requiredArea += dynamicAreas.pooja;

  // Bedrooms & Bathrooms
  requiredArea += dynamicAreas.master_bedroom;
  if (bhk > 1) {
    requiredArea += (bhk - 1) * dynamicAreas.bedroom;
  }
  requiredArea += bathrooms * dynamicAreas.bathroom;

  // Balconies
  if (floors > 1) {
    requiredArea += dynamicAreas.balcony;
  }

  // Parking (on Ground floor)
  const parkingArea = (cars * dynamicAreas.car_parking) + (twoWheelers * dynamicAreas.two_wheeler);

  // Circulation & walls (approx 22%)
  const circulationAndWalls = (requiredArea + (floors * dynamicAreas.staircase_circulation)) * 0.22;

  const totalRequired = Math.round(requiredArea + parkingArea + (floors * dynamicAreas.staircase_circulation) + circulationAndWalls);

  const utilizationRatio = Number((totalRequired / totalUsableBuiltUp).toFixed(2));
  const warnings = [];

  // Per-room bounds check for user-selected rooms with explicit dimensions
  if (Array.isArray(requirements.rooms)) {
    requirements.rooms.forEach((r) => {
      const bounds = ROOM_AREA_BOUNDS[r.type];
      const hasExplicitSize = Boolean(r.area || (r.width && r.height));
      if (hasExplicitSize && bounds) {
        const area = Number(r.area) || ((Number(r.width) || 0) * (Number(r.height) || 0));
        if (area > 0 && area < bounds.min) {
          warnings.push(`Room "${r.label || r.type}" (${area} sq.ft) is below architectural minimum (${bounds.min} sq.ft).`);
        } else if (area > bounds.max) {
          warnings.push(`Room "${r.label || r.type}" (${area} sq.ft) exceeds recommended maximum (${bounds.max} sq.ft).`);
        }
      }
    });
  }

  let congestionLevel = 'comfortable';
  if (utilizationRatio > 1.35) {
    congestionLevel = 'not_feasible';
  } else if (utilizationRatio > 1.15) {
    congestionLevel = 'highly_constrained';
  } else if (utilizationRatio > 0.90) {
    congestionLevel = 'tight';
  }

  // Rules checks:
  if (parkingArea > groundUsableArea * 0.45) {
    warnings.push(`Parking for ${cars} car(s) and ${twoWheelers} two-wheeler(s) consumes over 45% of your ground floor footprint.`);
  }

  if (utilizationRatio > 1.25) {
    warnings.push(
      `Your requested ${bhk} BHK layout requires approximately ~${totalRequired} sq.ft, which exceeds the optimal capacity (~${totalUsableBuiltUp} sq.ft) of a ${plotW}×${plotL} ft plot across ${floors === 1 ? '1 floor' : `${floors} floors`}. Room dimensions may need significant compaction.`
    );
  } else if (utilizationRatio > 1.05) {
    warnings.push(
      `Spatial density is tight (~${Math.round(utilizationRatio * 100)}% utilization). Circulation corridors and room sizes will be optimized compactly.`
    );
  }

  if (plotW < 20 && cars > 1) {
    warnings.push(`A plot width of ${plotW} ft is narrow for side-by-side multi-car parking.`);
  }

  return {
    isFeasible: warnings.length === 0,
    congestionLevel,
    warnings,
    requiredSqFt: totalRequired,
    availableSqFt: totalUsableBuiltUp,
    groundUsableSqFt: groundUsableArea,
    utilizationRatio,
    dynamicRoomAreas: dynamicAreas,
  };
};
