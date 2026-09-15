# Build Notes

## Spec decisions — 2026-09-15

- The MVP is frontend-first: local browser persistence, deterministic layout generation, and a replaceable AI adapter keep the full product journey demoable without backend or API-key risk.
- The structured `FloorPlan` model is the single source of truth for the 2D canvas, conceptual 3D view, cost estimate, BOQ, exports, and history.
- React/TypeScript with Konva for 2D editing and React Three Fiber for a deliberately simple 3D view is the proposed stack.
- Vastu, costing, and BOQ are preference/indicative features only; the product must surface trade-offs and professional-review disclaimers.
- Guided interview/deepening rounds: skipped at the participant’s request. The specification records explicit MVP assumptions to keep the build unblocked.

## Checklist decisions — 2026-09-15

- Planning was handed off directly from the PRD and technical spec; no co-design or deepening round was requested.
- Build mode is autonomous with no user review pauses, while each task retains an explicit automated or manual verification checkpoint.
- The checklist has 12 sequential items, including a final Devpost handoff task; commit points follow tasks 2, 5, 8, and 11.
- The primary submission/demo moment is the safe natural-language kitchen/bedroom edit under a ₹30L budget constraint.
