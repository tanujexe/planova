# Architectural Map Generation Process & Technical Architecture

## 1. System Overview

Planova is an intelligent architectural layout and spatial design engine built for residential house planning. It converts high-level user preferences (plot dimensions, orientation, floor counts, room requirements, and budget targets) into dynamically generated, geometrically validated 2D floor plans, 3D visual scenes, material cost estimations (BOQ), and CAD DXF exports.

---

## 2. End-to-End Execution Pipeline

```
┌───────────────────────────────────────────────────────────┐
│                     USER INPUT STAGE                      │
│ Plot Specs, Facing Direction, Floors, BHK & Room Wishlist  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│         PHASE 1: FEASIBILITY & CAPACITY ENGINE            │
│ Evaluates room area vs usable plot footprint & congestion │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│     PHASE 2: SETBACK & BUILDING ENVELOPE COMPUTATION      │
│ Calculates municipal setbacks & usable building bounds    │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│      PHASE 3: MULTI-FLOOR ROOM DISTRIBUTION ENGINE        │
│ Balances public/private zones & injects staircase core   │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│     PHASE 4: DYNAMIC ZONING & CONCEPT GENERATION          │
│ 1. Balanced Layout  | 2. Open Living  | 3. Vastu Priority │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│       PHASE 5: FENESTRATION & WALL OPENINGS ENGINE        │
│ Attaches perimeter doors & windows with offset clearance  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│       PHASE 6: GEOMETRIC CONSTRAINT & CONTAINMENT         │
│ Validates positive bounds, plot containment & zero overlap │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│      PHASE 7: NATURAL LANGUAGE AI & MUTATION ENGINE       │
│ Grid search, adaptive resizing & locked invariant checks  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│          DOWNSTREAM VISUAL & EXPORT INTEGRATIONS          │
│ BOQ Costing, Interior Furniture Staging, 3D Scene, DXF    │
└───────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Technical Breakdown

### Phase 1: Pre-Generation Feasibility & Spatial Capacity Analysis
**Source File:** [`src/services/feasibility.js`](file:///d:/Projects/planova/src/services/feasibility.js)

Before placing any structural walls, the system evaluates the architectural brief using `checkBriefFeasibility`:
- **Base Area Sizing:** Standard minimum area allocations per room type (Living: 220 sq.ft, Dining: 120 sq.ft, Kitchen: 100 sq.ft, Master Bed: 160 sq.ft, Bathrooms: 40 sq.ft, etc.) plus a 22% allowance for wall thickness and internal circulation corridors.
- **Capacity Ratio Calculation:** 
  $$\text{Utilization Ratio} = \frac{\text{Total Required Built-Up Area}}{\text{Usable Footprint} \times \text{Number of Floors}}$$
- **Congestion Classification:**
  - `comfortable` ($\le 90\%$)
  - `tight` ($91\% - 115\%$)
  - `highly_constrained` ($116\% - 135\%$)
  - `not_feasible` ($> 135\%$)
- **Rule Verification:** Checks if parking footprint exceeds 45% of the ground floor footprint or if plot width is too narrow for side-by-side multi-car parking.

---

### Phase 2: Setback & Building Envelope Computation
**Source File:** [`src/domain/templates.js`](file:///d:/Projects/planova/src/domain/templates.js) (`calculateSetbacks`)

Calculates municipal setbacks dynamically based on plot width, length, and road-facing direction:
- Side setback: $1.5\text{ ft} - 3\text{ ft}$
- Rear setback: $1.5\text{ ft} - 3\text{ ft}$
- Front setback: $2\text{ ft} - 4\text{ ft}$ (adjusted according to cardinal facing)

Computes usable boundary coordinates:
$$\text{leftX} = \text{sideSetback}$$
$$\text{topY} = (\text{facing} == \text{'south'}) ? \text{rearSetback} : \text{frontSetback}$$
$$\text{usableW} = \text{plotW} - (2 \times \text{sideSetback})$$
$$\text{usableL} = \text{plotL} - (\text{frontSetback} + \text{rearSetback})$$

---

### Phase 3: Vertical Multi-Floor Room Distribution Engine
**Source File:** [`src/domain/templates.js`](file:///d:/Projects/planova/src/domain/templates.js) (`distributeRoomsAcrossFloors`)

For multi-story structures, rooms in the catalog are split logically across floors:
- **Ground Floor Priority:** Parking, entrance foyer, pooja room, living hall, dining area, kitchen, pantry, and utility space.
- **Upper Floor Priority:** Balconies, primary master bedroom suites, guest bedrooms, children's bedrooms, study, and walk-in closets.
- **Internal Staircase Injection:** Automatically injects structural staircase cores ($7\text{ ft} \times 10\text{ ft}$) across all levels to guarantee vertical circulation.

---

### Phase 4: Dynamic Architectural Zoning & Concept Layout Engine
**Source Files:** [`src/services/generation.js`](file:///d:/Projects/planova/src/services/generation.js), [`src/domain/templates.js`](file:///d:/Projects/planova/src/domain/templates.js)

The service generates 3 distinct architectural variations in parallel:

#### 1. Balanced Layout Concept (`generateBalancedLayout`)
- **Focus:** Harmonious family zoning, natural cross-ventilation, clear circulation corridors, and structural column alignment.
- **Zoning:** Classic spatial split with central living hall and dedicated kitchen/utility wings.

#### 2. Open Living Great-Room Concept (`generateOpenLivingLayout`)
- **Focus:** Contemporary open-plan living with open sightlines and maximum daylighting.
- **Zoning:** Merges living hall, dining space, and island kitchen into a single uninterrupted Great Room core. Includes full-width sky deck terraces on upper levels.

#### 3. Vastu Priority Concept (`generateVastuPriorityLayout`)
- **Focus:** Strict 8-directional cosmic alignment adhering to traditional Indian Vastu Shastra principles:
  - **North-East (*Ishanya*):** Pooja/Mandir room & entrance foyer for morning solar rays.
  - **South-East (*Agni*):** Kitchen and utility zone for optimal thermodynamics.
  - **South-West (*Nairutya*):** Master Bedroom suite for grounded stability and privacy.
  - **North-West (*Vayavya*):** Parking and staircase cores.
  - **Center (*Brahmasthan*):** Open living & dining space.

#### Tiered Spatial Placement Algorithm (`layoutFloorWithRooms`)
Divides usable floor length into 3 depth tiers:
- **Front Tier:** Road frontage zones (Parking, Foyer, Pooja, Front Balcony).
- **Middle Tier:** Living, Dining, Staircase, Study.
- **Rear Tier:** Bedrooms, Kitchen, Utility, Bathrooms.

Each room is assigned proportional bounding boxes `(x, y, width, height)` using weight distribution algorithms scaled to tier heights.

---

### Phase 5: Automatic Fenestration & Wall Openings Engine
**Source File:** [`src/domain/templates.js`](file:///d:/Projects/planova/src/domain/templates.js)

Attaches architectural openings to perimeter room walls automatically:
- **Entrance Doors:** Positioned on top walls of front-tier foyers or living areas with safe offset margins.
- **Exterior Windows:** Attached to outer perimeter walls (top, bottom, left, right) with window widths dynamically sized between $2.5\text{ ft}$ and $4.0\text{ ft}$ depending on available wall length.

---

### Phase 6: Geometric Constraint Validation & Boundary Sanitizer
**Source Files:** [`src/domain/constraints.js`](file:///d:/Projects/planova/src/domain/constraints.js), [`src/domain/templates.js`](file:///d:/Projects/planova/src/domain/templates.js) (`ensurePlanContainment`)

Every generated or modified floor plan must pass 6 hard architectural constraints via `validatePlan`:
1. **Positive Sizing:** Every room must have `width > 0` and `height > 0`.
2. **Plot Containment:** Every room bounding rectangle must sit entirely inside the plot boundary:
   $$x \ge 0 \quad \land \quad y \ge 0 \quad \land \quad (x + \text{width}) \le \text{plotW} \quad \land \quad (y + \text{height}) \le \text{plotL}$$
3. **Zero Spatial Overlap:** Pairwise rectangle intersection check with tolerance ($\epsilon = 0.05$):
   $$\text{doRectanglesOverlap}(R_1, R_2) = \neg(R_{1,right} \le R_{2,left} \lor R_{2,right} \le R_{1,left} \lor R_{1,bottom} \le R_{2,top} \lor R_{2,bottom} \le R_{1,top})$$
4. **Valid Opening Attachments:** Verifies that doors and windows belong to existing room IDs and fit within wall bounds.

---

### Phase 7: Interactive Natural Language AI & Spatial Mutation Engine
**Source Files:** [`src/services/edit.js`](file:///d:/Projects/planova/src/services/edit.js), [`src/services/mutationEngine.js`](file:///d:/Projects/planova/src/services/mutationEngine.js)

Enables conversational layout modifications (e.g., *"Expand kitchen by 20% and move master bedroom to rear SW zone while keeping parking locked"*):

1. **Intent Extraction:** `DesignEditService.parseIntent` parses natural language text into actionable flags (`isKitchenResize`, `isBedroomMove`, `isBalconyAdd`, `isBudgetOptimize`, `hasParkingLock`).
2. **1ft-Grid Candidate Placement Search:** `MutationEngine.findSafePosition` scans the floor on a 1ft coordinate grid to discover collision-free positions closest to target directional quadrants (e.g. `rear_sw`, `front`, `center`).
3. **Adaptive Safe Resizing:** `MutationEngine.findSafeResize` tests balanced, width-only, and height-only expansion strategies down in 2% decrements to apply the maximum safe room expansion without wall collisions.
4. **Locked Room Invariants:** `MutationEngine.validateLockedElements` ensures locked elements (such as parking) remain unchanged.
5. **Atomic Transactions:** `MutationEngine.executeMutation` executes mutations on cloned state. If validation fails, the change is safely aborted and reported as `blocked`.

---

### Phase 8: Downstream Intelligence & Integrations

- **Bill of Quantities (BOQ) & Costing (`src/services/costing.js`, `src/services/boq.js`):** Calculates built-up area and itemized construction costs (civil structure, masonry, flooring, plumbing, electrical, finishing) based on quality tier.
- **Automated Furniture Staging (`src/services/staging.js`, `src/domain/furnitureCatalog.js`):** Auto-stages standard architectural furniture (King/Queen beds, L-shaped sofas, kitchen counters) with clearance checks.
- **3D Real-time Scene (`src/components/visualization/ThreeScene.jsx`):** Generates 3D wall extrusions, room textures, doors, windows, and furniture models rendered with Three.js.
- **CAD DXF & PDF Export (`src/services/dxfBuilder.js`, `src/services/export.js`):** Converts 2D room geometries, wall lines, doors, and window blocks into industry-standard DXF files for AutoCAD.

---

## 4. Key Source Code File Matrix

| Component / Engine | Path | Primary Responsibilities |
| :--- | :--- | :--- |
| **Generation Service** | [`src/services/generation.js`](file:///d:/Projects/planova/src/services/generation.js) | Coordinates generation pipeline & returns 3 options |
| **Templates & Layout Engine** | [`src/domain/templates.js`](file:///d:/Projects/planova/src/domain/templates.js) | Setbacks, room distribution, tier zoning, Vastu layouts |
| **Constraint Validation** | [`src/domain/constraints.js`](file:///d:/Projects/planova/src/domain/constraints.js) | Plot containment, non-overlap, boundary checks |
| **Feasibility Checker** | [`src/services/feasibility.js`](file:///d:/Projects/planova/src/services/feasibility.js) | Pre-generation capacity, room sq.ft estimations |
| **Natural Language AI Edit** | [`src/services/edit.js`](file:///d:/Projects/planova/src/services/edit.js) | Natural language intent parsing and proposal creation |
| **Spatial Mutation Engine** | [`src/services/mutationEngine.js`](file:///d:/Projects/planova/src/services/mutationEngine.js) | Grid search, collision-free placement, safe resizing |
| **Costing & BOQ Engine** | [`src/services/costing.js`](file:///d:/Projects/planova/src/services/costing.js) | Real-time budget and material estimation |
| **DXF Builder** | [`src/services/dxfBuilder.js`](file:///d:/Projects/planova/src/services/dxfBuilder.js) | Export to CAD DXF format |
