# Build Checklist

## Build Preferences

- **Build mode:** Autonomous
- **Comprehension checks:** N/A
- **Git:** Commit after tasks 2, 5, 8, and 11; use each as a revert point.
- **Verification:** No user review pauses; complete each task's stated verification before continuing.
- **Check-in cadence:** Speed-run
- **Demo wow moment:** Safely interpret and apply: “Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget.”

## Checklist

- [x] **1. Bootstrap the typed application shell**
  Spec ref: `spec.md > Stack > Application runtime` and `spec.md > Architecture > Frontend shell`
  What to build: Create the Vite React/TypeScript app, install the planned core dependencies, configure Tailwind, create the app shell and route placeholders, and add a global conceptual-design/professional-review disclaimer plus error boundary.
  Acceptance: The application starts locally, renders a premium India-focused shell, and navigation exposes Dashboard, New Project, Design, 3D, Cost, BOQ, and Export placeholder views without a runtime error.
  Verify: Run `npm run build`; run the development server and manually open every placeholder route.

- [x] **2. Define the structured domain and local project repository**
  Spec ref: `spec.md > Data Model`, `spec.md > Architecture > Domain model`, and `spec.md > Architecture > Persistence boundary`
  What to build: Add TypeScript/Zod schemas for Project, Plot, Requirements, FloorPlan, rooms, openings, and history; add geometry/unit/currency utilities; implement a versioned localStorage repository and a Sharma Residence demo seed.
  Acceptance: A valid Project can be saved, loaded after refresh, and restored with structured layout data; corrupt stored data does not crash the app; the seeded demo matches the Bhopal 30×50 ft, north-facing, G+1, 3BHK brief.
  Verify: Add unit tests for schema validation, feet/meters conversion, and repository round-trip; manually refresh a saved demo project.

- [x] **3. Build the dashboard and project navigation**
  Spec ref: `spec.md > Components and Responsibilities > Dashboard and demo seed` and `spec.md > State, Navigation, and Persistence`
  What to build: Implement dashboard empty state, project cards, one-time demo seeding, project routes, and local actions for open, rename, duplicate, and confirmation-protected delete.
  Acceptance: A fresh profile has a clear create/demo entry point; cards show name, city, plot, status, thumbnail placeholder, and last update; delete cannot happen without confirmation.
  Verify: Manually create/open/rename/duplicate/delete a project and confirm browser refresh keeps the expected cards.

- [x] **4. Implement the Indian project and requirements wizard**
  Spec ref: `spec.md > Components and Responsibilities > Project wizard` and `spec.md > Components and Responsibilities > Feasibility panel`
  What to build: Create the two-step form for project/plot details and Indian requirements, including BHK, rooms, parking, ventilation, Vastu preference, quality, INR budget, inline Zod errors, dirty-form navigation guard, and feasibility warnings.
  Acceptance: Project name and positive dimensions are required; invalid values show understandable inline messages; an impractical brief warns but permits “Generate best possible layout”; Vastu is presented only as a preference.
  Verify: Manually test empty name, zero/negative dimensions, a 25×40 ft five-bedroom/three-car brief, and a valid Sharma-style brief.

- [x] **5. Generate and select three deterministic concepts**
  Spec ref: `spec.md > Architecture > Generation adapter` and `spec.md > Components and Responsibilities > Design generation panel`
  What to build: Implement template-driven `DesignGenerationService`, staged loading messages, duplicate-click prevention, retry/edit recovery, and three option cards—Balanced Layout, Open Living, and Vastu Priority—with area, room count, parking, Vastu status, and indicative cost preview.
  Acceptance: A valid brief produces exactly three visibly distinct, constraint-valid structured FloorPlans; failure preserves inputs; selecting an option persists it as the active design.
  Verify: Run unit tests for the three templates and constraint validation; manually generate twice, select each card, refresh, and retry a simulated failure.

- [x] **6. Render the structured 2D plan and enforce geometry constraints**
  Spec ref: `spec.md > Components and Responsibilities > Plan canvas and room inspector` and `spec.md > Constraint and Error Strategy > Constraint checks`
  What to build: Use React Konva to render plot bounds, room rectangles/labels/dimensions, doors, windows, and parking; add pan/zoom, selection, and reusable plan validators for positive dimensions, containment, overlap, required rooms, parking, and opening ownership.
  Acceptance: The selected plan looks structured and believable; every generated room appears inside the plot; invalid geometry is rejected before persistence rather than visually accepted.
  Verify: Manually inspect the Sharma plan at multiple zoom levels; run unit tests that reject negative, overlapping, and out-of-bounds rooms.

