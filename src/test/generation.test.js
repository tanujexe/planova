import { GenerationService } from '../services/generation.js';
import { 
  generateBalancedLayout, 
  generateOpenLivingLayout, 
  generateVastuPriorityLayout 
} from '../domain/templates.js';

export const runGenerationTests = async () => {
  console.log('--- Running Design Generation Unit Tests ---');
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

  const samplePlot = { width: 30, length: 50, floors: 2, unit: 'ft', facing: 'north', roadSide: 'north' };
  const sampleReq = { bhk: 3, budgetInr: 3500000, quality: 'standard', parking: { cars: 1, twoWheelers: 1 } };

  // 1. Test Balanced Layout Template
  const balanced = generateBalancedLayout(samplePlot, sampleReq);
  assert(balanced.floors.length === 2, 'Balanced layout generates 2 floors');
  assert(balanced.floors[0].rooms.length >= 6, 'Ground floor has at least 6 structured rooms');
  assert(balanced.builtUpAreaSqFt > 1400, 'Built-up area is positive and realistic');

  // 2. Test Open Living Template
  const openLiving = generateOpenLivingLayout(samplePlot, sampleReq);
  assert(openLiving.floors.length === 2, 'Open Living layout generates 2 floors');
  assert(openLiving.floors[0].rooms.some(r => r.label.includes('Open Living')), 'Contains Open Living core');

  // 3. Test Vastu Priority Template
  const vastuPlan = generateVastuPriorityLayout(samplePlot, sampleReq);
  assert(vastuPlan.floors.length === 2, 'Vastu Priority generates 2 floors');
  assert(vastuPlan.floors[0].rooms.some(r => r.type === 'pooja'), 'Contains dedicated Pooja in NE');

  // 4. Test GenerationService async execution
  let progressCalled = false;
  const result = await GenerationService.generate({ plot: samplePlot, requirements: sampleReq }, (idx) => {
    progressCalled = true;
  });

  assert(progressCalled === true, 'GenerationService triggers staged progress callbacks');
  assert(result.options.length === 3, 'Generates exactly 3 distinct concepts');
  assert(result.options[0].concept === 'balanced', 'Option 1 is Balanced Layout');
  assert(result.options[1].concept === 'open_living', 'Option 2 is Open Living');
  assert(result.options[2].concept === 'vastu_priority', 'Option 3 is Vastu Priority');
  assert(result.options[0].estimatedCostInr > 0, 'Estimated cost calculated in INR');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('generation.test.js')) {
  runGenerationTests();
}
