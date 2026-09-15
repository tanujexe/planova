import { ProjectSchema, validateProject, PlotSchema } from '../domain/project.js';
import { feetToMeters, metersToFeet, formatDimension, formatArea } from '../lib/units.js';
import { formatInr, formatInrShorthand, parseInrString } from '../lib/currency.js';
import { SHARMA_RESIDENCE_PROJECT } from '../data/demoProject.js';

export const runDomainTests = () => {
  console.log('--- Running Domain & Utility Unit Tests ---');
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

  // 1. Units conversion
  assert(feetToMeters(10) === 3.05, '10 feet = 3.05 meters');
  assert(metersToFeet(3.048) === 10, '3.048 meters = 10 feet');
  assert(formatDimension(30, 'ft') === '30 ft', 'Format 30 ft');
  assert(formatDimension(30, 'm') === '9.14 m', 'Format 30 ft to meters');
  assert(formatArea(1500, 'ft') === '1,500 sq.ft', 'Format 1500 sq.ft');

  // 2. Currency formatting
  assert(formatInr(3500000) === '₹35,00,000', 'Format INR 35L full');
  assert(formatInrShorthand(3500000) === '₹35L', 'Format INR 35L shorthand');
  assert(formatInrShorthand(12000000) === '₹1.2Cr', 'Format INR 1.2Cr shorthand');
  assert(parseInrString('₹35L') === 3500000, 'Parse ₹35L string');
  assert(parseInrString('₹1.5Cr') === 15000000, 'Parse ₹1.5Cr string');

  // 3. Schema validation on Sharma Residence demo seed
  const validationResult = validateProject(SHARMA_RESIDENCE_PROJECT);
  assert(validationResult.success === true, 'Sharma Residence passes ProjectSchema validation');

  // 4. Invalid plot validation rejection
  const invalidPlot = PlotSchema.safeParse({ width: -10, length: 0 });
  assert(invalidPlot.success === false, 'Negative or zero plot dimensions are rejected');

  console.log(`--- Finished: ${passed}/${total} assertions passed ---`);
  return passed === total;
};

// Auto-run if executed directly via node
if (typeof process !== 'undefined' && process.argv[1]?.endsWith('domain.test.js')) {
  runDomainTests();
}