- [x] **7. Add direct manipulation, room inspection, and history**
  Spec ref: `spec.md > Components and Responsibilities > Plan canvas and room inspector` and `spec.md > Components and Responsibilities > Undo and redo controls`
  What to build: Add safe room drag/resize interactions, an inspector with numeric adjustments, affected-room highlighting, a 20-snapshot undo/redo history, and save-after-drag-end behavior.
  Acceptance: Valid manual changes update the 2D plan and persist after refresh; an invalid drag/resizing attempt snaps back with an explanation; undo and redo restore the exact structured plan and have correct disabled states.
  Verify: Move and resize a room, reload the page, undo/redo twice, and attempt to move a room outside the plot and into another room.

- [x] **8. Deliver the safe natural-language edit wow moment**
  Spec ref: `spec.md > Architecture > Edit-command adapter` and `spec.md > Components and Responsibilities > Natural-language assistant`
  What to build: Implement a small deterministic intent parser and mutation engine for room resize, directional room move, balcony addition, and budget optimization; show interpreted action, affected rooms, trade-offs, confirmation when required, and recoverable unsupported/blocked states.
  Acceptance: The primary demo prompt creates a clear, safe proposal that keeps parking unchanged, explains any cost/space trade-off, and changes nothing until confirmation; blank or unsupported prompts never alter the plan.
  Verify: Run parser/mutation tests for the four supported intents; manually accept and reject the primary demo prompt and compare geometry before/after.

- [x] **9. Add indicative cost, BOQ, and opt-in budget optimization**
  Spec ref: `spec.md > Architecture > Derived-calculation layer`, `spec.md > Components and Responsibilities > Cost estimate and budget optimizer`, and `spec.md > Components and Responsibilities > Preliminary BOQ`
  What to build: Calculate built-up area, quality-based INR-per-sq-ft estimate, category split, budget gap, simplified material quantities, and a user-confirmed optimization suggestion; keep all disclaimers visible.
  Acceptance: Cost follows the selected structured plan and displays the formula and INR formatting; a ₹30L target against a larger estimate shows the gap; BOQ lists all required materials, approximate quantities/units/costs, and “Preliminary AI Estimate.”
  Verify: Unit-test area/rate/BOQ calculations; manually change a room or target budget and confirm Cost and BOQ update without changing the layout unless the user confirms an optimization.

- [x] **10. Build the conceptual 3D floor-plan view**
  Spec ref: `spec.md > Components and Responsibilities > Conceptual 3D view`
  What to build: Convert the active FloorPlan into simple React Three Fiber floors, walls, openings, and basic furniture/exterior massing; add rotate, pan, zoom, loading state, and a clear 2D fallback for WebGL failure.
  Acceptance: The 3D representation visibly corresponds to the active 2D room layout and supports camera controls; losing 3D capability does not block design, cost, BOQ, or export.
  Verify: Manually compare named rooms in 2D and 3D, operate each camera control, and force/mock the fallback state.

- [x] **11. Export the concept and complete resilience polish**
  Spec ref: `spec.md > Components and Responsibilities > Export service`, `spec.md > Constraint and Error Strategy > Demo-critical failures`, and `spec.md > Risks and Verification > Acceptance checks`
  What to build: Generate a local PDF/image summary with project context, selected plan, room list, area, cost, BOQ, and disclaimer; add friendly recoveries for export, local-storage, generation, and 3D failure; polish loading and empty states.
  Acceptance: Exported PDF contains every required summary element and conceptual/professional-review disclaimer; each demo-critical failure offers a recovery action without losing current project data.
  Verify: Download and inspect a Sharma Residence PDF; manually exercise each failure/retry state; run `npm run build` and the full test suite.

- [x] **12. Rehearse the demo and prepare the Devpost handoff**
  Spec ref: `spec.md > Demo and Submission Flow`, `spec.md > Risks and Verification > Acceptance checks`, and `prd.md > §28, §35`
  What to build: Execute the complete Sharma Residence story, capture dashboard/concepts/workspace-edit/3D/cost-export screenshots, document local run steps, record known MVP limits, and gather repository link and demo materials for submission preparation.
  Acceptance: A new reviewer can follow the seven-step demo without outside explanation; the wow-moment edit, 3D, INR cost/BOQ, and export are evidenced; handoff materials are sufficient for `$prepare-submission`.
  Verify: Run the documented demo from a fresh browser session, check every acceptance criterion in `spec.md > Risks and Verification > Acceptance checks`, and review the screenshots/PDF/readme together.
