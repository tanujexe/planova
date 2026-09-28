# Planova Architectural Design Making Process & System Flow

> **Document Type:** Architectural System Specification & Workflow Manual  
> **Target Audience:** Architects, Engineers, Designers & Stakeholders  
> **Scope:** End-to-End Conceptualization, Computational Geometry, Spatial Zoning, Vastu Alignment, 3D Visualization, BOQ Costing, and CAD Export Pipeline

---

## 1. Executive Summary & Design Philosophy

**Planova** is an intelligent residential architectural layout engine designed specifically for modern home planning (with deep grounding in Indian residential architecture, municipal bylaws, and cosmic Vastu principles).

The engine operates on a fundamental principle: **Transforming high-level human intent into structurally sound, geometrically validated, and aesthetically proportioned living spaces.**

Instead of forcing users to draw walls manually on an empty canvas or presenting static, inflexible blueprints, Planova uses a **multi-stage parametric pipeline**:

```
[User Brief & Requirements]
            │
            ▼
[Spatial Feasibility & Capacity Analysis]
            │
            ▼
[Municipal Setback & Envelope Computation]
            │
            ▼
[Vertical Multi-Floor Room Distribution]
            │
            ▼
[Dynamic Zoning & 3-Concept Generation]
    ├── Balanced Layout (Functional Harmony)
    ├── Open Living (Contemporary Great Room)
    └── Vastu Priority (8-Directional Alignment)
            │
            ▼
[Automated Fenestration (Doors & Windows)]
            │
            ▼
[Geometric Constraints & 4-Pillar Soft Scoring]
            │
            ▼
[Interactive Studio & Safe Spatial Mutations]
    ├── 2D Drag, Drop & Collision Avoidance
    └── Natural Language AI Spatial Editing
            │
            ▼
[Automated Ergonomic Furniture Staging]
            │
            ▼
[Real-Time 3D Massing & Walkthrough]
            │
            ▼
[BOQ Material Estimation & Financial Costing]
            │
            ▼
[CAD DXF & Architectural PDF Export]
```

---

