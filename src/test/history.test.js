import { useProjectStore } from '../store/useProjectStore.js';
import { SHARMA_RESIDENCE_PROJECT } from '../data/demoProject.js';

export const runHistoryTests = () => {
  console.log('--- Running Direct Manipulation & Undo/Redo Unit Tests ---');
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

  const store = useProjectStore.getState();
  store.resetDemoProject();

  const initialProject = useProjectStore.getState().activeProject;
  const initialKitchen = initialProject.design.floors[0].rooms.find(r => r.type === 'kitchen');
  const originalKitchenW = initialKitchen.width;

  // 1. Mutate Kitchen width: +2 ft
  const updateRes = store.updateRoom(0, {
    ...initialKitchen,
    width: originalKitchenW + 2,
  });

  assert(updateRes.success === true, 'Valid room resize succeeded');
  const mutatedProject = useProjectStore.getState().activeProject;
  const mutatedKitchen = mutatedProject.design.floors[0].rooms.find(r => r.type === 'kitchen');
  assert(mutatedKitchen.width === originalKitchenW + 2, 'Kitchen width increased by 2ft');

  // 2. Undo
  assert(useProjectStore.getState().historyPast.length === 1, 'History past has 1 snapshot');
  store.undo();

  const undoneProject = useProjectStore.getState().activeProject;
  const undoneKitchen = undoneProject.design.floors[0].rooms.find(r => r.type === 'kitchen');
  assert(undoneKitchen.width === originalKitchenW, 'Undo accurately restored original kitchen width');
  assert(useProjectStore.getState().historyFuture.length === 1, 'History future has 1 redo snapshot');

  // 3. Redo
  store.redo();
  const redoneProject = useProjectStore.getState().activeProject;
  const redoneKitchen = redoneProject.design.floors[0].rooms.find(r => r.type === 'kitchen');
  assert(redoneKitchen.width === originalKitchenW + 2, 'Redo accurately restored resized width');

  // 4. Invalid placement rejection (snapback)
  const invalidRes = store.updateRoom(0, {
    ...initialKitchen,
    x: 99, // out of plot bounds
  });
  assert(invalidRes.success === false, 'Invalid room placement is blocked from committing');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('history.test.js')) {
  runHistoryTests();
}
