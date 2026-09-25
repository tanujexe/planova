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

  // 4. Dynamic sizing scales with BHK and plot size
  const small2BHK = checkBriefFeasibility(
    { width: 20, length: 40, floors: 1 },
    { bhk: 2, bathrooms: 1, parking: { cars: 0, twoWheelers: 1 } }
  );
  const large4BHK = checkBriefFeasibility(
    { width: 40, length: 60, floors: 2 },
    { bhk: 4, bathrooms: 3, parking: { cars: 2, twoWheelers: 2 } }
  );
  assert(
    large4BHK.dynamicRoomAreas.master_bedroom > small2BHK.dynamicRoomAreas.master_bedroom,
    '4BHK master bed scales larger than 2BHK master bed'
  );
  assert(
    large4BHK.dynamicRoomAreas.living > small2BHK.dynamicRoomAreas.living,
    '4BHK living room scales larger than 2BHK living room'
  );

  // 5. Per-room minimum bounds warning
  const undersizedRoomCheck = checkBriefFeasibility(
    { width: 30, length: 50, floors: 2 },
    {
      bhk: 3,
      bathrooms: 2,
      rooms: [
        { type: 'master_bedroom', label: 'Tiny Master', area: 90 } // Min is 130
      ]
    }
  );
  assert(
    undersizedRoomCheck.warnings.some(w => w.includes('below architectural minimum')),
    'Undersized master bedroom generates minimum area bound warning'
  );

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('feasibility.test.js')) {
  runFeasibilityTests();
}
