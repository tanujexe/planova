# Drafted MVP — Technical Specification

## Overview

Drafted is a frontend-first, India-centric home-design copilot. A user enters a plot and residential brief, receives three believable structured floor-plan concepts, chooses one, edits it visually or with natural language, and reviews a conceptual 3D view, INR cost estimate, preliminary BOQ, and exportable summary.

This MVP deliberately ships without authentication, a server database, real AI generation, CAD-grade geometry, or regulatory validation. It uses deterministic design templates and a replaceable local AI adapter so the full journey is demoable and reliable. Every output remains explicitly conceptual and requires professional review before construction.

### MVP success path

1. Start the included **Sharma Residence** demo or create a project.
2. Enter plot details and an Indian home brief.
3. See feasibility feedback and generate three concepts.
4. Select a plan; inspect and edit it in 2D.
5. Ask for a safe natural-language change and see the affected rooms, explanation, and undo support.
6. Toggle to a conceptual 3D view; review cost and BOQ; export a PDF/image summary.

### Non-goals

The MVP must not imply construction-grade plans, structural/MEP engineering, municipal compliance, certified Vastu advice, or accurate procurement quantities. These are excluded in line with `prd.md` §34.

## Scope and PRD Coverage

| Product epic | MVP implementation | PRD reference |
| --- | --- | --- |
| Create and retain projects | Local dashboard, project wizard, browser persistence | §6–8, §24–25, §31 |
| India-centric briefing | Plot, road/facing, floors, BHK, Indian room types, Vastu as preference, INR budget | §3, §7–10 |
| Generate concepts | Three deterministic layout variants with staged progress | §11–12, §29–30 |
| Workspace and safe edits | Structured 2D canvas, command panel, constraints, undo/redo | §13–18 |
| 3D visualization | Read-only conceptual extruded representation of the same layout data | §19 |
| Cost and BOQ | Indicative INR estimate, budget gap, simplified material breakdown | §20–22 |
| Export and demo | PDF/image summary and preloaded Sharma Residence | §23, §28 |

## Stack

### Application runtime

- **React + TypeScript + Vite** — rapid frontend delivery, typed domain model, and simple static deployment.
- **React Router** — URLs for dashboard and project sections, so the demo can move between screens predictably.
- **Tailwind CSS** — fast, consistent responsive UI with an architecture-studio visual language.
- **Zustand** — small client store for project state and history; avoids a large global-state setup.
- **Zod** — validates form input and persisted browser data before use.

### Design and visualization

- **React Konva** for the interactive 2D floor plan: pan/zoom, room selection, drag gestures, and overlay highlights. It draws from structured room geometry instead of a bitmap.
- **React Three Fiber + Three.js** for a simple read-only 3D view. Rooms become extruded floor and wall meshes derived from the exact same layout model.
- **Lucide React** for interface icons and **Framer Motion** only for short feedback/loading transitions.

### Documents and persistence

- **localStorage** stores projects and the selected project ID. A versioned repository wrapper enables a later switch to IndexedDB or an API.
- **jsPDF** (and a captured 2D plan image) creates the concept PDF locally. The browser print/download flow is an acceptable fallback.

### Documentation

