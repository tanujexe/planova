/**
 * Generates a short, unique ID with an optional prefix.
 * @param {string} prefix 
 * @returns {string}
 */
export const generateId = (prefix = 'id') => {
  const randomStr = Math.random().toString(36).substring(2, 9);
  const timestamp = Date.now().toString(36).slice(-4);
  return `${prefix}_${timestamp}${randomStr}`;
};
