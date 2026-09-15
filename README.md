# 🏛️ PLANOVA — AI Home Design & Construction Copilot

<p align="center">
  <strong>India-Centric, Frontend-First Architectural Ideation & Budget Optimization Platform</strong><br>
  <em>Empowering Indian home builders, plot owners, civil engineers, and architects to go from brief to blueprint, 3D model, BOQ, and INR cost estimate in seconds.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Three.js-R3F-black?logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Zustand-State-433E38" alt="Zustand" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📌 Problem Statement

In India, over **80% of independent residential homes** are built through informal planning and fragmented communication between homeowners, local contractors (*thekedars*), and draftspersons. This leads to:
1. **Cost Overruns & Budget Mismatches:** Vague initial estimates result in 20–40% budget blowouts during civil work.
2. **Vastu Shastra Violations:** Non-compliant spatial zoning (e.g., kitchens in the North-East or master bedrooms in the North-East) leads to expensive on-site structural modifications.
3. **Slow Iteration Cycles:** Making simple changes like *"enlarge the kitchen and move the bedroom to the rear"* takes days of drafting back-and-forth.

---

## 💡 The Solution: Planova

**Planova** is an intelligent, deterministic, frontend-first architectural copilot tailored specifically for the Indian residential market. It operates entirely offline without expensive backend dependencies, generating constraint-validated 2D blueprints, procedural 3D massing, preliminary material takeoffs (BOQ), and INR cost breakdowns.

```
                  ┌────────────────────────────────────────┐
                  │       Indian Plot & Brief Wizard       │
                  │ (30x50 ft, Facing, BHK, Vastu, Budget) │
                  └───────────────────┬────────────────────┘
                                      │
                                      ▼
                  ┌────────────────────────────────────────┐
                  │     Deterministic Concept Engine       │
                  │ (Balanced, Open Living, Vastu Priority)│
                  └───────────────────┬────────────────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          ▼                           ▼                           ▼
┌───────────────────┐       ┌───────────────────┐       ┌───────────────────┐
│ 2D Blueprint Hub  │       │  Procedural 3D    │       │ Costing & BOQ     │
│ - Pan / Zoom / Drag│       │ - Slabs & Walls   │       │ - 7-Category INR  │
│ - Collision Guard │       │ - Furniture Blocks│       │ - Cement, Steel   │
│ - 20-step Undo/Redo│      │ - Preset Cameras  │       │ - Optimization    │
└─────────┬─────────┘       └───────────────────┘       └───────────────────┘
          │
          ▼
┌────────────────────────────────────────────────────────┐
│         Natural Language Architectural Assistant        │
│ "Make kitchen 20% bigger, move master bedroom back..." │
└─────────────────────────┬──────────────────────────────┘
                          │
                          ▼
┌────────────────────────────────────────────────────────┐
│             Client-Ready A4 PDF Export                 │
│   (Room Schedule, Financials, Legal Disclaimers)       │
└────────────────────────────────────────────────────────┘
```

---

## 🌟 Core Features

### 1. 🇮🇳 Indian Project & Requirements Wizard
- **Plot Dimensions & Orientation:** Supports custom dimensions (e.g., 30×50 ft, 20×40 ft), road sides, and plot facing orientations (North, East, South, West).
- **Indian Living Configurations:** Ground-only or G+1/G+2 duplex structures, 1BHK to 4BHK briefs, dedicated covered parking, utility balconies, and attached/common bathrooms.
- **Feasibility Heuristics:** Instant spatial utilization analysis (FAR calculations) flagging congested briefs while preserving the ability to generate the "best possible layout".

### 2. 📐 Deterministic Concept Generation
- Staged 3-pass generation delivering 3 constraint-validated, fully furnished layouts:
  - **Balanced Layout:** Optimal circulation and space distribution.
  - **Open Living:** Fluid living-dining flow and spacious central core.
  - **Vastu Priority:** Strict directional alignment (NE Ishanya Pooja, SW Nairutya Master Bedroom, SE Agneya Kitchen).