## 2. Complete Step-by-Step Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STEP 1: USER INPUT & BRIEF                           │
│  • Plot Dimensions (Width × Length in ft)                                   │
│  • Cardinal Facing Direction (North / East / South / West)                  │
│  • Building Levels (Ground, G+1, G+2)                                       │
│  • Room Catalog Selection with S / M / L Size Modifiers                     │
│  • Budget Target & Construction Quality Tier (Economy / Standard / Premium) │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             STEP 2: PRE-GENERATION FEASIBILITY & CAPACITY ENGINE            │
│  • Computes dynamic room areas based on plot footprint and BHK tier         │
│  • Estimates gross built-up area (+22% circulation & wall thickness)        │
│  • Evaluates Utilization Ratio = Required Area / Total Usable Footprint     │
│  • Classifies congestion: Comfortable | Tight | Constrained | Not Feasible   │
│  • Validates parking footprint vs ground floor availability                 │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│          STEP 3: MUNICIPAL SETBACK & BUILDING ENVELOPE COMPUTATION          │
│  • Calculates Front, Rear, and Side setbacks via municipal building norms   │
│  • Dynamically shifts front setback to the road-facing cardinal edge        │
│  • Derives usable building boundary box: leftX, topY, usableW, usableL      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            STEP 4: VERTICAL MULTI-FLOOR ROOM DISTRIBUTION ENGINE            │
│  • Allocates public & service spaces to Ground Floor (Living, Kitchen, Park)│
│  • Elevates private suites to Upper Floors (Master Bed, Balcony, Study)     │
│  • Injects a unified vertical circulation staircase core (7ft × 10ft)        │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│            STEP 5: DYNAMIC ZONING & CONCEPT GENERATION PIPELINE             │
│  Generates 3 distinct architectural options in parallel:                    │
│                                                                             │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │   Balanced Layout    │ │     Open Living      │ │    Vastu Priority    │ │
│  │ • 3-Tier depth split │ │ • Merged Great Room  │ │ • 8-Sector alignment │ │
│  │ • Daylight corridors │ │   (Living+Dining+Kit)│ │ • NE: Pooja / Entry  │ │
│  │ • Structural symmetry│ │ • Wrap-around private│ │ • SE: Kitchen / Agni │ │
│  │                      │ │ • Panoramic glazing  │ │ • SW: Master Suite   │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             STEP 6: PROPORTIONAL ROOM SIZING & PLACEMENT ALGORITHM          │
│  • Maps rooms into Front, Middle, and Rear tiers                            │
│  • Calculates tier heights adjusted for plot aspect ratio (narrow vs wide)  │
│  • Proportions room widths using dynamic area weight ratios                 │
│  • Positions staircase on the opposite side of entrance to prevent choke    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              STEP 7: AUTOMATED FENESTRATION & WALL OPENINGS                 │
│  • Detects exterior perimeter walls (Top, Bottom, Left, Right)              │
│  • Injects entrance doors at front foyer/verandah with offset clearance     │
│  • Sinks room-specific windows (5.5ft Living, 4ft Beds, 2ft Baths/Utility)  │
│  • Sanitizes offsets to prevent openings colliding with corners or pillars  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│       STEP 8: GEOMETRIC CONSTRAINT VERIFICATION & 4-PILLAR SCORING          │
│  • HARD GATES: Positive bounds, Plot containment, Zero pairwise overlap     │
│  • Candidate Search: Generates variants (standard, flipped stair, ratio)    │
│  • 4-PILLAR SOFT SCORING (0 to 100):                                        │
│    1. Aspect Ratio (Max 25 pts)  — Penalizes elongated rooms (> 1:2.0)      │
│    2. Circulation (Max 25 pts)   — Guarantees min 3.0ft passage clearance   │
│    3. Adjacencies (Max 25 pts)   — Kit-Dining proximity, Pooja-Bath isolation│
│    4. Natural Light (Max 25 pts) — Habitable rooms must have perimeter light│
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│          STEP 9: INTERACTIVE 2D STUDIO & NATURAL LANGUAGE AI EDITS          │
│  • Real-time 2D Canvas: Drag, resize, and inspect room properties           │
│  • Natural Language Assistant: "Make kitchen 20% bigger, move bed to back" │
│  • 1ft-Grid Search: Finds safe collision-free coordinates in target zones   │
│  • Adaptive Resizing: Probes safe expansion down in 2% decrements           │
│  • Locked Room Invariants: Protects user-locked rooms (e.g. Parking)        │
│  • Transaction History: Undo (Ctrl+Z) and Redo (Ctrl+Y) state management    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             STEP 10: AUTOMATED INTERIOR FURNITURE STAGING ENGINE            │
│  • Evaluates room types, dimensions, and wall openings                      │
│  • Places King/Queen beds with flanking nightstands and wardrobes           │
│  • Places L-shaped sectional sofas, coffee tables, TV units, and rugs       │
│  • Positions dining sets, kitchen counters, and sanitary fixtures           │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│             STEP 11: 3D REAL-TIME MASSING & VIRTUAL WALKTHROUGH             │
│  • Procedural wall extrusion with door and window cutouts (8ft walls)       │
│  • Curated architectural materials, floor textures, and lighting atmospheres│
│  • Cutaway dollhouse mode vs. Full-height enclosed massing                  │
│  • First-person walkthrough (FPS camera controls with collision detection)  │
│  • Floor isolation or multi-floor vertical building stack                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│               STEP 12: FINANCIAL COSTING & MATERIAL BOQ ENGINE              │
│  • Computes gross built-up area and quality tier rates                      │
│  • 7-Part Budget Breakdown (Civil 48%, Flooring 12%, Doors/Windows 10%, etc)│
│  • Engineering BOQ: Cement bags, TMT steel rebars, bricks, sand, paint, MEP │
│  • Budget Optimization: Identifies material or circulation savings options  │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                STEP 13: CAD DXF & CLIENT PRESENTATION EXPORT                │
│  • Industry-Standard AutoCAD DXF Export (Structured layers: WALLS, DOORS,   │
│    WINDOWS, FURNITURE, LABELS, DIMENSIONS, TITLE_BLOCK)                     │
│  • Multi-page Client Presentation PDF with schedules, costs, and blueprints│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Phase-by-Phase Technical Walkthrough

---

### Step 1: User Input & Spatial Brief Capture

The design process begins with user requirements captured through the **Room Catalog Builder** and **Plot Setup Wizard**:

1. **Plot Geometry:**
   - Width and Length in feet (e.g., standard Indian plot sizes: $30 \times 50\text{ ft}$, $40 \times 60\text{ ft}$, $20 \times 40\text{ ft}$, $50 \times 80\text{ ft}$).
   - Cardinal road-facing orientation: **North**, **East**, **South**, or **West**.
   - Floor configuration: Single-story (**Ground Only**), Duplex (**G+1**), or Triplex (**G+2**).

