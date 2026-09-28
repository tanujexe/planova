/**
 * Explicit Architectural Circulation & Topology Engine
 * Dynamically selects circulation topology based on usable envelope proportions:
 * 
 * 1. Narrow Row-House (usableW < 18 ft):
 *    Single-loaded side corridor (3.0 ft) or living-as-spine; rooms stacked front-to-back.
 * 2. Standard Suburban (18 <= usableW <= 32 ft):
 *    Central or side passage (3.0 - 3.5 ft) separating public front zone from private rear zone.
 * 3. Wide / Shallow Plot (usableW > 32 ft or usableL/usableW < 1.0):
 *    Dual wings joined by a central circulation hall.
 */

import { CIRCULATION_CONFIG } from './config.js';
import { generateId } from '../lib/ids.js';

export const TOPOLOGY_TYPES = {
  NARROW_SPINE: 'narrow_spine',
  CENTRAL_PASSAGE: 'central_passage',
  DUAL_WING: 'dual_wing',
};

/**
 * Selects circulation topology based on usable envelope dimensions
 * @param {number} usableW 
 * @param {number} usableL 
 * @returns {'narrow_spine' | 'central_passage' | 'dual_wing'}
 */
export const selectCirculationTopology = (usableW, usableL) => {
  const aspectRatio = usableL / usableW;

  if (usableW < 18.0) {
    return TOPOLOGY_TYPES.NARROW_SPINE;
  }
  if (usableW > 32.0 || aspectRatio < 1.0) {
    return TOPOLOGY_TYPES.DUAL_WING;
  }
  return TOPOLOGY_TYPES.CENTRAL_PASSAGE;
};

/**
 * Generates explicit corridor geometries for a floor
 * @param {{
 *   usableW: number,
 *   usableL: number,
 *   leftX: number,
 *   topY: number,
 *   topology: string,
 *   corridorSide?: 'left' | 'right' | 'center',
 *   splitY?: number,
 *   floorLevel?: number
 * }} params 
 * @returns {Array<object>} Array of corridor room rectangles
 */
export const generateCorridorGeometry = ({
  usableW,
  usableL,
  leftX,
  topY,
  topology,
  corridorSide = 'center',
  splitY = null,
  floorLevel = 0,
}) => {
  const corridors = [];
  const minW = CIRCULATION_CONFIG.minPassageWidth; // 3.0 ft
  const prefW = CIRCULATION_CONFIG.preferredPassageWidth; // 3.5 ft

  const pWidth = usableW >= 24 ? prefW : minW;

  switch (topology) {
    case TOPOLOGY_TYPES.NARROW_SPINE: {
      // Single-loaded side corridor running along one edge
      const isLeft = corridorSide === 'left';
      const corrX = isLeft ? leftX : leftX + usableW - pWidth;
      const corrY = topY + 8.0; // Starts after front entry / verandah
      const corrH = Math.max(8.0, usableL - 10.0);

      corridors.push({
        id: generateId(`corr_spine_f${floorLevel}`),
        type: 'corridor',
        label: 'Circulation Passage',
        x: Number(corrX.toFixed(2)),
        y: Number(corrY.toFixed(2)),
        width: Number(pWidth.toFixed(2)),
        height: Number(corrH.toFixed(2)),
        floor: floorLevel,
        color: '#F4EFE6',
      });
      break;
    }

    case TOPOLOGY_TYPES.DUAL_WING: {
      // Central connector passage connecting left and right wings
      const corrW = Math.max(3.5, pWidth);
      const corrX = Math.round(leftX + (usableW - corrW) / 2);
      const corrY = topY + Math.round(usableL * 0.28);
      const corrH = Math.round(usableL * 0.44);

      corridors.push({
        id: generateId(`corr_central_f${floorLevel}`),
        type: 'corridor',
        label: 'Central Atrium Passage',
        x: Number(corrX.toFixed(2)),
        y: Number(corrY.toFixed(2)),
        width: Number(corrW.toFixed(2)),
        height: Number(corrH.toFixed(2)),
        floor: floorLevel,
        color: '#F4EFE6',
      });
      break;
    }

    case TOPOLOGY_TYPES.CENTRAL_PASSAGE:
    default: {
      // Transverse connector between public front (living) and private rear (beds)
      // or central longitudinal corridor
      const midY = splitY !== null ? splitY : topY + Math.round(usableL * 0.46);
      const corrH = pWidth;

      corridors.push({
        id: generateId(`corr_trans_f${floorLevel}`),
        type: 'corridor',
        label: 'Main Circulation Corridor',
        x: Number(leftX.toFixed(2)),
        y: Number(midY.toFixed(2)),
        width: Number(usableW.toFixed(2)),
        height: Number(corrH.toFixed(2)),
        floor: floorLevel,
        color: '#F4EFE6',
      });
      break;
    }
  }

  return corridors;
};