### 3. ✏️ 2D Interactive Blueprint Canvas & Geometry Constraints
- Real-time blueprint editor with smooth pan, zoom, room selection, and direct drag/resize handles.
- **Spatial Constraint Engine:** Prevents out-of-bounds positioning, room overlap, and negative dimensions with safe snapback rollback.
- **20-Snapshot History Stack:** Full Undo/Redo support (`Ctrl+Z` / `Ctrl+Y`).

### 4. ✨ Natural Language Intent Parser & "Wow Moment"
- Deterministic local NLP mutation engine capable of safely interpreting multi-part instructions:
  > *"Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget."*
- Generates a pre-mutation visual preview, affected/locked room highlights, and detailed trade-off explanations before user confirmation.

### 5. 🧱 Procedural 3D Floor-Plan View
- High-performance **React Three Fiber (Three.js)** 3D scene rendering floor foundation slabs, multi-floor tiers, exterior/interior walls, and stylized volumetric furniture massing (beds, kitchen counters, vehicle clearance, mandir).
- One-click camera presets: **Isometric**, **3D Perspective**, **Top-Down 3D**, and **Front Facade**.
- **Resilience Fallback:** Automatically degrades to 2D Safe Mode on devices lacking WebGL hardware acceleration.

### 6. 💰 Indicative INR Costing, BOQ & Budget Optimizer
- Real-time construction budgeting calibrated to Indian regional benchmark rates:
  - **Economy:** ₹1,600 / sq.ft
  - **Standard:** ₹1,900 / sq.ft
  - **Premium:** ₹2,500 / sq.ft
- **7-Category Breakdown:** Civil/Structure, Finishing & Flooring, Plumbing & Sanitation, Electrical, Doors & Windows, Painting, and Contingency.
- **Preliminary BOQ Takeoff:** Calculates quantities for Cement (bags), TMT Steel (MT), Red Bricks/AAC Blocks (units), River Sand/M-Sand (cu.ft), and Vitrified Tiles (sq.ft).
- **Opt-in Budget Optimizer:** Suggests actionable area-trimming and finish-tier modifications to bring over-budget designs back to target.

### 7. 📄 Client-Ready PDF Report Export
- Generates professional multi-page A4 summary sheets with:
  - Project metadata (Client Name, Bhopal Location, Dimensions, Road Facing).
  - Complete architectural room schedule table.
  - 7-category INR cost allocation and material estimates.
  - Mandatory conceptual design and professional review disclaimers.

---

## 🎬 7-Step Sharma Residence Demo Script

Follow this curated walkthrough to experience the entire end-to-end user journey:

| Step | Section | User Action & What to Observe |
|:---:|:---|:---|
| **1** | **Dashboard** | Click on the pre-loaded **Sharma Residence** project (30×50 ft, G+1, 3BHK, Bhopal). |
| **2** | **Project Wizard** | Inspect the two-step brief: 1,500 sq.ft plot, North-facing, ₹35L target budget, Basic Vastu preference. |
| **3** | **Concepts** | Trigger **Generate Concepts** to view the staged progress animation; select **Balanced Layout**. |
| **4** | **2D Workspace** | Select the **Kitchen**; test direct drag and resize handles on the canvas and observe the inspector values. |
| **5** | **NLP Wow Edit** | In the assistant panel, run the prompt:<br>`Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget.`<br>Review the highlighted proposal and click **Apply Changes**. Test **Undo (`Ctrl+Z`)** to restore. |
| **6** | **3D & Finance** | Switch to the **3D View** and toggle camera to **Isometric**; navigate to **Cost** and **BOQ** to inspect real-time INR calculations. |
| **7** | **PDF Export** | Navigate to **Export** and click **Download Concept PDF** for the printable client package. |

---

## 🏗️ Architecture & Project Structure