2. **Room Selection & S/M/L Modifiers:**
   - Users can either choose a preset BHK (1BHK through 5BHK) or customize room counts individually.
   - Every room has pre-engineered **Small (S)**, **Medium (M)**, and **Large (L)** dimension presets reflecting standard Indian residential furniture clearances:
     - **Primary Master Bedroom:** S ($13 \times 14\text{ ft}$), M ($15 \times 15\text{ ft}$), L ($16 \times 17.5\text{ ft}$)
     - **Secondary Bedroom:** S ($10 \times 12\text{ ft}$), M ($12 \times 12.6\text{ ft}$), L ($13 \times 15\text{ ft}$)
     - **Living Hall:** S ($14 \times 16\text{ ft}$), M ($16 \times 20\text{ ft}$), L ($18 \times 24\text{ ft}$)
     - **Kitchen:** S ($8 \times 10\text{ ft}$), M ($10 \times 12\text{ ft}$), L ($12 \times 14\text{ ft}$)
     - **Pooja / Mandir:** S ($5 \times 5\text{ ft}$), M ($6 \times 6\text{ ft}$), L ($8 \times 8\text{ ft}$)
     - **Covered Parking:** S ($10 \times 15\text{ ft}$), M ($12 \times 18\text{ ft}$), L ($18 \times 20\text{ ft}$ - 2 Cars)

3. **Financial & Finishing Preferences:**
   - Client Target Budget (e.g., ₹35,00,000).
   - Finishing Quality Tier:
     - **Economy** (@ ₹1,500 / sq.ft): Standard vitrified tiles, flush doors, basic sanitaryware.
     - **Standard** (@ ₹1,900 / sq.ft): Double-charged vitrified tiles, branded fixtures (Jaquar/Astral), granite counters.
     - **Premium** (@ ₹2,500 / sq.ft): Italian marble/wooden flooring, teakwood doors, concealed MEP, premium fittings.

---

### Step 2: Pre-Generation Feasibility & Capacity Analysis

Before laying down any walls, the system executes an automated spatial sanity check to prevent impossible designs:

1. **Dynamic Scaling of Room Areas:**
   - Rather than assuming fixed room sizes, the engine calculates a **Composite Scale Factor**:
     - Plot scale factor: Compares total plot area against a standard $1,500\text{ sq.ft}$ baseline.
     - BHK scale factor: Adjusts space allocation for 2BHK vs 4BHK briefs.
   - Scaled room areas are clamped between strict architectural minimums and maximums (e.g., master bedroom is bounded between $130\text{ sq.ft}$ and $240\text{ sq.ft}$).

2. **Circulation & Wall Thickness Allowance:**
   - Structural walls, columns, internal hallways, and staircase landings consume physical area.
   - The engine automatically adds a **22% structural allowance factor** over the net room areas:
     $$\text{Gross Required Area} = (\text{Net Room Areas} + \text{Staircase Area}) \times 1.22 + \text{Parking Footprint}$$

3. **Utilization Ratio & Congestion Level:**
   - The engine computes the ratio of requested gross area to usable building footprint:
     $$\text{Utilization Ratio} = \frac{\text{Gross Required Built-Up Area}}{\text{Usable Footprint} \times \text{Number of Floors}}$$
   - **Status Classifications:**
     - **Comfortable** ($\le 90\%$): Ample space for spacious rooms and open courtyards.
     - **Tight** ($91\% - 115\%$): Well-utilized layout; rooms are compact but fully functional.
     - **Highly Constrained** ($116\% - 135\%$): Very congested; warning displayed suggesting reducing room sizes or adding another floor.
     - **Not Feasible** ($> 135\%$): Mathematically cannot fit; user is prompted to add a floor or remove rooms before proceeding.

4. **Ground-Floor Parking Sanity Check:**
   - Verifies that car parking footprint does not exceed $45\%$ of the ground floor footprint.
   - Verifies that the plot width can physically accommodate the required vehicle bays.

---

### Step 3: Municipal Setback & Usable Building Envelope Computation

Buildings cannot be constructed right up to plot property lines. Indian municipal building bye-laws (such as NBC, BBMP, DDA) mandate open buffer spaces (setbacks) around the structure for fire safety, solar daylight, and ventilation:

1. **Side Setbacks (Adapts to Plot Width):**
   - Narrow plots ($< 25\text{ ft}$ width): Minimum $1.5\text{ ft}$ setback to maximize interior room width.
   - Standard plots ($25\text{ ft} - 50\text{ ft}$ width): $2.0\text{ ft} - 3.0\text{ ft}$ setback.
   - Wide plots ($> 50\text{ ft}$ width): Scaled up to $3.5\text{ ft} - 5.0\text{ ft}$ for garden pathways.

