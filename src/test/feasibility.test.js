import { checkBriefFeasibility } from '../services/feasibility.js';
import { PlotSchema, RequirementsSchema } from '../domain/project.js';

export const runFeasibilityTests = () => {
  console.log('--- Running Feasibility & Wizard Unit Tests ---');
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

  // 1. Valid Sharma Residence Brief: 30x50 ft G+1 3BHK 1 car
  const sharmaCheck = checkBriefFeasibility(
    { width: 30, length: 50, floors: 2 },
    { bhk: 3, bathrooms: 2, parking: { cars: 1, twoWheelers: 1 }, rooms: [{ type: 'pooja' }] }
  );
  assert(sharmaCheck.isFeasible === true, 'Sharma Residence 30x50ft 3BHK G+1 is feasible');
  assert(sharmaCheck.warnings.length === 0, 'Sharma Residence generates 0 warnings');

  // 2. Congested Brief: 25x40 ft with 5 BHK & 3 cars
  const congestedCheck = checkBriefFeasibility(
    { width: 25, length: 40, floors: 1 },
    { bhk: 5, bathrooms: 3, parking: { cars: 3, twoWheelers: 2 }, rooms: [{ type: 'pooja' }] }
  );
  assert(congestedCheck.isFeasible === false, '25x40ft 5BHK 3-car brief triggers feasibility warning');
  assert(congestedCheck.warnings.length > 0, 'Congested brief returns specific warnings');
  assert(congestedCheck.utilizationRatio > 1.25, 'Utilization ratio indicates heavy over-subscription');

  // 3. Zod Plot schema negative dimension rejection
  const negativePlot = PlotSchema.safeParse({ width: -30, length: 50 });
  assert(negativePlot.success === false, 'Negative plot width is caught by Zod');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('feasibility.test.js')) {
  runFeasibilityTests();
}