```
c:\Collage\Drafted
├── public/                 # Static assets & icons
├── src/
│   ├── components/
│   │   ├── assistant/      # Natural Language Assistant & proposal cards
│   │   ├── design/         # 2D PlanCanvas, RoomInspector, DesignGenerationPanel
│   │   ├── feedback/       # ErrorBoundary, ConfirmModal, Toast alerts
│   │   ├── layout/         # AppShell, Navbar, Sub-header toolbars
│   │   ├── project/        # ProjectCard, EmptyState, RenameModal
│   │   ├── visualization/  # ThreeScene (R3F), Fallback2DView
│   │   └── wizard/         # PlotStep, RequirementsStep, FeasibilityModal
│   ├── data/
│   │   └── demoProject.js  # Sharma Residence reference seed data
│   ├── domain/
│   │   ├── constraints.js  # Spatial geometry validator (overlap, bounds)
│   │   ├── project.js      # Zod domain schemas (Project, Plot, Room, etc.)
│   │   └── templates.js    # Balanced, Open Living & Vastu layout templates
│   ├── lib/
│   │   ├── currency.js     # Indian Rupee (Lakhs/Crores) formatting
│   │   ├── ids.js          # Unique ID generators
│   │   └── units.js        # Feet <-> Meters & area conversion utilities
│   ├── routes/
│   │   ├── BoqPage.jsx           # Preliminary Material Takeoffs
│   │   ├── CostPage.jsx          # 7-Category INR Cost Breakdown
│   │   ├── DashboardPage.jsx     # Project management dashboard
│   │   ├── DesignWorkspacePage.jsx # 2D Blueprint & Inspector Workspace
│   │   ├── ExportPage.jsx        # Client PDF Export Hub
│   │   ├── NewProjectPage.jsx    # Indian Requirements Wizard
│   │   ├── ProjectOverviewPage.jsx # Project summary overview
│   │   └── VisualizationPage.jsx # 3D Procedural Floor-Plan View
│   ├── services/
│   │   ├── boq.js          # Material quantities takeoff engine
│   │   ├── costing.js      # INR rate-based costing engine
│   │   ├── edit.js         # Deterministic NLP mutation engine
│   │   ├── export.js       # jsPDF multi-page report generator
│   │   ├── feasibility.js  # Heuristic spatial utilization calculator
│   │   ├── generation.js   # Staged 3-concept generation coordinator
│   │   └── repository.js   # Versioned localStorage with memory fallback
│   ├── store/
│   │   └── useProjectStore.js # Zustand store with 20-snapshot Undo/Redo
│   ├── test/               # Node test suites (78/78 assertions)
│   ├── App.jsx             # React Router routing tree
│   ├── index.css           # Design tokens, fonts & architectural grid styles
│   └── main.jsx            # React root entrypoint
├── checklist.md            # 12-step verified development checklist
├── prd.md                  # Complete Product Requirements Document
├── spec.md                 # Technical Specification Document
├── tailwind.config.js      # Bespoke Terracotta (#C08552) theme configuration
└── package.json            # Project manifest and dependencies
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)

### Setup Instructions

```bash
# 1. Clone the repository
git clone <repository-url>
cd Drafted

# 2. Install dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open your browser and navigate to: **`http://localhost:5173`**



### Building for Production

```bash
npm run build
```
Emits optimized production bundles to the `dist/` directory.

---

## 🎨 Design System & Aesthetics

- **Primary Accent:** `#C08552` (Warm Terracotta / Ochre)
- **Canvas Background:** `#F7F2EB` (Warm Linen)
- **Card Surface:** `#EAE2D6` (Sandstone)
- **Ink & Typography:** `#1E261F` (Deep Charcoal Ink)
- **Typography:** `Inter`, `Outfit` / `Plus Jakarta Sans`, `JetBrains Mono`

---

## ⚖️ Legal & Conceptual Disclaimer

> **Important Notice:** Planova is an AI-assisted architectural copilot intended for preliminary ideation, layout visualization, and budget estimation. All generated drawings, spatial dimensions, structural representations, Vastu recommendations, and material/cost estimates are indicative approximations. They must be reviewed and certified by a registered architect, licensed structural engineer, and local municipal authorities before initiating physical construction or entering financial contracts.

---

<p align="center">
  Developed with ❤️ for Indian Homeowners & Architects.
</p>