2. **Front Setback (Directionally Aware):**
   - Front road side requires the deepest setback for driveway clearance, gate swings, and municipal road widening.
   - Sized between $2.5\text{ ft}$ and $5.5\text{ ft}$ depending on plot length.
   - **Directional Shift:** If the house faces South, the front setback is positioned on the bottom edge; if North, on the top edge.

3. **Rear Setbacks:**
   - Sized between $1.5\text{ ft}$ and $4.5\text{ ft}$ for rear ventilation and utility drainage.

4. **Derivation of the Usable Envelope:**
   - Using setbacks, the engine establishes the **Usable Coordinate Bounds**:
     - $\text{leftX} = \text{sideSetback}$
     - $\text{topY} = (\text{facing} == \text{'south'}) ? \text{rearSetback} : \text{frontSetback}$
     - $\text{usableW} = \text{plotWidth} - (2 \times \text{sideSetback})$
     - $\text{usableL} = \text{plotLength} - (\text{frontSetback} + \text{rearSetback})$
   - Every single interior room must sit strictly within this bounded rectangle.

---

### Step 4: Vertical Multi-Floor Room Distribution Engine

For multi-story structures (Duplex G+1 or Triplex G+2), the system automatically segregates rooms based on residential privacy hierarchies:

1. **Ground Floor (Public & Service Domain):**
   - Dedicated vehicle parking and pedestrian entrance foyer.
   - Sacred space: Pooja room.
   - Social entertainment zones: Living hall and formal dining room.
   - Culinary wing: Kitchen, pantry, and utility/washing area.
   - Ground-floor guest bedroom or elderly parents' bedroom (avoiding stairs for seniors).

2. **Upper Floors (Private Family Domain):**
   - Primary Master Bedroom Suite with attached walk-in closet and en-suite master bath.
   - Children’s bedrooms and additional guest bedrooms.
   - Private study / home office.
   - Front road-facing terrace sit-outs and private balconies.

3. **Vertical Circulation Core (Staircase Injection):**
   - If the project has $\ge 2$ floors, the engine automatically injects an internal staircase core ($7\text{ ft} \times 10\text{ ft} = 70\text{ sq.ft}$).
   - The staircase position is synchronized vertically across all levels to create an aligned structural core.

---

### Step 5: Dynamic Zoning & Concept Generation (The 3 Options)

To provide clients with meaningful architectural choices, Planova generates **three distinct design concepts** simultaneously:

```
                  ┌──────────────────────────────┐
                  │    3 ARCHITECTURAL CONCEPTS  │
                  └──────────────┬───────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  BALANCED LAYOUT │    │   OPEN LIVING    │    │  VASTU PRIORITY  │
│  (Harmonious     │    │  (Great Room     │    │  (Cosmic         │
│   Circulation)   │    │   Social Core)   │    │   Alignment)     │
└──────────────────┘    └──────────────────┘    └──────────────────┘
```

#### Option 1: Balanced Layout
- **Philosophy:** Practical family living with clear circulation corridors, functional acoustic buffers, and structural column alignment.
- **Organization:** Classic 3-tier depth division:
  - *Front Tier:* Parking, Entrance Foyer, Pooja.
  - *Middle Tier:* Spacious Living & Dining hall, Central Staircase.
  - *Rear Tier:* Kitchen, Utility, Master Bedroom, and Bathrooms.
- **Benefit:** Best all-around layout for cross-ventilation, privacy separation, and economical structural framing.

#### Option 2: Open Living (Great Room Core)
- **Philosophy:** Contemporary lifestyle emphasizing expansive volume, natural daylighting, and uninterrupted social sightlines.
- **Organization:**
  - Merges Living Hall, Dining Area, and Island Kitchen into a single **Great Room Core** occupying $\approx 46\%$ of the ground floor depth.
  - Peripheral rooms (parking, guest bath, stairs) wrap neatly around this social pavilion.
  - Upper floor features wide sliding glass doors opening onto expansive sky decks.
- **Benefit:** Makes compact plots feel twice as large by eliminating unnecessary interior partition walls.

#### Option 3: Vastu Priority (8-Sector Cosmic Alignment)
- **Philosophy:** Strict adherence to traditional Indian Vedic Vastu Shastra principles, aligning functional spaces with solar and magnetic vectors.
- **Directional Rules Applied:**
  - **North-East (*Ishanya* - Water/Solar Gateway):** Pooja/Mandir room and main entrance verandah to capture early morning ultraviolet sun rays.
  - **South-East (*Agni* - Fire Element):** Kitchen and utility zone for optimal thermal ventilation and smoke dispersal.
  - **South-West (*Nairutya* - Earth Element):** Master Bedroom anchored here for grounded psychological stability, silence, and privacy.
  - **North-West (*Vayavya* - Air Element):** Parking bay and staircase core.
  - **Brahmasthan (Center):** Kept open and unencumbered to allow natural light and energy circulation.

