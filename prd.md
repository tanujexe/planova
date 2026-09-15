# AI Home Design & Construction Copilot Drafted

India-Centric MVP Product Requirements Document

Version 1.0 • Frontend-First MVP

Core promise

“Describe your plot and requirements. Drafted helps you design, refine, visualize and

estimate your Indian home.”


## 1. Product Overview

Drafted is an AI-powered home design platform focused initially on the Indian residential market. It converts Plot Details + Client Requirements into Floor Plan AI Design Options 2D/3D Visualization Approximate Cost Preliminary BOQ.

The MVP is frontend-first. Backend and AI APIs may be mocked or simulated, but the user experience must feel complete and seamless.

Drafted is an AI copilot, not an architect replacement. Final construction and approval decisions remain with qualified professionals.

## 2. MVP Goal

Prove that an Indian homeowner, architect, or designer can move from a real-world plot description to a convincing editable home concept in minutes instead of repeatedly creating layouts manually.

Example: “30×50 ft plot in Bhopal, north-facing, 3BHK, car parking, pooja room, balcony, good ventilation, Vastu preference, budget ■35L.”

## 3. India-Centric Product Context

Indian residential design has requirements that generic global AI floor-plan tools often do not prioritize.

- Plot-first workflow using common Indian plot dimensions such as 20×40, 30×50, 40×60 ft.

- Road side and plot orientation, including north/east/south/west-facing plots.

- Optional Vastu preferences without presenting them as engineering or legal guarantees.

- Indian room patterns: 1BHK, 2BHK, 3BHK, 4BHK, pooja room, utility, balcony, parking, servant/store space.

- Indian construction budgeting using and rate-per-square-foot estimates.

- Ground + 1 / Ground + 2 style residential projects.

- Indian climate considerations such as ventilation, daylight, shading and heat.

- Local context field so future versions can add city-specific rules, costs and practices.

- Professional review language: AI output is a concept and should be reviewed by a licensed architect/engineer before construction.

## 4. Target Users

## Primary: Indian Residential Architects / Designers

- Create projects from client requirements

- Generate multiple concepts

- Quickly iterate on layouts

- Present 2D/3D concepts to clients

- Estimate approximate cost

- Generate preliminary BOQ

## Secondary: Homeowners

- Describe their plot and dream home

- Explore layouts before meeting an architect

- Understand approximate space and budget


- Share concepts with family or professionals

Future: Small Builders

Builders can later use Drafted for repeatable residential planning, client presentations, costing and project workflows.

## 5. Core User Journey

Landing Create Project Plot Details Indian Requirements Generate 3 Design Options Select 2D Workspace Natural-Language Edit 3D Cost BOQ Review Export

The complete flow must work even if the underlying AI/backend is simulated.

## 6. Landing Page

- Clear India-focused value proposition

- Create Your First Design CTA

- Example Indian residential floor plan

- Capabilities: AI Floor Plans, Smart Iteration, 3D, Cost Estimation

- Short disclaimer that designs are conceptual and require professional validation

## 7. Project Creation

- Project name

- Client name (optional)

- City / location

- Plot length and width

- Unit: feet / meters

- Number of floors

- Road side

- Plot facing/orientation

- Optional plot setbacks

Example: Sharma Residence, Bhopal, 30×50 ft, Ground + 1, North road, North-facing.

Validation: dimensions must be positive; project name is required; unsupported or unrealistic values should produce clear inline messages. Leaving with unsaved changes requires confirmation.

## 8. Indian Requirements Builder

The requirement builder should feel natural for Indian residential projects.

- BHK selector: 1 / 2 / 3 / 4 BHK

- Bathrooms and attached bathrooms

- Living room and dining

- Kitchen and utility

- Pooja room

- Study / work room

- Balcony / terrace

- Car and two-wheeler parking


- Store / servant room where needed

- Preferred room sizes

- Natural light and cross-ventilation preference

- Vastu preference: Off / Basic / High

- Budget in INR

## 9. Indian Plot & Vastu Preferences

Vastu should be treated as a user preference layer, not as scientific or regulatory truth.

The UI may allow preferences such as kitchen direction, pooja room preference, bedroom placement, entrance preference and open-space preference.

If a request conflicts with another requirement, explain the trade-off rather than silently changing the design.

Example: “Your preferred kitchen direction conflicts with the current layout. We can prioritize Vastu preference or preserve the larger living area.”

