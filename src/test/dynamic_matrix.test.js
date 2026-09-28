import { 
  generateBalancedLayout, 
  generateOpenLivingLayout, 
  generateVastuPriorityLayout 
} from '../domain/templates.js';
import { buildRoomProgram } from '../domain/programBuilder.js';
import { validatePlan } from '../domain/constraints.js';
import { generatePlanDiagnostics } from '../domain/diagnostics.js';
import { ROOM_STANDARDS, getRoomStandard } from '../domain/config.js';

export const runDynamicMatrixTests = () => {
  console.log('--- Running Architectural Dynamic Matrix & Regression Tests ---');
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

  // 1. Infeasible Brief Detection Test (4BHK on 20x30 ft single floor)
  const infeasiblePlot = { width: 20, length: 30, floors: 1, facing: 'north' };
  const infeasibleReq = { bhk: 4, parking: { cars: 1 } };
  const progResult = buildRoomProgram(infeasiblePlot, infeasibleReq, 'M');

  assert(progResult.feasible === false, '4BHK on 20x30 single floor correctly diagnosed as NOT feasible');
  assert(Boolean(progResult.reason && progResult.reason.includes('Deficit')), 'Infeasible report provides mathematical deficit reason');
  assert(Boolean(progResult.suggestion && progResult.suggestion.includes('Add a floor')), 'Infeasible report suggests adding a floor');

  // 2. 30x50 North-Facing 2BHK Snapshot & Regression Test
  const plot30x50 = { width: 30, length: 50, floors: 1, facing: 'north' };
  const req2BHK = { bhk: 2, parking: { cars: 1 } };

  const plan2BHK = generateBalancedLayout(plot30x50, req2BHK);
  const diag2BHK = generatePlanDiagnostics(plan2BHK);

  assert(diag2BHK.isValid === true, '30x50 2BHK passes all HARD architectural gates');
  assert(diag2BHK.hardGateErrors.length === 0, '30x50 2BHK has 0 hard gate errors');

  // Inspect each room's dimensions
  const gRooms = diag2BHK.floors[0].rooms;
  const living = gRooms.find(r => r.type === 'living');
  const bed1 = gRooms.find(r => r.type === 'master_bedroom' || r.type === 'bedroom');
  const kitchen = gRooms.find(r => r.type === 'kitchen');
  const corridor = gRooms.find(r => r.type === 'corridor');

  assert(Boolean(living && living.width >= 10 && living.depth >= 12), `Living room is sensible size (${living?.dimensions})`);
  assert(Boolean(bed1 && bed1.width >= 9 && bed1.depth >= 10), `Bedroom is sensible size (${bed1?.dimensions})`);
  assert(Boolean(kitchen && kitchen.width >= 7 && kitchen.depth >= 8), `Kitchen is sensible size (${kitchen?.dimensions})`);
  assert(Boolean(corridor && (corridor.width >= 3.0 || corridor.depth >= 3.0)), `Corridor is present with >= 3.0ft width (${corridor?.dimensions})`);

  // Assert NO room breaks minimum width or aspect ratio
  gRooms.forEach((r) => {
    assert(r.compliance.meetsWidth, `Room "${r.label}" width ${r.width}ft >= NBC min ${r.standards.minWidth}ft`);
    if (r.type !== 'corridor' && r.type !== 'balcony') {
      assert(r.aspectRatioValue <= 2.2, `Room "${r.label}" aspect ratio ${r.aspectRatio} <= 1:2.2 (no thin strips!)`);
    }
  });

  // 3. Matrix of Diverse Plots & Configurations
  const plotSizes = [
    { width: 20, length: 40 },
    { width: 25, length: 50 },
    { width: 30, length: 40 },
    { width: 30, length: 50 },
    { width: 40, length: 60 },
    { width: 50, length: 80 },
    { width: 35, length: 35 },
  ];

  const facings = ['north', 'east', 'south', 'west'];
  const floorCounts = [1, 2, 3];
  const bhkCounts = [1, 2, 3, 4];
  const sizeTiers = ['S', 'M', 'L'];

  // Test across representative combinations
  plotSizes.forEach((ps, idx) => {
    const facing = facings[idx % facings.length];
    const floors = floorCounts[idx % floorCounts.length];
    const bhk = bhkCounts[idx % bhkCounts.length];
    const sizeTier = sizeTiers[idx % sizeTiers.length];

    const plot = { ...ps, floors, facing };
    const req = { bhk, sizeTier, parking: { cars: 1 } };

    // Test Balanced Layout
    const plan = generateBalancedLayout(plot, req);
    const valid = validatePlan(plan);
    assert(valid.valid, `Plot ${ps.width}x${ps.length} (${facing.toUpperCase()}, ${floors} fl, ${bhk}BHK, ${sizeTier}) passes all hard gates`);

    // Ensure no room in plan is a thin strip (< 3.5 ft width or > 1:2.2 aspect)
    let hasThinStrip = false;
    plan.floors.forEach((f) => {
      (f.rooms || []).forEach((r) => {
        if (r.type !== 'corridor' && r.type !== 'balcony') {
          const aspect = Math.max(r.width / r.height, r.height / r.width);
          if (Math.min(r.width, r.height) < 3.5 || aspect > 2.2) {
            hasThinStrip = true;
            console.error(`Thin strip found in ${ps.width}x${ps.length}: ${r.label} (${r.width}x${r.height})`);
          }
        }
      });
    });
    assert(!hasThinStrip, `Plot ${ps.width}x${ps.length} has ZERO thin strip rooms`);
  });

  // 4. Test Concept Differentiation across Open Living and Vastu
  const openPlan = generateOpenLivingLayout({ width: 35, length: 50, floors: 2 }, { bhk: 3 });
  assert(openPlan.floors[0].rooms.some(r => r.label.includes('Open Living') || r.type === 'living'), 'Open Living generates Great Room core on 35x50');

  const vastuPlan = generateVastuPriorityLayout({ width: 35, length: 50, floors: 2, facing: 'east' }, { bhk: 3 });
  assert(vastuPlan.floors[0].rooms.some(r => r.type === 'pooja'), 'Vastu priority allocates dedicated Pooja room');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('dynamic_matrix.test.js')) {
  runDynamicMatrixTests();
}