---

### Step 6: Proportional Room Sizing & Placement Algorithm

Once the rooms are categorized into tiers, the engine runs the **Tiered Spatial Placement Algorithm**:

1. **Aspect-Ratio-Aware Tier Heights:**
   - The usable depth (`usableL`) is partitioned among tiers based on plot proportions:
     - Long & Narrow plots (Aspect ratio $> 1.6$): Middle tier is expanded to prevent narrow corridor choke points.
     - Wide & Shallow plots (Aspect ratio $< 1.0$): Front and rear tiers are given equal depth.

2. **Proportional Width Distribution:**
   - Within each tier, available width (`usableW`) is shared among rooms according to their required area weights:
     $$\text{Room Width}_i = \text{usableW} \times \left( \frac{\text{Required Area}_i}{\sum \text{Required Areas in Tier}} \right)$$
   - The final room in a tier takes the remainder width (`usableW - currentX`) to guarantee zero wasted space and precise wall-to-wall contact.

3. **Staircase Collision Avoidance:**
   - The engine checks which side of the front tier contains the main entrance door.
   - The staircase core is automatically placed on the **opposite side** to ensure the entrance hallway has a clear, unobstructed sightline.

---

### Step 7: Automated Fenestration & Wall Openings Engine

A floor plan is not complete without doors and windows. The fenestration engine automatically calculates and attaches architectural openings:

1. **Perimeter Wall Detection:**
   - The engine analyzes room coordinates against the building envelope boundary to determine which walls touch the exterior (Top, Bottom, Left, Right).

2. **Entrance Doors:**
   - Positioned on the exterior wall of the front foyer or living room.
   - Sized at a standard $3.0\text{ ft}$ clearance width with an offset of $1.5\text{ ft}$ from the corner to accommodate door frame framing and structural lintels.

3. **Room-Function-Specific Window Sizing:**
   - Openings are tailored to the functional daylight requirements of each room type:
     - **Living Room:** $5.5\text{ ft}$ wide panoramic window for maximum daylight.
     - **Bedrooms / Study:** $4.0\text{ ft}$ wide standard window for cross-ventilation.
     - **Kitchen:** $3.2\text{ ft}$ wide window positioned over the cooking platform.
     - **Bathrooms & Utility:** $2.0\text{ ft}$ wide high-sill privacy ventilators.
     - **Balconies:** $5.0\text{ ft}$ wide terrace sliding glass doors.

4. **Offset Clearance Sanitization:**
   - Every opening is checked against its host wall length.
   - If a room wall is short, window width is scaled down dynamically so openings never cross room corners or collide with adjacent walls.

---

### Step 8: Geometric Constraint Verification & 4-Pillar Soft Scoring

Every candidate layout must pass strict validation before being presented to the user:

#### Hard Constraints (Zero-Tolerance Gates)
If any of these fail, the plan is rejected immediately:
1. **Positive Dimensions:** Width $> 0$ and Height $> 0$ for every room.
2. **Plot Containment:** Every room's bounding box must sit fully inside the plot perimeter ($x \ge 0, y \ge 0, x+w \le \text{plotW}, y+h \le \text{plotL}$).
3. **Zero Spatial Overlap:** Pairwise rectangle intersection check with epsilon tolerance ($\epsilon = 0.05\text{ ft}$). No two rooms can collide or occupy the same floor area.
4. **Valid Fenestration:** Every door and window must belong to a real room ID and fit within the physical length of that room’s wall.

#### 4-Pillar Architectural Soft-Scoring Engine (0 to 100 Points)
For valid candidates, the engine runs a multi-criteria scoring algorithm to select the optimal layout:

```
┌────────────────────────────────────────────────────────┐
│             4-PILLAR ARCHITECTURAL SCORING             │
├──────────────────────────┬─────────────────────────────┤
│ Pillar 1: Aspect Ratio   │ 25 Points Max               │
│ Pillar 2: Circulation    │ 25 Points Max               │
│ Pillar 3: Adjacency      │ 25 Points Max               │
│ Pillar 4: Natural Light  │ 25 Points Max               │
├──────────────────────────┼─────────────────────────────┤
│ TOTAL QUALITY SCORE      │ 100 Points Max              │
└──────────────────────────┴─────────────────────────────┘
```

