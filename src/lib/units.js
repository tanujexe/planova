/**
 * Conversion constant: 1 foot = 0.3048 meters
 */
export const FT_TO_M = 0.3048;
export const M_TO_FT = 1 / FT_TO_M;
export const SQFT_TO_SQM = FT_TO_M * FT_TO_M;
export const SQM_TO_SQFT = 1 / SQFT_TO_SQM;

/**
 * Converts feet to meters (rounded to 2 decimal places)
 * @param {number} ft 
 * @returns {number}
 */
export const feetToMeters = (ft) => {
  return Number((ft * FT_TO_M).toFixed(2));
};

/**
 * Converts meters to feet (rounded to 2 decimal places)
 * @param {number} m 
 * @returns {number}
 */
export const metersToFeet = (m) => {
  return Number((m * M_TO_FT).toFixed(2));
};

/**
 * Calculates square footage from width and length in feet
 * @param {number} width 
 * @param {number} length 
 * @returns {number}
 */
export const calculateAreaSqFt = (width, length) => {
  return Math.round(width * length);
};

/**
 * Formats a dimension string depending on active unit
 * @param {number} valInFt 
 * @param {'ft' | 'm'} unit 
 * @returns {string}
 */
export const formatDimension = (valInFt, unit = 'ft') => {
  if (unit === 'm') {
    return `${feetToMeters(valInFt)} m`;
  }
  return `${valInFt} ft`;
};

/**
 * Formats an area string depending on active unit
 * @param {number} areaInSqFt 
 * @param {'ft' | 'm'} unit 
 * @returns {string}
 */
export const formatArea = (areaInSqFt, unit = 'ft') => {
  if (unit === 'm') {
    const sqM = Math.round(areaInSqFt * SQFT_TO_SQM);
    return `${sqM.toLocaleString('en-IN')} sq.m`;
  }
  return `${Math.round(areaInSqFt).toLocaleString('en-IN')} sq.ft`;
};