- [React](https://react.dev/), [Vite](https://vite.dev/guide/), [TypeScript](https://www.typescriptlang.org/docs/)
- [React Router](https://reactrouter.com/home), [Zustand](https://zustand.docs.pmnd.rs/), [Zod](https://zod.dev/)
- [React Konva](https://konvajs.org/docs/react/), [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction), [Three.js](https://threejs.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs), [jsPDF](https://parallax.github.io/jspdf/)

## Architecture

### Frontend shell

The app is a single-page frontend. `AppShell` owns navigation, project loading, a global conceptual-design disclaimer, and a recoverable error boundary. Route screens read and update the project through the client store rather than passing data across many layers.

### Domain model

The structured `Project` object is the source of truth. It contains the brief, generated concepts, selected layout, edit history, and derived financial outputs. A plan is never stored only as an image; canvas, 3D, cost, BOQ, and export all consume the same `FloorPlan` data.

### Generation adapter

`DesignGenerationService` exposes an async interface as though it were an AI API. In the MVP, `MockDesignGenerationService` applies deterministic templates and requirement-based variation after simulated progress stages. A future server-backed model can implement the same interface without changing screens.

### Edit-command adapter

`DesignEditService` parses a deliberately small set of natural-language intents: resize a named room, move a room toward a plot edge, add a balcony, and optimize for budget. It produces a proposed `PlanMutation`, runs constraints, and only commits the mutation when valid or confirmed by the user. Unrecognized prompts return helpful guidance rather than pretending to understand.

### Derived-calculation layer

`CostingService` and `BoqService` are pure functions. They calculate indicative costs and quantities from built-up area, floor count, city/quality rate assumptions, and room/finish flags. Calculations remain local, fast, inspectable, and available when simulated AI is unavailable.

### Persistence boundary

`ProjectRepository` is the only layer that reads or writes browser storage. It validates and migrates stored data, debounces normal saves, and reports write failures to the UI. This prevents local-storage code from leaking into components and makes a backend migration contained.

### Important data-flow contract

```text
Brief form → validation → Project.requirements
                      ↓
          generation adapter → 3 FloorPlan options
                      ↓
            selected FloorPlan in Project.design
             ↙       ↓          ↘
        2D canvas  3D scene  cost + BOQ + export
                      ↑
     visual/NL edit → mutation → constraint validation → history snapshot
```

## Data Model

```ts
type Project = {
  id: string;
  name: string;
  clientName?: string;
  location: string;
  plot: Plot;
  requirements: Requirements;
  designOptions: DesignOption[];
  selectedOptionId?: string;
  design?: FloorPlan;
  history: HistoryState;
  createdAt: string;
  updatedAt: string;
  version: 1;
};

type Plot = {
  width: number; length: number; unit: "ft" | "m";
  floors: 1 | 2 | 3; roadSide: CardinalDirection;
  facing: CardinalDirection; setbacks?: Setbacks;
};

type Requirements = {
  bhk: 1 | 2 | 3 | 4; bathrooms: number; attachedBathrooms: number;
  rooms: RoomRequest[]; parking: { cars: number; twoWheelers: number };
  ventilation: "standard" | "high"; vastu: "off" | "basic" | "high";
  budgetInr?: number; quality: "economy" | "standard" | "premium";
};

type FloorPlan = {
  id: string; name: string; floors: PlanFloor[]; plot: Plot;
  notes: string[]; vastuStatus: "off" | "considered" | "tradeoff";
};

type PlanFloor = { level: number; rooms: Room[]; openings: Opening[] };
type Room = {
  id: string; type: RoomType; label: string;
  x: number; y: number; width: number; height: number;
  required: boolean; floor: number;
};
type Opening = { id: string; type: "door" | "window"; wallRoomId: string; offset: number; width: number };
```

Coordinates use feet internally for MVP simplicity. Metric input is converted when saved and displayed in the user-selected unit. Geometry uses the plot’s bottom-left corner as `(0, 0)`; the renderer converts it to screen coordinates.

## File Structure

```text
src/
  main.tsx                         # Browser entry point
  App.tsx                           # Route tree, error boundary, app shell
  routes/
    DashboardPage.tsx               # Empty state and project cards (PRD §25)
    NewProjectPage.tsx              # Plot/requirements wizard (PRD §7–10)
    ProjectOverviewPage.tsx         # Project summary and option selection
    WorkspacePage.tsx               # 2D editor and natural-language edits (§13–18)
    VisualizationPage.tsx           # Conceptual 3D view (§19)
    CostPage.tsx                    # Estimate and budget optimization (§20–21)
    BoqPage.tsx                     # Preliminary BOQ (§22)
    ExportPage.tsx                  # PDF/image export (§23)
  components/
    layout/                         # Header, sidebar, section navigation
    project/                        # Project cards, project brief and wizard fields
    design/                         # PlanCanvas, room inspector, plan option cards
    assistant/                      # Prompt bar, mutation review, operation status
    visualization/                  # ThreeScene, camera controls, 3D fallback
    finance/                        # Cost breakdown, BOQ table, budget gap card
    feedback/                       # Loading stages, error/retry, confirmation dialogs
  domain/
    project.ts                      # Domain types and Zod schemas
    plan.ts                         # Geometry helpers and plan transformations
    constraints.ts                  # Bounds, overlap, required-room checks
    templates.ts                    # Three India-oriented deterministic layouts
  services/
    generation.ts                   # Replaceable generate-design interface and mock
    edit.ts                         # Intent parsing and safe mutation proposals
    costing.ts                      # Rate/area estimate calculations
    boq.ts                          # Simplified quantity and material estimates
    export.ts                       # PDF and plan-image export
    repository.ts                   # Versioned localStorage repository
  store/
    useProjectStore.ts              # Project state, persistence actions, undo/redo
  hooks/                            # Debounce, unsaved-change, plan selection hooks
  lib/                              # Currency, unit conversion, IDs, shared utilities
  data/demoProject.ts               # Sharma Residence seeded project (PRD §28)
  styles/                           # Tailwind base styles and design tokens
```

## Components and Responsibilities

### Project wizard

Implements: `prd.md` §7–10.

Collects project, plot, and home requirements in two short steps. Validates required name, positive dimensions, supported floor count, and practical warnings such as an oversized room request for the available plot. It distinguishes blocking errors from “generate best possible layout” warnings.

### Feasibility panel

Implements: `prd.md` §10, §26.

Runs lightweight heuristics using required-room area plus circulation and parking allowance. It never claims bylaw compliance. It presents the conflict and lets the user return to the brief or proceed knowingly.

### Design generation panel

Implements: `prd.md` §11–12, §27, §29.

Shows staged messages—analysing plot, planning relationships, checking constraints, preparing concepts—while generation resolves. It disables duplicate submits, preserves input on failure, and shows retry/edit actions. The result always contains three distinguishable options: Balanced Layout, Open Living, and Vastu Priority.

### Plan canvas and room inspector

Implements: `prd.md` §13–15.

Renders plot boundaries, rooms, openings, dimensions, and parking from `FloorPlan`. Users select and drag rooms; the inspector offers numeric width/height adjustments. A prospective change is checked before commit; invalid placements snap back with a concise explanation. Required rooms cannot be deleted through the MVP UI.

### Natural-language assistant

Implements: `prd.md` §16–18, §35.

Accepts non-empty requests, displays its interpreted action, highlights impacted rooms, and requires confirmation for meaningful trade-offs. It retains the former layout while working and saves a history snapshot only after a mutation is committed. The primary demo phrase has a deterministic, supported response.

### Undo and redo controls

Implements: `prd.md` §18.

Store complete, compact `FloorPlan` snapshots—not canvas pixels—before each successful manual or AI edit. Keep at most 20 entries to limit local storage. Undo/redo is disabled at history bounds and creating a new edit clears redo.

### Conceptual 3D view

Implements: `prd.md` §19, §26.

Converts room rectangles into simple floors, wall segments, doors, and windows. Pan/zoom/rotate controls operate entirely in-browser. If WebGL fails, the app keeps the 2D plan available and offers a “3D unavailable on this device” message rather than blocking the project.

### Cost estimate and budget optimizer

Implements: `prd.md` §20–21.

Calculates built-up area from plan floors and applies editable indicative INR-per-sq-ft defaults by quality tier. Shows total, category split, target budget difference, formula, and disclaimer. “Optimize for budget” proposes the smallest deterministic plan/finish adjustments; it must not silently alter the chosen plan.

### Preliminary BOQ

Implements: `prd.md` §22.

Transforms area and floor count into labeled rough quantities for cement, steel, blocks, flooring, paint, doors, windows, electrical, and plumbing. It displays units, approximate value, and the “Preliminary AI Estimate” / non-procurement disclaimer.

### Export service

Implements: `prd.md` §23.

Builds a locally downloaded summary containing project context, requirements, selected 2D plan image, room list, area, estimate, BOQ summary, and professional-review disclaimer. Export failure leaves the project intact and exposes a retry action.

### Dashboard and demo seed

Implements: `prd.md` §24–25, §28.

Loads a one-time Sharma Residence sample on a fresh browser profile. Displays project metadata, thumbnail, status, and last update. Rename, duplicate, and delete operate on local data; delete always uses an explicit confirmation dialog.

## Key Workflows and API Contracts

### Generate designs

```ts
interface DesignGenerationService {
  generate(input: { plot: Plot; requirements: Requirements }): Promise<{
    options: DesignOption[];
    warnings: FeasibilityWarning[];
  }>;
}
```

The mock returns exactly three constraint-valid plans after progress callbacks. A production implementation could call `POST /api/designs/generate` with the same input and response shape.

### Propose an edit

```ts
interface DesignEditService {
  propose(input: {
    plan: FloorPlan; prompt: string; requirements: Requirements;
  }): Promise<{
    status: "ready" | "needs_confirmation" | "unsupported" | "blocked";
    mutation?: PlanMutation;
    explanation: string;
    tradeoffs?: string[];
  }>;
}
```

The UI commits only a `ready` mutation or a user-confirmed `needs_confirmation` mutation. `blocked` and `unsupported` never modify the plan.

### Persist project

```ts
interface ProjectRepository {
  list(): ProjectSummary[];
  get(id: string): Project | null;
  save(project: Project): void;
  remove(id: string): void;
}
```

`save` serializes only schema-validated data. Corrupt saved data is quarantined and the user is offered a fresh demo project rather than crashing.

## State, Navigation, and Persistence

- The Zustand store owns the loaded project, save status, operation state, selection, and undo/redo history.
- URL routes identify a project (`/projects/:projectId/design`, `/cost`, `/boq`, etc.) so browser navigation does not erase edits.
- Changes are persisted after successful wizard saves, concept selection, confirmed edit, rename, and explicit finance adjustment.
- For direct manipulation, save after drag end rather than every pointer move.
- `useUnsavedChangesGuard` warns before leaving a dirty form or closing a wizard step. Project screens show a non-blocking saved/saving indicator.
- On reload, the repository restores the last selected project. If no projects exist, the dashboard offers “Create your first design.”

## Constraint and Error Strategy

### Constraint checks

Before a plan is committed, `validatePlan` confirms:

1. each room has positive width and height;
2. each room is within its floor’s plot boundary;
3. rooms on the same floor do not overlap;
4. required rooms still exist;
5. parking remains within the plot; and
6. openings still point to an existing room wall.

The MVP allows imperfect circulation and Vastu trade-offs, but calls them out in plan notes rather than declaring them solved.

### Demo-critical failures

| Failure | User-visible recovery | State guarantee |
| --- | --- | --- |
| Generation simulation fails | Retry or edit requirements | Brief remains intact |
| Edit violates geometry | Explain conflict and offer alternatives | Current plan unchanged |
| Browser storage is unavailable/full | Session-only warning and download prompt | Screen remains usable |
| WebGL/3D fails | Continue in 2D | Selected plan unchanged |
| Export fails | Retry export | Project and design unchanged |

## AI Usage

The MVP is honest about simulation: no external LLM is required. The local generation and edit adapters emulate the expected async and explanation states while using deterministic transformations. This supports repeatable judging and avoids API-key or network failures.

The adapters are intentional seams for a later AI release:

- send only the structured brief and plan JSON, never depend on image-only output;
- require a proposed structured mutation rather than free-form geometry;
- run local constraint validation after every returned mutation;
- display interpretations and trade-offs before irreversible changes; and
- retain explicit “conceptual, professional review required” messaging in every AI-driven view and export.

## Demo and Submission Flow

1. Open Sharma Residence on the dashboard.
2. Show its 30×50 ft north-facing plot, Bhopal context, 3BHK brief, basic Vastu preference, and ₹35L target.
3. Generate concepts (or reset to show the staged generation experience) and select Balanced Layout.
4. In the workspace, enter: “Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget.”
5. Review the highlighted proposed change and budget trade-off; confirm it and demonstrate Undo.
6. Toggle 3D, then open cost and BOQ to connect the layout to an INR estimate.
7. Export the conceptual PDF and point out the professional-review disclaimer.

## Risks and Verification

### Principal risks

- **Geometry interaction becomes too complex.** Limit MVP interactions to selection, drag, resize, and deterministic command types; use a clean, believable single-floor canvas before expanding multi-floor editing.
- **3D consumes too much build time.** Keep it read-only and stylized; 2D is the primary design truth and the fallback.
- **Cost/BOQ appears authoritative.** Prominently label both as indicative/preliminary and show assumptions.
- **“AI” feels fake.** Make progress, interpretation, highlighted deltas, constraint messages, and a replaceable adapter visible rather than hiding a canned result.
- **Browser persistence fails.** Treat repository errors as non-fatal and make export available as a user-controlled backup.

### Acceptance checks

- A user can complete the PRD’s success journey from a fresh browser session with no network connection.
- Creating a valid project and refreshing restores it with selected plan and edit history.
- Invalid dimensions block submission; impractical briefs warn but allow “best possible” generation.
- Each generated option passes plan validation and presents a different stated design characteristic.
- The primary natural-language demo command produces a safe proposal; rejecting it leaves the plan byte-for-byte unchanged.
- Dragging a room outside bounds or into another room cannot commit an invalid plan.
- Undo and redo restore the previous structured geometry and update 2D, 3D, cost, and BOQ consistently.
- A cost overrun shows amount and an opt-in optimization proposal.
- 3D and export failures leave the 2D design usable.
- Generated PDF includes the selected plan, project summary, financial summary, and conceptual/professional-review disclaimer.

## Build Order

1. Establish typed model, repository, demo seed, routes, and dashboard.
2. Build project wizard plus blocking validation and feasibility warnings.
3. Add deterministic generation, option cards, and selected-plan persistence.
4. Build 2D canvas, constraints, visual edit, and undo/redo.
5. Add prompt-to-mutation adapter with confirmation and operation feedback.
6. Add cost, BOQ, and budget optimization proposal.
7. Add simple 3D view and graceful fallback.
8. Add export, then run the acceptance checks through the demo flow.