1. **Pillar 1: Aspect Ratio Score (25 Points):**
   - Ideal rooms are square or gently rectangular ($1:1$ to $1:1.6$).
   - Penalizes awkward, hallway-like distorted rooms:
     - Aspect ratio $> 1:2.0 \implies -4\text{ pts}$ penalty.
     - Severe distortion $> 1:2.5 \implies -10\text{ pts}$ penalty.

2. **Pillar 2: Circulation & Corridor Clearance (25 Points):**
   - Evaluates passages between non-touching rooms.
   - Guarantees minimum passage width of $3.0\text{ ft}$.
   - Choke points ($< 3.0\text{ ft}$) receive a $-5\text{ pts}$ penalty.

3. **Pillar 3: Functional Adjacency Scoring (25 Points):**
   - **Kitchen $\leftrightarrow$ Dining proximity:** Bonus points if distance between centers is $\le 18\text{ ft}$.
   - **Master Bedroom $\leftrightarrow$ En-Suite Bathroom:** Bonus points if bathroom is adjacent ($\le 16\text{ ft}$).
   - **Pooja Room $\leftrightarrow$ Bathroom Separation:** Heavy penalty ($-6\text{ pts}$) if a sacred Pooja room shares a common wall with any toilet or sanitary wet zone.

4. **Pillar 4: Natural Light & Exterior Perimeter Exposure (25 Points):**
   - Every habitable room (Living, Bedrooms, Kitchen, Study) must have at least one wall touching the exterior building envelope and a window opening.
   - Landlocked habitable rooms with zero perimeter daylight receive a $-12\text{ pts}$ penalty.

---

### Step 9: Interactive 2D Studio & Natural Language AI Assistant

Once a design concept is selected, users can refine it in the **2D Studio Workspace**:

#### Interactive 2D Canvas
- **Room Inspector:** Click any room to view exact dimensions ($W \times L$), usable square footage, and assigned room type.
- **Direct Canvas Editing:** Drag rooms to reposition or resize edges. Every interaction is run through `validateRoomMutation` in real time—if an edit would cause an overlap or break plot boundaries, it is blocked with immediate visual feedback.
- **Multi-Level Switcher:** Toggle seamlessly between Ground Floor (G), First Floor (L1), and Terrace.
- **Undo / Redo History Stack:** Full transaction history supporting `Ctrl+Z` (Undo) and `Ctrl+Y` (Redo).

#### Natural Language AI Assistant & Spatial Mutation Engine
Users can also edit plans conversing in plain English (e.g., *"Make the kitchen 20% bigger, move the master bedroom to the rear South-West zone, keep parking unchanged, and stay close to my ₹30L budget"*):

1. **Intent Parsing:**
   - Extracts semantic flags: room targets, resize percentages, directional targets (`rear`, `front`, `center`), budget limits, and locked elements.

2. **1ft-Grid Collision-Free Search:**
   - To move a room, the mutation engine scans the floor on a $1\text{ ft}$ coordinate grid.
   - Filters out all positions that collide with other rooms or violate boundaries.
   - Finds the candidate coordinate closest to the requested quadrant that provides genuine spatial displacement.

3. **Adaptive Safe Resizing Algorithm:**
   - If a user asks to enlarge a room by $20\%$, adjacent rooms might block full expansion.
   - The engine tests three expansion strategies (balanced width+height, width-only, height-only) starting at the requested $20\%$ down in $2\%$ decrements until a collision-free dimension is discovered.
   - Returns the maximum safe expansion with clear explanatory feedback (e.g., *"Kitchen expanded by 14% to prevent colliding with Dining hall"*).

4. **Locked Room Invariants:**
   - Rooms flagged as locked (such as Covered Parking) are verified before and after the mutation. If their coordinates or dimensions shifted by even $0.1\text{ ft}$, the mutation is aborted.

5. **Atomic Transactions:**
   - Mutations are executed on an isolated clone of the plan. If any constraint fails, the transaction is discarded as `blocked` and the active design remains intact.

---

### Step 10: Automated Interior Furniture Staging

To help clients understand spatial proportions, the **Staging Engine** auto-populates rooms with scaled architectural furniture:

- **Master Bedroom:**
  - King-size bed ($6.5 \times 6.5\text{ ft}$) centered on the primary wall.
  - Flanking nightstands with lamps ($1.5\text{ ft}$ width).
  - Built-in wardrobe along side wall ($2.0\text{ ft}$ depth).
  - Wall-mounted TV console opposite the bed.
  - Perimeter area rug and indoor potted plant.
