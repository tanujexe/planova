import { EditService } from '../services/edit.js';
import { SHARMA_RESIDENCE_PROJECT } from '../data/demoProject.js';

export const runEditTests = async () => {
  console.log('--- Running Natural Language Edit & Wow Moment Unit Tests ---');
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

  const basePlan = SHARMA_RESIDENCE_PROJECT.design;
  const req = SHARMA_RESIDENCE_PROJECT.requirements;

  // 1. PRIMARY DEMO WOW MOMENT TEST
  const wowPrompt = 'Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget.';
  const wowProposal = await EditService.propose({ plan: basePlan, prompt: wowPrompt, requirements: req });

  assert(wowProposal.status === 'needs_confirmation', 'Wow moment requires explicit user confirmation');
  assert(Boolean(wowProposal.mutation), 'Generates structured mutation proposal');
  assert(wowProposal.mutation.affectedRoomIds.length >= 2, 'Identifies Kitchen & Master Bedroom as affected');
  assert(wowProposal.mutation.lockedRoomIds.length >= 1, 'Identifies Parking as locked');
  assert(wowProposal.tradeoffs.length >= 4, 'Provides clear 4-part architectural trade-off explanation');

  // Verify Kitchen enlarged in mutated plan
  const origKitchen = basePlan.floors[0].rooms.find(r => r.type === 'kitchen');
  const mutatedKitchen = wowProposal.mutation.newPlan.floors[0].rooms.find(r => r.type === 'kitchen');
  assert(mutatedKitchen.width > origKitchen.width, 'Kitchen width enlarged in proposal');

  // Verify Parking unchanged
  const origParking = basePlan.floors[0].rooms.find(r => r.type === 'parking');
  const mutatedParking = wowProposal.mutation.newPlan.floors[0].rooms.find(r => r.type === 'parking');
  assert(mutatedParking.x === origParking.x && mutatedParking.y === origParking.y, 'Parking coordinates remain unchanged');

  // 2. Kitchen resize intent
  const kitchenRes = await EditService.propose({ plan: basePlan, prompt: 'Make the kitchen bigger', requirements: req });
  assert(kitchenRes.status === 'ready', 'Direct kitchen resize is ready');
  assert(kitchenRes.mutation.affectedRoomIds.length === 1, 'Affected room is kitchen');

  // 3. Move Bedroom intent
  const moveRes = await EditService.propose({ plan: basePlan, prompt: 'Move master bedroom to back', requirements: req });
  assert(moveRes.status === 'ready', 'Bedroom move proposal generated');

  // 4. Balcony addition intent
  const balconyRes = await EditService.propose({ plan: basePlan, prompt: 'Add a balcony', requirements: req });
  assert(balconyRes.status === 'ready', 'Balcony addition proposal generated');

  // 5. Unsupported prompt
  const unsupportedRes = await EditService.propose({ plan: basePlan, prompt: 'Install a rocket launchpad', requirements: req });
  assert(unsupportedRes.status === 'unsupported', 'Unsupported prompt is safely rejected');
  assert(unsupportedRes.tradeoffs.length > 0, 'Offers helpful suggestions');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

if (typeof process !== 'undefined' && process.argv[1]?.endsWith('edit.test.js')) {
  runEditTests();
}
