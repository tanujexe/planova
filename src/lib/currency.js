/**
 * Formats a number in standard Indian Rupee notation (e.g. ₹35,00,000)
 * @param {number} amount 
 * @returns {string}
 */
export const formatInr = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

/**
 * Formats a number in Indian shorthand notation (e.g. ₹35L or ₹1.2Cr)
 * @param {number} amount 
 * @returns {string}
 */
export const formatInrShorthand = (amount) => {
  if (!amount || isNaN(amount)) return '₹0';

  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${cr}Cr`;
  }
  if (amount >= 100000) {
    const l = (amount / 100000).toFixed(2).replace(/\.?0+$/, '');
    return `₹${l}L`;
  }
  if (amount >= 1000) {
    const k = (amount / 1000).toFixed(1).replace(/\.?0+$/, '');
    return `₹${k}k`;
  }

  return formatInr(amount);
};

/**
 * Parses an INR string back to a numeric amount (e.g. "35L" -> 3500000)
 * @param {string} str 
 * @returns {number | null}
 */
export const parseInrString = (str) => {
  if (!str) return null;
  const clean = str.replace(/[₹,\s]/g, '').toLowerCase();
  
  if (clean.endsWith('cr')) {
    const val = parseFloat(clean.replace('cr', ''));
    return isNaN(val) ? null : val * 10000000;
  }
  if (clean.endsWith('l')) {
    const val = parseFloat(clean.replace('l', ''));
    return isNaN(val) ? null : val * 100000;
  }
  if (clean.endsWith('k')) {
    const val = parseFloat(clean.replace('k', ''));
    return isNaN(val) ? null : val * 1000;
  }

  const parsed = parseFloat(clean);
  return isNaN(parsed) ? null : parsed;
};