- **Secondary Bedrooms:**
  - Queen bed ($5.0 \times 6.5\text{ ft}$), nightstand, study desk with chair, and wardrobe.
- **Living Hall:**
  - L-shaped sectional sofa or 3-seater sofa set.
  - Central coffee table and accent armchair.
  - Media console unit along the opposing wall.
  - Large focal area rug.
- **Dining Room:**
  - 6-seater dining table with perimeter circulation clearance.
- **Kitchen:**
  - L-shaped counter run with integrated sink, cooking gas hob, and refrigerator alcove.
- **Bathrooms:**
  - Western toilet commode (WC), vanity counter with washbasin, and shower glass enclosure.

---

### Step 11: 3D Real-Time Massing & Virtual Walkthrough

Planova converts 2D floor plans into interactive 3D procedural environments using **Three.js** and **React Three Fiber**:

1. **Procedural Geometry Extrusion:**
   - Wall polygons are extruded upward to an architectural standard height of $2.4\text{ meters}$ ($\approx 8\text{ ft}$).
   - Door and window openings are cut out with accurate lintel headers ($1.9\text{ m}$) and window sills ($0.8\text{ m}$).

2. **Curated Architectural Materials:**
   - Vitrified flooring textures with subtle reflection.
   - Neutral plaster exterior and warm interior painted walls.
   - Tinted semi-transparent window glass panes and wood-textured door frames.

3. **Dynamic Atmospheric Lighting:**
   - **Daylight Mode:** Bright directional sun with realistic shadow mapping.
   - **Golden Hour Mode:** Warm, low-angle sunlight with soft ambient occlusion.
   - **Night Mode:** Interior ambient lighting highlighting room layouts.

4. **Viewing Perspectives:**
   - **Cutaway Dollhouse View:** Walls lowered to $3.5\text{ ft}$ to inspect internal room flow and furniture staging from above.
   - **Full Architectural Massing:** Full $8\text{ ft}$ walls showing true volume.
   - **First-Person Walkthrough (FPS Camera):** Allows clients to walk through front doors and room corridors at human eye level using keyboard (`WASD` / arrow keys) and mouse look.
   - **3D Multi-Floor Stacking:** Shows stacked stories or isolates individual floors.

---

### Step 12: Financial Costing & Bill of Quantities (BOQ) Engine

Designs must align with reality. The costing engine produces a real-time financial estimate and structural material takeoff:

1. **Built-Up Area Computation:**
   - Sums exact square footage across all floors including perimeter wall footprints.

2. **Quality Tier Pricing:**
   $$\text{Estimated Cost} = \text{Built-Up Area} \times \text{Rate per Sq.Ft}$$
   - *Economy:* ₹1,500 / sq.ft
   - *Standard:* ₹1,900 / sq.ft
   - *Premium:* ₹2,500 / sq.ft

3. **7-Category Cost Weight Breakdown:**
   - **Civil Structure & RCC Masonry (48%):** Excavation, foundation, RCC columns/slabs, brickwork, external plastering.
   - **Flooring & Wall Tiling (12%):** Vitrified floor tiles, granite kitchen counter, anti-skid bathroom tiles.
   - **Doors & Windows (10%):** Main teak door, internal flush doors, aluminium sliding windows.
   - **Electrical & Wiring (10%):** Concealed copper wiring, distribution boards, modular switches.
   - **Plumbing & Sanitaryware (9%):** CPVC water piping, drainage lines, sanitary fixtures (taps, WC, mixers).
   - **Painting & Surface Finishing (7%):** Wall putty, primer, interior emulsion, weather-guard exterior paint.
   - **Site Supervision & Miscellaneous (4%):** Site architectural compliance, contractor overhead, and cleanup.

4. **Engineering Bill of Quantities (BOQ):**
   - Automatically derives physical material requirements based on built-up volume:
     - **Cement:** $\text{Built-Up Area} \times 0.42\text{ bags (50kg)}$
     - **TMT Reinforcement Steel:** $(\text{Built-Up Area} \times 3.85) / 1000\text{ metric tonnes}$
     - **Red Clay Bricks / AAC Blocks:** $\text{Built-Up Area} \times 21.5\text{ units}$
     - **River Sand & 20mm Aggregates:** $\text{Built-Up Area} \times 1.8\text{ cubic feet (cft)}$
     - **Flooring Tiles:** $\text{Built-Up Area} \times 1.18\text{ sq.ft}$ (includes $18\%$ cutting wastage)
     - **Interior & Exterior Paint:** $\text{Built-Up Area} \times 0.18\text{ litres}$

