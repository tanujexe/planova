/**
 * Lightweight heuristic feasibility engine for Indian residential briefs.
 * Evaluates requested space vs usable plot footprint.
 * Strictly adheres to PRD §10 and Spec §Feasibility panel.
 */

/**
 * Approximate minimum area guidelines (in sq.ft) for Indian residential rooms
 */
const ROOM_BASE_AREAS = {
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

/**
 * Checks basic spatial feasibility of a plot and brief
 * @param {object} plot 
 * @param {object} requirements 
 * @returns {{ isFeasible: boolean, warnings: Array<string>, requiredSqFt: number, availableSqFt: number, utilizationRatio: number }}
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

  // 2. Estimate required space
  let requiredArea = 0;

  // Common core
  requiredArea += ROOM_BASE_AREAS.living + ROOM_BASE_AREAS.dining + ROOM_BASE_AREAS.kitchen + ROOM_BASE_AREAS.utility;
  if (hasPooja) requiredArea += ROOM_BASE_AREAS.pooja;

  // Bedrooms & Bathrooms
  requiredArea += ROOM_BASE_AREAS.master_bedroom;
  if (bhk > 1) {
    requiredArea += (bhk - 1) * ROOM_BASE_AREAS.bedroom;
  }
  requiredArea += bathrooms * ROOM_BASE_AREAS.bathroom;

  // Balconies
  if (floors > 1) {
    requiredArea += ROOM_BASE_AREAS.balcony;
  }

  // Parking (on Ground floor)
  const parkingArea = (cars * ROOM_BASE_AREAS.car_parking) + (twoWheelers * ROOM_BASE_AREAS.two_wheeler);

  // Circulation & walls (approx 20%)
  const circulationAndWalls = (requiredArea + (floors * ROOM_BASE_AREAS.staircase_circulation)) * 0.22;

  const totalRequired = Math.round(requiredArea + parkingArea + (floors * ROOM_BASE_AREAS.staircase_circulation) + circulationAndWalls);

  const utilizationRatio = Number((totalRequired / totalUsableBuiltUp).toFixed(2));
  const warnings = [];

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
    warnings,
    requiredSqFt: totalRequired,
    availableSqFt: totalUsableBuiltUp,
    groundUsableSqFt: groundUsableArea,
    utilizationRatio,
  };
};