## 10. Requirement Validation

Before generation, validate basic feasibility.

Example: 25×40 ft plot + 5 bedrooms + 3 cars. Show a warning rather than producing a magically perfect plan.

Actions: Edit Requirements or Generate Best Possible Layout.

For MVP, this is heuristic validation, not complete municipal bylaw validation.

## 11. AI Design Generation

CTA: Generate Designs.

Show meaningful stages: analyzing plot understanding Indian requirements planning rooms checking basic spatial constraints optimizing layout generating options preparing visualization.

On failure, preserve all requirements and provide Try Again and Edit Requirements.

## 12. Design Options

Generate three concepts.

- Floor plan preview

- BHK and room count

- Approximate usable/built-up area

- Parking

- Key design characteristic

- Vastu preference status

- Approximate construction cost

Example options: Balanced Layout, Open Living, Vastu Priority.

## 13. Design Workspace

Core MVP screen.

- Left: rooms/tools

- Center: editable floor plan


- Right: design details + AI assistant

- Top: project name, undo, redo, 2D, 3D, save, export

## 14. 2D Floor Plan

- Plot boundary

- External/internal walls

- Rooms and room names

- Doors and windows

- Approximate dimensions

- Parking area

- Basic circulation

The MVP does not claim construction-grade CAD accuracy. It should look believable, structured and editable.

## 15. Basic Spatial Constraints

- Rooms stay inside plot boundary

- Rooms cannot overlap

- Room dimensions remain positive

- Required rooms are protected from accidental deletion

- Parking stays inside the plot

- Doors/windows remain attached to walls

- Basic circulation is preserved where possible

Full structural, fire, accessibility, municipal and sanction-plan compliance are outside MVP.

## 16. Natural-Language Editing

This is the primary differentiator.

- “Make the kitchen 20% bigger.”

- “Move the master bedroom to the back.”

- “Add a balcony.”

• “Keep parking unchanged and make the living room larger.”

- “Optimize this design for a ■30L budget.”

The system should interpret the request, update the structured layout, highlight the affected area and explain the result.

## 17. AI Edit Safety

If a requested change cannot be completed without breaking important constraints, the system should say so and offer alternatives.

Example: “I can enlarge the kitchen, but doing so will reduce dining space. Would you like me to proceed?”

During processing, keep the previous design visible. On failure, preserve the previous version.

## 18. Undo / Redo


Every meaningful modification supports Undo and Redo. AI changes should never permanently destroy the previous layout.

## 19. 2D / 3D

The same underlying design powers both views. Changes made in the 2D plan should reflect in 3D.

3D is conceptual and may show walls, floors, doors, windows, basic furniture and exterior massing. Rotate, zoom and pan should work.

## 20. Indian Cost Estimation

Cost is shown in INR and is explicitly approximate.

Inputs may include built-up area, floors, location, construction quality and indicative ■/sq.ft.

Example: 1,450 sq.ft. × ■1,900/sq.ft. ■27.55L.

Breakdown: civil construction, flooring, electrical, plumbing, doors/windows, painting and miscellaneous.

Disclaimer: “Indicative estimate only. Actual cost varies by city, contractor, material, design, specifications and site conditions.”

## 21. Budget Optimization

If estimated cost exceeds the user's budget, show the gap.

Example: “Estimated ■36L, target ■30L. Approximately ■6L above target.”

Actions: Optimize for Budget or Continue Anyway.

Possible suggestions: reduce built-up area, simplify layout, optimize room sizes, reduce balcony area, or adjust finish quality.

## 22. Preliminary BOQ

The MVP provides a simplified BOQ for understanding, not procurement.

- Cement

- Steel

- Bricks / blocks

- Flooring

- Paint

- Doors

- Windows

- Electrical

- Plumbing

Each item shows approximate quantity, unit and estimated cost. Clearly label it “Preliminary AI Estimate.”

## 23. Export & Sharing

Export: floor plan image, PDF summary and cost summary.

PDF includes project name, location, plot, requirements, selected plan, room list, area, estimate, BOQ summary and disclaimer.

The user should be able to share the output with a family member, architect or builder.


## 24. Save & Persistence

Frontend-first MVP can use browser/local persistence.

- Project information

- Requirements

- Generated options

- Selected design

- Design edits

- Cost

- BOQ

Refresh should not erase the current project. Empty dashboard should provide a clear Create Project CTA.