5. **Budget Optimization Engine:**
   - If the project exceeds the client's budget, the system suggests actionable alternatives:
     - Switching finish quality from Premium to Standard (saving ₹600/sq.ft).
     - Compacting non-core circulation margins by $\approx 8\%$ while preserving core bedroom and kitchen sizes.

---

### Step 13: CAD DXF & Client Presentation Export

The final step bridges digital design with municipal sanctions and contractor handoff:

1. **AutoCAD Release 12 DXF Builder:**
   - Generates fully compliant, vector-based DXF CAD files readable by AutoCAD, Revit, SketchUp, and LibreCAD.
   - Geometry is organized into industry-standard CAD layers:
     - `WALLS`: Exterior perimeter and internal room partition lines.
     - `DOORS`: Door leaves and $90^\circ$ swing clearance arcs.
     - `WINDOWS`: Window frame sills and glazing lines.
     - `FURNITURE`: Outlines of staged interior furniture.
     - `ROOM_LABELS`: Room names, dimensions, and calculated square footage text.
     - `DIMENSIONS`: Exterior plot bounds and internal wall measurement strings.
     - `TITLE_BLOCK`: Professional border frame with project name, north arrow, and metadata.

2. **Client Presentation PDF:**
   - Clean, multi-page vector PDF containing:
     - Project metadata (Client name, site location, plot dimensions, road facing).
     - Full Architectural Room Schedule table (Room label, floor level, dimensions, usable area).
     - Financial breakdown by category and comparison against target budget.
     - Complete Bill of Quantities (BOQ) with unit rates and material specifications.

---

## 4. System Architecture & Lifecycle Matrix

| Phase | Input Data | Core Processing Engine | Key Output | Safety / Fallback Guard |
| :--- | :--- | :--- | :--- | :--- |
| **1. Brief Input** | Plot $W \times L$, facing, floors, room wishlist | `RoomCatalogBuilder` | Structured spatial brief | Default room dimensions fallback |
| **2. Feasibility** | Plot dimensions, BHK, parking count | `checkBriefFeasibility` | Utilization ratio & congestion tier | Blocks generation if ratio $> 135\%$ |
| **3. Setbacks** | Plot width, length, facing direction | `calculateSetbacks` | Usable building envelope (`usableW`, `usableL`) | Clamps setbacks to plot ratio bounds |
| **4. Floor Distribution** | Room list, floor count | `distributeRoomsAcrossFloors` | Floor-wise room segregation & staircase core | Guarantees vertical circulation core |
| **5. Concept Generation** | Envelope, distributed rooms, facing | `generateBalanced / Open / Vastu` | 3 distinct architectural options | Generates candidates & takes best score |
| **6. Fenestration** | Placed room walls, exterior bounds | `getWindowDimensionsForRoom` | Attached doors & windows | Sanitizes offsets to prevent corner overlap |
| **7. Validation & Scoring** | Generated floor plan | `validatePlan` & `scorePlan` | Hard pass/fail & 0–100 quality score | Rejects overlaps or out-of-bounds walls |
| **8. 2D Editing** | User drag/resize or AI text prompt | `MutationEngine` & `DesignEditService` | Updated floor plan or proposed mutation | 1ft-grid search; atomic rollback on failure |
| **9. Staging** | Room dimensions and room types | `StagingService` | Ergonomic furniture placement | Clearance buffers prevent door blockage |
| **10. 3D Scene** | 2D plan, wall heights, openings | `ThreeScene` & `WalkthroughController` | Interactive 3D scene & FPS walk | Fallback to 2D view if WebGL fails |
| **11. Costing & BOQ** | Built-up area, quality tier | `CostingService` & `BoqService` | Itemized estimate & material quantities | Clamps rate tiers to standard benchmarks |
| **12. CAD Export** | Complete plan geometry | `DxfBuilder` & `ExportService` | AutoCAD `.dxf` file & presentation `.pdf` | Standard ASCII R12 syntax compliance |

---

## 5. Summary of Why This Process Works

1. **No Blank Canvas Paralysis:** Users configure requirements and immediately receive 3 valid, fully realized architectural concepts.
2. **Deterministically Valid:** Geometric constraints (zero overlap, plot containment, positive dimensions) are enforced at every step, making invalid floor plans mathematically impossible.
3. **Culturally & Contextually Grounded:** Built from the ground up for Indian plot dimensions, NBC municipal setbacks, joint-family spatial hierarchies, and Vastu directional orientations.
4. **Seamless From Idea to Construction:** An unbroken pipeline linking user intent $\to$ 2D floor plans $\to$ 3D walkthroughs $\to$ contractor material BOQs $\to$ municipal CAD files.
