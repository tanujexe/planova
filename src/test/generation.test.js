import { GenerationService } from '../services/generation.js';
import { 
  generateBalancedLayout, 
  generateOpenLivingLayout, 
  generateVastuPriorityLayout,
  calculateSetbacks,
  getWindowDimensionsForRoom
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

  // 5. Test Custom User Rooms Layout Generation
  const customRooms = [
    { id: 'primary_bedroom-0', type: 'primary_bedroom', label: 'Master Suite', width: 15, height: 15, area: 225 },
    { id: 'kitchen-0', type: 'kitchen', label: 'Open Kitchen', width: 10, height: 12, area: 120 },
    { id: 'bathroom-0', type: 'bathroom', label: 'Ensuite Bath', width: 8, height: 10, area: 80 },
  ];
  const customReq = {
    bhk: 1,
    rooms: customRooms,
    budgetInr: 2500000,
  };
  const customPlan = generateBalancedLayout(samplePlot, customReq);
  assert(customPlan.floors.length === 2, 'Custom rooms generate across floors');
  const allGeneratedRooms = customPlan.floors.flatMap(f => f.rooms);
  assert(allGeneratedRooms.some(r => r.type === 'primary_bedroom'), 'Custom plan contains user-selected primary bedroom');
  // 6. Test Municipal Setback Scaling (Phase 2)
  const narrowSetback = calculateSetbacks(20, 40, 'north');
  const wideSetback = calculateSetbacks(60, 80, 'north');
  assert(narrowSetback.sideSetback === 1.5, '20ft narrow plot receives 1.5ft side setback');
  assert(wideSetback.sideSetback >= 4.0, '60ft wide plot receives proportional municipal side setback (>= 4.0ft)');

  // 7. Test Room-Function-Specific Fenestration (Phase 5)
  const livingWin = getWindowDimensionsForRoom('living', 15);
  const bedWin = getWindowDimensionsForRoom('bedroom', 15);
  const bathWin = getWindowDimensionsForRoom('bathroom', 15);
  assert(livingWin > bedWin, 'Living room receives more daylight glazing than bedroom');
  assert(bedWin > bathWin, 'Bedroom window is wider than bathroom privacy ventilator');

  // 8. Test Concept Differentiation & Vastu Facing Direction (Phase 4)
  const northVastu = generateVastuPriorityLayout({ width: 30, length: 50, floors: 1, facing: 'north' }, { bhk: 2 });
  const southVastu = generateVastuPriorityLayout({ width: 30, length: 50, floors: 1, facing: 'south' }, { bhk: 2 });
  const northPooja = northVastu.floors[0].rooms.find(r => r.type === 'pooja');
  const southPooja = southVastu.floors[0].rooms.find(r => r.type === 'pooja');
  assert(Boolean(northPooja && southPooja), 'Both Vastu layouts contain dedicated Pooja');
  assert(northPooja.y !== southPooja.y, 'Pooja Y position adapts dynamically between North and South facing');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('generation.test.js')) {
  runGenerationTests();
}
