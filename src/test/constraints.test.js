import { validatePlan, validateRoomMutation, doRectanglesOverlap, scorePlan } from '../domain/constraints.js';
import { MutationEngine } from '../services/mutationEngine.js';
import { SHARMA_RESIDENCE_PROJECT } from '../data/demoProject.js';

export const runConstraintsTests = () => {
  console.log('--- Running Spatial Constraint Unit Tests ---');
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

  // 1. Sharma Residence baseline validation
  const sharmaValid = validatePlan(SHARMA_RESIDENCE_PROJECT.design);
  assert(sharmaValid.valid === true, 'Sharma Residence floor plan passes all spatial constraints');
  assert(sharmaValid.errors.length === 0, 'Sharma Residence has 0 geometric errors');

  // 2. Overlap helper test
  const r1 = { x: 2, y: 2, width: 10, height: 10 };
  const r2 = { x: 5, y: 5, width: 10, height: 10 }; // overlaps r1
  const r3 = { x: 12, y: 2, width: 10, height: 10 }; // adjacent touching (no overlap)
  assert(doRectanglesOverlap(r1, r2) === true, 'Overlapping rectangles correctly detected');
  assert(doRectanglesOverlap(r1, r3) === false, 'Adjacent touching rectangles do not overlap');

  // 3. Out-of-bounds room detection
  const outOfBoundsPlan = {
    plot: { width: 30, length: 50 },
    floors: [
      {
        level: 0,
        label: 'Ground',
        rooms: [
          { id: 'rm-1', label: 'Spillover Room', x: 25, y: 40, width: 10, height: 15 },
        ],
      },
    ],
  };
  const oobResult = validatePlan(outOfBoundsPlan);
  assert(oobResult.valid === false, 'Out-of-bounds room fails validation');
  assert(oobResult.errors.some(e => e.includes('extends outside')), 'Error mentions boundary spillover');

  // 4. Negative dimension room detection
  const negativePlan = {
    plot: { width: 30, length: 50 },
    floors: [
      {
        level: 0,
        label: 'Ground',
        rooms: [
          { id: 'rm-1', label: 'Negative Room', x: 2, y: 2, width: -10, height: 10 },
        ],
      },
    ],
  };
  const negResult = validatePlan(negativePlan);
  assert(negResult.valid === false, 'Negative dimension fails validation');

  // 5. MutationEngine locked room preservation test
  const basePlan = structuredClone(SHARMA_RESIDENCE_PROJECT.design);
  const parkingRoom = basePlan.floors[0].rooms.find(r => r.type === 'parking');
  const lockedResult = MutationEngine.executeMutation(
    basePlan,
    (mutated) => {
      const p = mutated.floors[0].rooms.find(r => r.id === parkingRoom.id);
      if (p) p.x += 5; // Modifying locked parking
    },
    [parkingRoom.id]
  );
  assert(lockedResult.status === 'blocked', 'Modifying locked element causes mutation to be BLOCKED');

  // 6. Safe resize engine test
  const kitchen = basePlan.floors[0].rooms.find(r => r.type === 'kitchen');
  const safeResizeResult = MutationEngine.findSafeResize(basePlan, 0, kitchen, 0.20);
  assert(safeResizeResult !== null, 'Safe resize finds valid candidate dimensions for kitchen');

  // 7. Safe position candidate finder test
  const master = basePlan.floors[0].rooms.find(r => r.type === 'master_bedroom');
  const safePos = MutationEngine.findSafePosition(basePlan, 0, master, 'rear_sw');
  assert(safePos !== null && safePos.x >= 0 && safePos.y >= 0, 'Safe position engine finds valid rear SW coordinates');

  // 8. 4-Pillar Soft Scoring Engine test
  const scoreResult = scorePlan(SHARMA_RESIDENCE_PROJECT.design);
  assert(scoreResult.score >= 70, 'Sharma Residence achieves healthy soft score (>= 70)');
  assert(scoreResult.breakdown.aspectRatioScore > 0, 'Aspect ratio score is positive');
  assert(scoreResult.breakdown.adjacencyScore > 0, 'Adjacency score is positive');

  // 9. Aspect Ratio bound penalty for distorted room
  const distortedPlan = {
    plot: { width: 30, length: 50 },
    floors: [
      {
        level: 0,
        rooms: [
          { id: 'rm-skinny', label: 'Skinny Corridor Bed', type: 'bedroom', x: 2, y: 2, width: 4, height: 16 } // ratio 1:4.0
        ],
        openings: []
      }
    ]
  };
  const distortedScore = scorePlan(distortedPlan);
  assert(
    distortedScore.penalties.some(p => p.includes('aspect ratio distortion')),
    'Distorted room (> 1:2.5) receives severe aspect ratio penalty'
  );

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('constraints.test.js')) {
  runConstraintsTests();
}