## 25. Dashboard

Project cards show project name, city, plot size, status, thumbnail and last updated.

Actions: Open, Duplicate, Rename, Delete.

Delete requires confirmation and should never happen accidentally.

## 26. Edge Cases

- No projects onboarding/empty state.

- Invalid dimensions inline validation.

- Impossible room combination feasibility warning.

- AI generation failure retry without losing inputs.

- AI edit failure previous design remains unchanged.

- Empty AI prompt do not submit.

- Repeated generation/edit click prevent duplicate actions.

- Refresh restore saved project.

- Back navigation with unsaved changes confirmation.

- Room outside plot prevent action.

- Room overlap reject or resolve before final state.

- Delete required room confirmation.

- Cost unavailable design remains usable.

- 3D unavailable continue in 2D.

- Export failure retry without losing project.

- Budget exceeded clear warning and optimization option.

## 27. Loading & Error Experience

Loading should explain the current operation instead of showing a generic spinner.

Examples: “Analyzing plot dimensions…”, “Planning room relationships…”, “Checking spatial constraints…”, “Building your 3D model…”, “Estimating construction quantities…”

Errors should be human-readable and recoverable. Avoid exposing technical errors such as HTTP status codes.


## 28. Demo Project

Include a ready-to-use Indian demo project.

Sharma Residence • Bhopal • 30×50 ft • North-facing • Ground + 1 • 3 BHK • 2 bathrooms • pooja room • kitchen • dining • balcony • one-car parking • ventilation preference • basic Vastu preference • ■35L target.

This lets the class/demo flow start immediately without entering every field.

## 29. Frontend-First AI Simulation

For the MVP, AI generation and edits can be simulated using predefined structured layouts and deterministic interactions.

The experience should still show the same states as the intended real system: request processing interpretation updated design explanation.

The architecture should keep the AI layer replaceable later.

## 30. Structured Design Representation

The floor plan should be stored as structured geometry/data, not only as an image. This enables editing, validation, 3D, costing and BOQ from the same source.

```
Project
Plot (size, orientation, road, location)
Requirements (BHK, rooms, preferences, budget)
Rooms (position, width, height, area, type)
Doors / Windows
Floors
Cost
BOQ
```

## 31. Navigation

Main: Dashboard, Projects, New Project.

Project: Overview, Requirements, Design, 3D, Cost, BOQ, Export.

Users should be able to move between sections without losing progress.

## 32. MVP Design Principles

- Premium and professional

- Architecture-first rather than generic AI dashboard

- Indian residential context

- Minimal and focused UI

- Useful animations only

- Clear hierarchy and large visual floor-plan area

Avoid excessive gradients, unnecessary cards, fake complexity, or over-animated interfaces.

## 33. MVP Success Criteria

A new user should be able to create a project, enter an Indian plot, specify BHK/rooms/preferences/budget, generate three layouts, select one, modify it, use natural-language editing, view 3D, see approximate INR cost, view preliminary BOQ and export the result without outside explanation.

## 34. Explicit Non-Goals


- Full BIM

- Structural engineering

- MEP engineering

- Government approval automation

- Construction-grade CAD

- Complete India-wide municipal bylaws

- Certified Vastu claims

- Contractor/material marketplace

- Payment system

- Architect marketplace

- Mobile app

- Own foundation model

- Real-time collaboration

- Construction certification

These belong to later phases.

## 35. MVP Wow Moment

User types:

“Make the kitchen 20% bigger and move the master bedroom to the back while keeping

the parking unchanged and staying close to my ■30L budget.”

Drafted processes the instruction and updates the structured design.

This proves Drafted is more than an AI image generator. It is an AI copilot that understands spatial relationships, Indian requirements and budget trade-offs.

## 36. Product Boundary

Prioritize Experience > Backend complexity, Structured design > AI image generation, Seamless workflow > feature count, and believable Indian use cases > generic global demos.

Every MVP feature should support: Plot Indian Requirements Design Edit Visualize Cost BOQ Export.

## 37. Final MVP Definition

Drafted MVP is a frontend-first, India-centric AI home design workspace where users can enter plot and residential requirements, generate multiple layouts, select and modify a structured design through visual and natural-language controls, view it in 2D/3D, understand approximate INR construction cost and a preliminary BOQ, and export the result.

The MVP should feel like a real product even when the AI/backend is initially simulated.

“From Indian plot to editable home design in minutes.”
