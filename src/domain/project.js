import { z } from 'zod';

export const CardinalDirectionSchema = z.enum(['north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest']);

export const UnitSchema = z.enum(['ft', 'm']);

export const SetbacksSchema = z.object({
  front: z.number().nonnegative().default(3),
  rear: z.number().nonnegative().default(3),
  left: z.number().nonnegative().default(2),
  right: z.number().nonnegative().default(2),
});

export const PlotSchema = z.object({
  width: z.number().positive('Plot width must be greater than 0'),
  length: z.number().positive('Plot length must be greater than 0'),
  unit: UnitSchema.default('ft'),
  floors: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  roadSide: CardinalDirectionSchema.default('north'),
  facing: CardinalDirectionSchema.default('north'),
  setbacks: SetbacksSchema.optional(),
});

export const RoomTypeSchema = z.enum([
  'living',
  'dining',
  'kitchen',
  'utility',
  'master_bedroom',
  'bedroom',
  'guest_bedroom',
  'bathroom',
  'attached_bathroom',
  'pooja',
  'study',
  'balcony',
  'terrace',
  'parking',
  'store',
  'servant',
  'foyer',
  'staircase',
  'corridor'
]);

export const RoomRequestSchema = z.object({
  type: RoomTypeSchema,
  count: z.number().int().positive().default(1),
  preferredSize: z.string().optional(),
});

export const RequirementsSchema = z.object({
  bhk: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).default(3),
  bathrooms: z.number().int().nonnegative().default(2),
  attachedBathrooms: z.number().int().nonnegative().default(1),
  rooms: z.array(RoomRequestSchema).default([]),
  parking: z.object({
    cars: z.number().int().nonnegative().default(1),
    twoWheelers: z.number().int().nonnegative().default(1),
  }).default({ cars: 1, twoWheelers: 1 }),
  ventilation: z.enum(['standard', 'high']).default('high'),
  vastu: z.enum(['off', 'basic', 'high']).default('basic'),
  budgetInr: z.number().positive().optional().default(3500000),
  quality: z.enum(['economy', 'standard', 'premium']).default('standard'),
});

export const RoomSchema = z.object({
  id: z.string(),
  type: RoomTypeSchema,
  label: z.string(),
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
  width: z.number().positive(),
  height: z.number().positive(),
  required: z.boolean().default(false),
  floor: z.number().int().nonnegative().default(0),
  color: z.string().optional(),
});

export const OpeningSchema = z.object({
  id: z.string(),
  type: z.enum(['door', 'window']),
  wallRoomId: z.string(),
  wallSide: z.enum(['top', 'bottom', 'left', 'right']).default('top'),
  offset: z.number().nonnegative(),
  width: z.number().positive().default(3),
});

export const PlanFloorSchema = z.object({
  level: z.number().int().nonnegative(),
  label: z.string(),
  rooms: z.array(RoomSchema),
  openings: z.array(OpeningSchema).default([]),
});

export const FloorPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  floors: z.array(PlanFloorSchema),
  plot: PlotSchema,
  notes: z.array(z.string()).default([]),
  vastuStatus: z.enum(['off', 'considered', 'tradeoff']).default('considered'),
  builtUpAreaSqFt: z.number().positive().optional(),
});

export const DesignOptionSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  concept: z.enum(['balanced', 'open_living', 'vastu_priority']),
  floorPlan: FloorPlanSchema.nullable().optional(),
  areaSqFt: z.number().positive(),
  roomCount: z.number().positive(),
  parkingSummary: z.string(),
  vastuNotes: z.string(),
  estimatedCostInr: z.number().positive(),
});

export const HistoryStateSchema = z.object({
  past: z.array(FloorPlanSchema).max(20).default([]),
  future: z.array(FloorPlanSchema).max(20).default([]),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  clientName: z.string().optional(),
  location: z.string().default('Bhopal, Madhya Pradesh'),
  plot: PlotSchema,
  requirements: RequirementsSchema,
  designOptions: z.array(DesignOptionSchema).default([]),
  selectedOptionId: z.string().optional(),
  design: FloorPlanSchema.optional(),
  history: HistoryStateSchema.default({ past: [], future: [] }),
  createdAt: z.string(),
  updatedAt: z.string(),
  version: z.literal(1).default(1),
});

/**
 * Validates and safely parses a project payload
 * @param {unknown} data 
 * @returns {z.SafeParseReturnType<any, z.infer<typeof ProjectSchema>>}
 */
export const validateProject = (data) => {
  return ProjectSchema.safeParse(data);
};
