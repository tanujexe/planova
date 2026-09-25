# 🏛️ PLANOVA — AI Home Design, Vastu Architecture & Construction Copilot

<p align="center">
  <strong>India-Centric, Frontend-First Architectural Ideation, 3D Walkthrough & Budget Optimization Platform</strong><br>
  <em>Empowering Indian homeowners, plot buyers, civil engineers, and architects to go from a simple brief to constraint-validated blueprints, procedural 3D walkthroughs, preliminary BOQ takeoffs, and INR cost estimates in seconds.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5.2-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Three.js-R3F%20%7C%20Drei-black?style=flat-square&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/Konva-React--Konva-0D99FF?style=flat-square" alt="Konva" />
  <img src="https://img.shields.io/badge/Tests-8%20Suites%20%7C%2091%20Passed-brightgreen?style=flat-square" alt="Tests" />
  <img src="https://img.shields.io/badge/Deployment-Vercel%20%7C%20Netlify%20%7C%20Docker-blue?style=flat-square&logo=docker&logoColor=white" alt="Deployment Ready" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License: MIT" />
</p>

---

## 📑 Table of Contents

- [The Problem in Indian Home Building](#-the-problem-in-indian-home-building)
- [The Solution: Planova](#-the-solution-planova)
- [Core Capabilities](#-core-capabilities)
  - [1. Indian Plot & Requirements Wizard](#1-indian-plot--requirements-wizard)
  - [2. Deterministic Concept Engine & Vastu Shastra](#2-deterministic-concept-engine--vastu-shastra)
  - [3. Parametric Auto-Staging Service](#3-parametric-auto-staging-service)
  - [4. Interactive 2D Blueprint Studio](#4-interactive-2d-blueprint-studio)
  - [5. Procedural 3D Walkthrough (Three.js / R3F)](#5-procedural-3d-walkthrough-threejs--r3f)
  - [6. Natural Language Architectural Assistant](#6-natural-language-architectural-assistant)
  - [7. Civil Costing, Preliminary BOQ & Budget Optimizer](#7-civil-costing-preliminary-boq--budget-optimizer)
  - [8. Dual Professional Export (Client PDF & AutoCAD DXF)](#8-dual-professional-export-client-pdf--autocad-dxf)
- [Walkthrough Demo: The Sharma Residence](#-walkthrough-demo-the-sharma-residence)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
- [Automated Testing Suite](#-automated-testing-suite)
- [Production Deployment](#-production-deployment)
- [Design Aesthetics](#-design-aesthetics)
- [Legal & Professional Disclaimer](#-legal--professional-disclaimer)

---

## 📌 The Problem in Indian Home Building

In India, over **80% of independent residential homes** (individual villas, row houses, and plotted developments) are built through informal planning and fragmented communication between homeowners, local contractors (*thekedars*), and draftspersons. This process routinely suffers from:

1. **Catastrophic Cost Overruns:** Vague preliminary estimates and lack of early bill-of-quantities (BOQ) result in **20% to 40% budget blowouts** during foundation and structural brickwork.
2. **Vastu Shastra Violations & Structural Rework:** Traditional Indian families prioritize spatial zoning (e.g. Master Bedroom in South-West *Nairutya*, Kitchen in South-East *Agneya*, Pooja in North-East *Ishanya*). Discovering non-compliant layouts midway through construction causes demolitions and expensive retrofits.
3. **Tedious Iteration Cycles:** Making simple customer alterations like *"expand the kitchen by 2 feet, add a balcony, and move the guest bedroom to the rear"* requires days of drafting back-and-forth in CAD.
4. **Disconnection Between 2D, 3D, and Cost:** Changes in 2D plans are rarely reflected simultaneously in 3D visualizations or material cost estimates, leaving homeowners uninformed about the financial consequences of spatial decisions.

---

## 💡 The Solution: Planova

**Planova** is a high-performance, frontend-first architectural copilot built specifically for Indian residential planning. It operates with zero mandatory cloud dependencies, providing immediate feedback across the entire architectural lifecycle:

```
                    ┌──────────────────────────────────────────────┐
                    │          Indian Plot & Brief Wizard          │
                    │   (30x50 ft, Facing, Duplex, Vastu, Budget)  │
                    └──────────────────────┬───────────────────────┘
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │         Deterministic Concept Engine         │
                    │   Balanced  │   Open Living   │  Vastu Priority │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌─────────────────────────────────┼─────────────────────────────────┐
         ▼                                 ▼                                 ▼
┌───────────────────┐             ┌───────────────────┐             ┌───────────────────┐
│ 2D Blueprint Hub  │             │   Procedural 3D   │             │   Cost & BOQ Hub  │
│ - Konva 2D Canvas │             │ - Three.js / R3F  │             │ - 7 Civil Sectors │
│ - Collision Guard │             │ - Slab Extrusions │             │ - Cement, Steel   │
│ - Double Walls    │             │ - Furniture Mass  │             │ - Bricks, Sand    │
│ - Auto-Staging    │             │ - Camera Presets  │             │ - Budget Trim     │
└────────┬──────────┘             └───────────────────┘             └───────────────────┘
         │
         ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                           Natural Language Studio Assistant                           │
│     "Make kitchen 20% bigger and move master bed back while keeping parking safe"     │
└──────────────────────────────────────────┬────────────────────────────────────────────┘
                                           │
                                           ▼
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                              Dual Production Exports                                  │
│         Client-Ready A4 PDF Summary Sheet    │    Multi-Layered AutoCAD DXF Drawing   │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Core Capabilities

### 1. 🇮🇳 Indian Plot & Requirements Wizard
- **Real-World Plot Profiles:** Supports standard Indian plotted dimensions (e.g. 30×50 ft, 25×40 ft, 40×60 ft, 20×50 ft narrow plots) with configurable road facing directions (North, East, South, West).
- **Duplex & Multi-Floor Briefing:** Configure Single Ground (G), Duplex (G+1), or Triplex (G+2) configurations with floor-by-floor room distribution.
- **Indian Lifestyle Typologies:** Select room programs tailored to Indian households: Attached Pooja Mandirs, Covered Car Porches, Open Living-Dining halls, Utility Wash Balconies, and Kitchen Store rooms.
- **Heuristic Feasibility Guard:** Computes real-time Floor Area Ratio (FAR) and municipal setbacks, warning users if a requested brief exceeds healthy plot density before generating designs.

### 2. 🧭 Deterministic Concept Engine & Vastu Shastra
Generates 3 distinctive, fully furnished, constraint-compliant layouts in seconds:
- **Balanced Layout:** Optimized circulation cores, minimal hallway waste, and balanced daylight exposure across bedrooms and living spaces.
- **Open Living:** Contemporary open-plan layout connecting the living hall, dining area, and kitchen into an expansive entertaining space.
- **Vastu Priority:** Strict adherence to Vedic architectural cardinal rules:
  - **North-East (*Ishanya*):** Sacred Pooja room, meditation corner, and open veranda.
  - **South-East (*Agneya*):** Fire element zone — Kitchen and cooking hobs facing East.
  - **South-West (*Nairutya*):** Earth element zone — Master Bedroom and heaviest structural mass for family stability.
  - **North-West (*Vayavya*):** Air element zone — Guest bedrooms, attached bathrooms, and utility balconies.

### 3. 🛋️ Parametric Auto-Staging Service
- Automatically furnishes rooms using an architectural furniture catalog ([`src/domain/furnitureCatalog.js`](file:///c:/Collage/Drafted/src/domain/furnitureCatalog.js)) containing **25+ standardized components**:
  - **Living:** 3-seater sofas, L-shape sectionals, coffee tables, TV media consoles, accent armchairs, indoor fiddle leaf planters, and large area rugs.
  - **Bedrooms:** King-size beds with nightstands, queen beds, single beds, built-in 2-ft wardrobes, study desks, and perimeter carpets.
  - **Kitchen & Dining:** Granite L-shape countertops, 3-burner gas hobs, refrigerators, waterfall kitchen islands with barstools, and 4/6-seater dining sets.
  - **Sanitaryware & Bath:** Vitreous china WCs, vanity sinks, glass shower enclosures, and freestanding soaking tubs.
  - **Pooja & Entry:** Teakwood Pooja mandir shrines, entrance shoe consoles, and vehicle massing (luxury sedans & SUVs in parking bays).
- Dynamically respects clearance envelopes and adapts orientation according to room aspect ratios.

### 4. ✏️ Interactive 2D Blueprint Studio
- **High-Performance Canvas:** Built on **Konva / React-Konva** supporting smooth 60fps pan, zoom, selection, dragging, and corner-handle resizing.
- **Spatial Constraint Engine:** Instant geometric validation detects wall collisions, room overlaps, and plot boundary spillover, automatically rolling back illegal placements.
- **Double-Line Walls & Openings:** Renders structural 9-inch exterior walls, 4.5-inch internal partition walls, door swing clearance arcs (90° opening radius), and framed double-line window sills.
- **20-Snapshot History Stack:** Full Undo/Redo (`Ctrl+Z` / `Ctrl+Y`) preserves state across all manual manipulations and AI mutations.

### 5. 🧱 Procedural 3D Walkthrough (Three.js / R3F)
- Real-time 3D massing powered by **Three.js**, **@react-three/fiber**, and **@react-three/drei**:
  - Plinth foundation slabs, polished floor finishes, extruded wall solids, door/window wall cutouts, and 3D volumetric furniture blocks.
  - Dedicated floor level isolation: inspect Ground Floor (G), First Floor (L1), or the complete stacked building.
  - One-click cinematic camera presets: **Isometric**, **3D Perspective Orbit**, **Top-Down Plan**, and **Front Elevation Facade**.
- **Hardware Fallback Mode:** Automatically detects environments lacking WebGL hardware acceleration and falls back smoothly to a 2D Safe Mode without crashing.

### 6. ✨ Natural Language Architectural Assistant
- Features a deterministic natural-language mutation engine ([`src/services/edit.js`](file:///c:/Collage/Drafted/src/services/edit.js)) capable of resolving complex compound instructions:
  > *"Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged and staying close to my ₹30L budget."*
- **Safety First ("The Wow Moment"):** Instead of silently mutating the drawing, Planova presents an interactive pre-commit proposal modal highlighting affected rooms, locked structural assets, and clear 4-part architectural trade-offs for user confirmation.

### 7. 💰 Civil Costing, Preliminary BOQ & Budget Optimizer
- **Indian Market-Calibrated Rates:**
  - **Economy:** ₹1,600 / sq.ft (Basic brickwork, ceramic tiles, standard fittings)
  - **Standard:** ₹1,900 / sq.ft (Vitrified tiles, branded CP fittings, flush doors, acrylic paint)
  - **Premium:** ₹2,500 / sq.ft (Italian marble/granite, teakwood joinery, premium automation)
- **7 Civil Work Allocations:** Civil Structure & Concrete (38%), Finishing & Flooring (22%), Plumbing & Sanitation (10%), Electrical Work (9%), Doors & Windows (9%), Painting (6%), and Contingency (6%).
- **Preliminary Material Takeoff (BOQ):** Generates practical construction material quantities based on built-up area:
  - Cement bags (PPC/OPC)
  - TMT Reinforcement Steel (Metric Tonnes)
  - Red Clay Bricks / AAC Blocks (Count)
  - River Sand / M-Sand (Cubic Feet)
  - Vitrified Flooring Tiles (Square Feet)
- **Budget Optimizer:** Automatically generates actionable proposals to trim built-up area or modify finishing tiers when designs exceed the homeowner's target budget.

### 8. 📄 Dual Professional Export (Client PDF & AutoCAD DXF)
- **Client-Ready A4 PDF ([`src/services/export.js`](file:///c:/Collage/Drafted/src/services/export.js)):** Generates a multi-page executive summary including project specifications, room schedules, 7-category INR budget allocation, BOQ takeoffs, and professional architectural disclaimers.
- **AutoCAD DXF Exporter ([`src/services/dxfBuilder.js`](file:///c:/Collage/Drafted/src/services/dxfBuilder.js)):** Generates clean, standard AutoCAD R12/2000 DXF files organized into professional architectural CAD layers:
  - `WALLS` — Exterior structural envelope and internal partition double-lines
  - `DOORS` — Leaves and 90° swing clearance arcs
  - `WINDOWS` — Framed sill openings and glass lines
  - `FURNITURE` — Staged furniture blocks
  - `ROOM_LABELS` — Room names, dimensions (ft-in), and area (sq.ft)
  - `DIMENSIONS` — Plot boundaries and room span annotations
  - `TITLE_BLOCK` — Border frame, location, date, and project title block

---

## 🎬 Walkthrough Demo: The Sharma Residence

Experience the complete end-to-end user journey with the pre-seeded **Sharma Residence** project:

| Step | Studio Screen | Action & Observation |
|:---:|:---|:---|
| **1** | **Dashboard** | Click on the pre-loaded **Sharma Residence** (30×50 ft, G+1, 3BHK, Bhopal). |
| **2** | **Project Overview** | Inspect the brief: 1,500 sq.ft plot, North road-facing, ₹35L target budget, Basic Vastu preferences. |
| **3** | **Concepts** | Click **Generate Concepts** to watch the staged concept animation; compare **Balanced**, **Open Living**, and **Vastu Priority**. |
| **4** | **2D Blueprint** | Select the **Kitchen**; test dragging and resizing via canvas handles. Verify that out-of-bounds moves snap back safely. |
| **5** | **Auto-Staging** | Toggle furniture staging on/off and observe how king beds, wardrobes, L-shape couches, and sanitaryware populate automatically. |
| **6** | **NLP Wow Edit** | In the Natural Language Assistant, enter:<br><code>Make the kitchen 20% bigger and move the master bedroom to the back while keeping the parking unchanged.</code><br>Review the highlighted proposal and click **Apply Changes**. Press `Ctrl+Z` to verify instant undo. |
| **7** | **3D Walkthrough** | Switch to **3D View**. Toggle between **Isometric**, **Perspective**, and **Top-Down** camera views. Switch between Ground Floor and Stacked View. |
| **8** | **Cost & BOQ** | Navigate to **Cost & Budget** and **BOQ Takeoff** to view real-time INR costing and concrete/steel quantities. |
| **9** | **Export** | Navigate to **Export PDF/DXF**. Download both the **Client PDF Report** and the **AutoCAD DXF Drawing** for direct import into CAD. |

---

## 🏗️ Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PLANOVA CLIENT ARCHITECTURE                     │
├────────────────────────────────────────────────────────────────────────┤
│  UI Framework:        React 18.3 (Strict Mode)                         │
│  Build Tool:          Vite 5.2 + ES Modules (Code-Split Route Chunks)  │
│  Styling & Theme:     TailwindCSS 3.4 (Architectural Warm Linen Theme) │
│  State Management:    Zustand 4.5 (20-Step Mutation History Stack)     │
│  2D Canvas Engine:    Konva 9.3 + React-Konva 18.2                     │
│  3D Visualizer:       Three.js 0.165 + @react-three/fiber + drei       │
│  Schema Validation:   Zod 3.23 (FloorPlan, Plot, Room, Opening Schemas)│
│  Export Engines:      jsPDF 2.5 + html2canvas 1.4 + Custom DXF Builder │
│  Containerization:    Docker + Nginx 1.27 Alpine Multi-Stage           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

```
c:\Collage\Drafted
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated GitHub Actions test & build workflow
├── public/
│   ├── favicon.svg              # Planova compass architectural icon
│   ├── robots.txt               # Search engine crawler policies
│   ├── site.webmanifest         # PWA and mobile bookmark metadata
│   ├── _redirects               # Netlify SPA client routing rules
│   └── rooms/                   # Architectural sample render assets
├── scripts/
│   └── postbuild.js             # Generates dist/404.html for static CDN fallbacks
├── src/
│   ├── components/
│   │   ├── assistant/           # Natural Language Assistant & proposal cards
│   │   ├── design/              # 2D PlanCanvas, RoomInspector, GenerationPanel
│   │   ├── feedback/            # ErrorBoundary, PageLoading, ConfirmModal, Toast
│   │   ├── layout/              # AppShell, Top Navbar, Sub-header toolbars
│   │   ├── project/             # ProjectCard, EmptyState, RenameModal
│   │   ├── studio/              # LearnModal (Vastu rules & architectural guide)
│   │   ├── visualization/       # ThreeScene (R3F), Fallback2DView
│   │   └── wizard/              # PlotStep, RequirementsStep, FeasibilityModal
│   ├── data/
│   │   └── demoProject.js       # Pre-seeded Sharma Residence benchmark project
│   ├── domain/
│   │   ├── constraints.js       # Spatial geometry validator (overlap, bounds)
│   │   ├── furnitureCatalog.js  # Standardized architectural furniture definitions
│   │   ├── project.js           # Zod domain schemas (Project, Plot, Room, etc.)
│   │   └── templates.js         # Balanced, Open Living & Vastu layout templates
│   ├── lib/
│   │   ├── currency.js          # Indian Rupee (Lakhs/Crores ₹) formatting
│   │   ├── ids.js               # Unique nanoid-style identifier generators
│   │   └── units.js             # Feet ↔ Meters & square feet calculation utilities
│   ├── routes/
│   │   ├── BoqPage.jsx          # Preliminary Material Takeoff (Cement, Steel)
│   │   ├── CostPage.jsx         # 7-Category INR Construction Cost Breakdown
│   │   ├── DashboardPage.jsx    # Projects listing & creation portal
│   │   ├── DesignDetailsPage.jsx# Deep architectural draft specifications
│   │   ├── ExportPage.jsx       # Client A4 PDF & AutoCAD DXF exporter
│   │   ├── NewProjectPage.jsx   # 2-Step Indian Requirements Wizard
│   │   ├── ProjectOverviewPage.jsx # Architectural studio overview
│   │   ├── VisualizationPage.jsx# Procedural 3D Walkthrough View
│   │   └── WorkspacePage.jsx    # 2D Blueprint & Inspector Workspace
│   ├── services/
│   │   ├── boq.js               # Preliminary material quantities engine
│   │   ├── costing.js           # INR rate-based costing engine
│   │   ├── dxfBuilder.js        # Multi-layer AutoCAD DXF generator
│   │   ├── edit.js              # Deterministic NLP mutation engine
│   │   ├── export.js            # jsPDF client summary report generator
│   │   ├── feasibility.js       # Heuristic spatial utilization calculator
│   │   ├── generation.js        # Staged 3-concept generation coordinator
│   │   ├── repository.js        # Versioned localStorage with memory fallback
│   │   └── staging.js           # Architectural auto-staging service
│   ├── store/
│   │   └── useProjectStore.js   # Central Zustand store with 20-snapshot Undo/Redo
│   ├── test/                    # 8 Unit test suites (91 assertions)
│   ├── App.jsx                  # React Router routes with React.lazy code splitting
│   ├── index.css                # Design tokens & subtle blueprint grid styles
│   └── main.jsx                 # Application DOM entrypoint
├── .dockerignore                # Docker build context exclusions
├── .env.example                 # Environment configuration template
├── .gitignore                   # Production git ignores (dist, logs, envs)
├── DEPLOYMENT.md                # Multi-platform production deployment guide
├── Dockerfile                   # Multi-stage production build (Node → Nginx Alpine)
├── docker-compose.yml           # Local & cloud Docker compose configuration
├── index.html                   # HTML5 shell with SEO & Open Graph meta tags
├── netlify.toml                 # Netlify deployment configuration
├── nginx.conf                   # Production Nginx config (gzip, SPA rewrites, headers)
├── package.json                 # Project manifest, scripts, and dependencies
├── tailwind.config.js           # Warm linen & terracotta architectural palette
├── vercel.json                  # Vercel deployment configuration
└── vite.config.js               # Vite config with Rollup manualChunks splitting
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or v20.x LTS recommended)
- **npm** (v9.0.0 or later)

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/shrinarayanbhagat/Drafted.git
cd Drafted

# 2. Install project dependencies
npm install

# 3. Start the local development server
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🧪 Automated Testing Suite

Planova includes **8 comprehensive test suites** covering **91 unit assertions** executed using Node's built-in test runner:

```bash
# Run the complete test suite
npm test
```

### Test Coverage Matrix

| Test Suite | File | Assertions | Validated Functionality |
| :--- | :--- | :---: | :--- |
| **Spatial Constraints** | `constraints.test.js` | **14** | Overlap detection, plot bounds, negative spans, locked room protection, safe snapback |
| **Domain & Schema** | `domain.test.js` | **12** | Zod schema validation, feet ↔ meters conversions, Indian Rupee string formatting (`₹35L`, `₹1.2Cr`) |
| **NLP Mutation Engine** | `edit.test.js` | **14** | Compound prompt parsing, safe resize bounds, zone blocking detection, trade-off descriptions |
| **PDF & Exports** | `export.test.js` | **4** | jsPDF multi-page document structure, room schedule generation, export filename conventions |
| **Feasibility & Wizard** | `feasibility.test.js` | **9** | FAR heuristics, plot density warnings, BHK minimum dimensional thresholds |
| **Costing & BOQ** | `finance.test.js` | **16** | Economy/Standard/Premium rates, 7-category sums, Cement/Steel/Bricks/Sand formulas |
| **Layout Generation** | `generation.test.js` | **15** | Balanced/Open/Vastu layouts, municipal setbacks, daylight glazing ratios, dynamic Pooja alignment |
| **History & Undo/Redo** | `history.test.js` | **7** | 20-step snapshot push, state restoration on undo, redo forward traversal, invalid mutation blocking |

---

## 🚢 Production Deployment

Planova is configured for **one-click deployment** across all major web hosting platforms and container environments. Complete deployment instructions can be found in [**`DEPLOYMENT.md`**](file:///c:/Collage/Drafted/DEPLOYMENT.md).

### Quick Deployment Cheatsheet

| Provider | Build Command | Output Dir | Routing & SPA Fallback |
| :--- | :--- | :---: | :--- |
| **Vercel** | `npm run build` | `dist` | Automated via [`vercel.json`](file:///c:/Collage/Drafted/vercel.json) |
| **Netlify** | `npm run build` | `dist` | Automated via [`netlify.toml`](file:///c:/Collage/Drafted/netlify.toml) & [`public/_redirects`](file:///c:/Collage/Drafted/public/_redirects) |
| **Cloudflare Pages** | `npm run build` | `dist` | Handled via `_redirects` & `dist/404.html` |
| **GitHub Pages** | `npm run build` | `dist` | Handled via `dist/404.html` static fallback |
| **Docker Container** | `docker compose up -d --build` | Port `80` | Multi-stage build with Nginx Alpine in [`Dockerfile`](file:///c:/Collage/Drafted/Dockerfile) |

### Building Locally

```bash
# Compile optimized production bundle with static fallback
npm run build

# Preview production build locally
npm run preview
```

### Performance & Bundle Optimization
- **Route-level Code Splitting:** Converted all route views to `React.lazy()` with `<Suspense>`, reducing the initial landing bundle from **1.8 MB** down to **98.9 kB**.
- **Vendor Chunking:** Heavy libraries (`Three.js`, `Konva`, `jsPDF`, `Lucide`) are isolated into independent, long-term cacheable vendor chunks.
- **Security Headers:** Pre-configured `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, and `Referrer-Policy: strict-origin-when-cross-origin`.

---

## 🎨 Design Aesthetics

Planova is styled with an architectural aesthetic inspired by classic drafting studios, parchment paper, and modern Scandinavian minimalism:

- **Primary Accent:** `#C08552` / `#E0582B` (Warm Indian Terracotta & Ochre)
- **Background Canvas:** `#FAF9F5` / `#F7F5F0` (Natural Unbleached Linen)
- **Cards & Surfaces:** `#FFFFFF` with `#EAE6DF` / `#E5E0D8` Borders (Architectural Cardstock)
- **Ink & Typography:** `#141414` / `#18181B` (Deep Charcoal Ink)
- **Font Families:**
  - *Serif Display:* **DM Serif Display**, **Playfair Display**, **Newsreader**
  - *Clean Sans:* **Inter**, **Plus Jakarta Sans**
  - *Technical Mono:* **JetBrains Mono**
- **Drafting Grid:** Subtle 28px blueprint grid and 20px dot grid backgrounds.

---

## ⚖️ Legal & Professional Disclaimer

> **Important Notice:** Planova is an AI-assisted architectural ideation and visualization tool intended for preliminary planning, spatial arrangement, and indicative budget estimation. All generated floor plans, room dimensions, structural representations, Vastu recommendations, and material/cost estimates are conceptual approximations. They do not substitute for formal architectural blueprints, soil testing, or structural load calculations. All plans must be reviewed, finalized, and stamped by a certified architect, licensed structural engineer, and approved by local municipal planning authorities (*Nagar Nigam / Municipal Corporation*) before commencing physical construction or executing civil contracts.

---

<p align="center">
  Built with precision for Indian Homeowners, Architects & Civil Engineers.<br>
  <strong>Planova © 2026. Released under the MIT License.</strong>
</p>
