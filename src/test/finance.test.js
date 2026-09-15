import { CostingServiceInstance, QUALITY_RATES } from '../services/costing.js';
import { BoqServiceInstance } from '../services/boq.js';
import { SHARMA_RESIDENCE_PROJECT } from '../data/demoProject.js';

export const runFinanceTests = () => {
  console.log('--- Running Costing, Budget Optimizer & BOQ Unit Tests ---');
  let passed = 0;
  let total = 0;

  const assert = (condition, name) => {
    total++;
    if (condition) {
      console.log(`✓ ${name}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${name}`);
    }
  };

  const plan = SHARMA_RESIDENCE_PROJECT.design;
  const req = SHARMA_RESIDENCE_PROJECT.requirements;

  // 1. Built-up area calculation
  const area = CostingServiceInstance.calculateBuiltUpArea(plan);
  assert(area > 1400, 'Calculates positive built-up area');

  // 2. Cost Estimate Calculation @ Standard tier (₹1900/sq.ft)
  const estimate = CostingServiceInstance.calculateEstimate({ plan, requirements: { ...req, quality: 'standard' } });
  assert(estimate.ratePerSqFt === 1900, 'Standard tier uses ₹1,900/sq.ft');
  assert(estimate.totalEstimatedCost === Math.round(area * 1900), 'Total cost = Area * 1900');
  assert(estimate.breakdown.length === 7, 'Includes all 7 construction categories');

  // Verify breakdown sum matches total cost
  const breakdownSum = estimate.breakdown.reduce((acc, item) => acc + item.amount, 0);
  assert(Math.abs(breakdownSum - estimate.totalEstimatedCost) <= 7, 'Breakdown category sum matches total cost within rounding');

  // 3. Quality Tier rates
  const premEstimate = CostingServiceInstance.calculateEstimate({ plan, requirements: { ...req, quality: 'premium' } });
  assert(premEstimate.ratePerSqFt === 2500, 'Premium tier uses ₹2,500/sq.ft');
  assert(premEstimate.totalEstimatedCost > estimate.totalEstimatedCost, 'Premium cost exceeds Standard cost');

  // 4. Budget Gap Analysis
  const overBudgetEstimate = CostingServiceInstance.calculateEstimate({ plan, requirements: { ...req, budgetInr: 2500000, quality: 'standard' } });
  assert(overBudgetEstimate.isOverBudget === true, 'Correctly flags over-budget when cost > 25L');
  assert(overBudgetEstimate.budgetGap > 0, 'Calculates positive budget gap');

  // 5. Optimization Proposals
  const optimizations = CostingServiceInstance.proposeOptimizations({ plan, requirements: { ...req, quality: 'premium' } });
  assert(optimizations.length >= 2, 'Generates at least 2 budget optimization proposals');
  assert(optimizations.some(o => o.type === 'quality'), 'Proposes finish tier adjustment');

  // 6. BOQ Material Quantity derivation
  const boqItems = BoqServiceInstance.generateBoq({ plan, requirements: req });
  assert(boqItems.length >= 8, 'Generates at least 8 preliminary material takeoff items');
  assert(boqItems.some(item => item.id === 'boq-cement'), 'Contains Cement quantity');
  assert(boqItems.some(item => item.id === 'boq-steel'), 'Contains TMT Steel quantity');
  assert(boqItems.some(item => item.id === 'boq-bricks'), 'Contains Bricks / Blocks quantity');
  assert(boqItems.some(item => item.id === 'boq-flooring'), 'Contains Flooring tiles quantity');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('finance.test.js')) {
  runFinanceTests();
}
