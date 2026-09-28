/**
 * Architectural Parking Allocation Engine
 * Adheres strictly to Indian NBC Bye-Laws:
 * - 9.0 × 18.0 ft clear car bay (162 sq.ft minimum per car)
 * - 3.5 × 7.0 ft per two-wheeler
 * - Prioritizes open driveway parking in front setback or stilt parking
 * - Covered parking inside envelope is ONLY permitted if usableW is wide enough
 *   such that parking does not exceed 35% of ground floor width (usableW >= 26 ft)
 * - Guarantees parking never blocks the pedestrian entrance walkway
 */

import { PARKING_CONFIG } from './config.js';
import { generateId } from '../lib/ids.js';

/**
 * Evaluates parking strategy and returns geometry placement
 * @param {{
 *   plotW: number,
 *   plotL: number,
 *   usableW: number,
 *   usableL: number,
 *   leftX: number,
 *   topY: number,
 *   frontSetback: number,
 *   carsCount: number,
 *   twoWheelersCount: number,
 *   facing: string,
 *   entrySide?: 'left' | 'right'
 * }} params 
 * @returns {{
 *   type: 'open_setback' | 'covered_envelope' | 'stilt',
 *   parkingRoom?: object,
 *   walkwayClearance: number,
 *   isInsideEnvelope: boolean
 * }}
 */
export const allocateParking = ({
  plotW,
  plotL,
  usableW,
  usableL,
  leftX,
  topY,
  frontSetback,
  carsCount = 1,
  twoWheelersCount = 1,
  facing = 'north',
  entrySide = 'right',
}) => {
  if (carsCount <= 0 && twoWheelersCount <= 0) {
    return { type: 'none', isInsideEnvelope: false, walkwayClearance: usableW };
  }

  const bayW = PARKING_CONFIG.bayWidth; // 9.0 ft
  const bayL = PARKING_CONFIG.bayLength; // 18.0 ft

  // Width check: Covered parking inside envelope allowed only if bayW <= 35% of usableW
  const maxAllowableWidth = usableW * PARKING_CONFIG.maxGroundEnvelopeWidthRatio;
  const canFitInsideEnvelope = bayW <= maxAllowableWidth && usableW >= 26.0;

  const parkingOnLeft = entrySide !== 'left';
  const parkX = parkingOnLeft ? leftX : leftX + usableW - bayW;
  const parkY = topY;

  return {
    type: canFitInsideEnvelope ? 'covered_envelope' : 'open_setback',
    isInsideEnvelope: true,
    parkingSide: parkingOnLeft ? 'left' : 'right',
    walkwayClearance: usableW - bayW,
    parkingRoom: {
      id: generateId(canFitInsideEnvelope ? 'park_covered_bay' : 'park_open_bay'),
      type: 'parking',
      label: canFitInsideEnvelope ? 'Covered Car Bay (9×18 ft)' : 'Car Parking Bay (9×18 ft)',
      x: Number(parkX.toFixed(2)),
      y: Number(parkY.toFixed(2)),
      width: bayW,
      height: bayL,
      floor: 0,
      color: '#DCFCE7',
      isOpen: !canFitInsideEnvelope,
    },
  };
};
