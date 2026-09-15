/**
 * Indian Residential Cost Estimation Service
 * Pure calculation functions adhering to PRD §20–21 and Spec §CostingService.
 */

export const QUALITY_RATES = {
  economy: 1500,
  standard: 1900,
  premium: 2500,
};

export const COST_BREAKDOWN_WEIGHTS = [
  { id: 'civil', label: 'Civil Structure & Masonry', percentage: 48, desc: 'Foundation, RCC slabs, columns, brickwork, and plaster' },
  { id: 'flooring', label: 'Flooring & Wall Tiling', percentage: 12, desc: 'Vitrified tiles, granite counter, bathroom anti-skid tiles' },
  { id: 'doors_windows', label: 'Doors & Aluminium Windows', percentage: 10, desc: 'Main teak door, flush doors, and 3-track sliding windows' },
  { id: 'electrical', label: 'Electrical & Modular Points', percentage: 10, desc: 'Concealed copper wiring, distribution board, and switchboards' },
  { id: 'plumbing', label: 'Plumbing & Sanitaryware', percentage: 9, desc: 'CPVC water piping, SWR drainage, CP fittings, and WC fixtures' },
  { id: 'painting', label: 'Internal & External Paint', percentage: 7, desc: 'Putty, primer, weather-coat exterior & acrylic interior emulsion' },
  { id: 'misc', label: 'Site Supervision & Misc', percentage: 4, desc: 'Architectural compliance, contractor overhead, and cleanup' },
];

class CostingService {
  /**
   * Calculates total built-up area from a FloorPlan
   * @param {object} plan 
   * @returns {number}
   */
  calculateBuiltUpArea(plan) {
    if (!plan || !plan.floors) return 1705;
    let total = 0;
    plan.floors.forEach((f) => {
      (f.rooms || []).forEach((r) => {
        total += (r.width * r.height);
      });
    });
    return Math.round(total) || 1705;
  }

  /**
   * Calculates comprehensive indicative cost estimate
   * @param {{ plan: object, requirements: object }} input 
   * @returns {{
   *   builtUpAreaSqFt: number,
   *   qualityTier: string,
   *   ratePerSqFt: number,
   *   totalEstimatedCost: number,
   *   targetBudget: number,
   *   budgetGap: number,
   *   isOverBudget: boolean,
   *   breakdown: Array<{ id: string, label: string, amount: number, percentage: number, desc: string }>
   * }}
   */
  calculateEstimate({ plan, requirements }) {
    const builtUpArea = this.calculateBuiltUpArea(plan);
    const quality = requirements?.quality || 'standard';
    const ratePerSqFt = QUALITY_RATES[quality] || 1900;
    const targetBudget = Number(requirements?.budgetInr) || 3500000;

    const totalEstimatedCost = Math.round(builtUpArea * ratePerSqFt);
    const budgetGap = totalEstimatedCost - targetBudget;
    const isOverBudget = budgetGap > 0;

    const breakdown = COST_BREAKDOWN_WEIGHTS.map((item) => ({
      ...item,
      amount: Math.round((totalEstimatedCost * item.percentage) / 100),
    }));

    return {
      builtUpAreaSqFt: builtUpArea,
      qualityTier: quality,
      ratePerSqFt,
      totalEstimatedCost,
      targetBudget,
      budgetGap,
      isOverBudget,
      breakdown,
    };
  }

  /**
   * Proposes budget optimization adjustments
   * @param {{ plan: object, requirements: object }} input 
   * @returns {Array<{ type: string, title: string, savings: number, action: string, desc: string }>}
   */
  proposeOptimizations({ plan, requirements }) {
    const current = this.calculateEstimate({ plan, requirements });
    const suggestions = [];

    // Option 1: Adjust Quality Tier if Premium / Standard
    if (current.qualityTier === 'premium') {
      const standardRate = QUALITY_RATES.standard;
      const savings = (QUALITY_RATES.premium - standardRate) * current.builtUpAreaSqFt;
      suggestions.push({
        type: 'quality',
        title: 'Switch to Standard Finish Tier',
        savings: Math.round(savings),
        action: 'setQualityStandard',
        desc: 'Maintains identical room sizes and layout while utilizing high-grade vitrified tiles and standard fittings.',
      });
    } else if (current.qualityTier === 'standard') {
      const economyRate = QUALITY_RATES.economy;
      const savings = (QUALITY_RATES.standard - economyRate) * current.builtUpAreaSqFt;
      suggestions.push({
        type: 'quality',
        title: 'Switch to Economy Value Tier',
        savings: Math.round(savings),
        action: 'setQualityEconomy',
        desc: 'Optimizes material finish specs (@ ₹1,500/sq.ft) without altering your core room dimensions.',
      });
    }

    // Option 2: Compact non-core spaces
    const areaReduction = Math.round(current.builtUpAreaSqFt * 0.08); // 8% compaction
    const spatialSavings = areaReduction * current.ratePerSqFt;
    suggestions.push({
      type: 'spatial',
      title: 'Compact Non-Core Circulation Margins (~8%)',
      savings: Math.round(spatialSavings),
      action: 'compactSpaces',
      desc: 'Slims down hallway widths, foyer margins, and utility setbacks by ~8% to save approximate construction volume.',
    });

    return suggestions;
  }
}

export const CostingServiceInstance = new CostingService();
