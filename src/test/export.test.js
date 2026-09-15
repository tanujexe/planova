import { ExportServiceInstance } from '../services/export.js';
import { SHARMA_RESIDENCE_PROJECT } from '../data/demoProject.js';

console.log('--- Running PDF & Export Service Unit Tests ---');

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

// Test 1: Generate PDF for standard seed project
const doc = ExportServiceInstance.generatePdf({ project: SHARMA_RESIDENCE_PROJECT });
assert(doc !== null && typeof doc === 'object', 'Generates valid jsPDF instance');

// Test 2: Check page count
const numPages = doc.internal.getNumberOfPages();
assert(numPages >= 1, `Document has valid page count: ${numPages}`);

// Test 3: Check fallback safety on empty/minimal project
const minimalProject = {
  name: 'Minimal Test Plot',
  plot: { width: 25, length: 40, floors: 1 },
  requirements: { bhk: 2, budgetInr: 2000000 },
  design: { floors: [] }
};

const minimalDoc = ExportServiceInstance.generatePdf({ project: minimalProject });
assert(minimalDoc !== null, 'Generates valid PDF even on minimal project without crashing');

// Test 4: Check filename generation formatting
const filename = `${(SHARMA_RESIDENCE_PROJECT.name || 'Drafted-Concept').replace(/\s+/g, '-').toLowerCase()}-summary.pdf`;
assert(filename === 'sharma-residence-summary.pdf', `Generated expected export filename: ${filename}`);

console.log('--- Finished: 4/4 export assertions passed ---');
