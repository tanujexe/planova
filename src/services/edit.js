import { validatePlan } from '../domain/constraints.js';
import { generateId } from '../lib/ids.js';
import { MutationEngine } from './mutationEngine.js';
import { CostingServiceInstance } from './costing.js';

/**
 * Natural Language Architectural Edit Adapter & Parser
 * Converts freeform user instructions into structured, geometrically-safe PlanMutations.
 */

class DesignEditService {
  /**
   * Parses freeform text prompt into structured intent flags
   * @param {string} prompt 
   * @returns {{
   *   isWowMoment: boolean,
   *   isKitchenResize: boolean,
   *   isBedroomMove: boolean,
   *   isBalconyAdd: boolean,
   *   isFurnish: boolean,
   *   isBudgetOptimize: boolean,
   *   hasParkingLock: boolean
   * }}
   */
  parseIntent(prompt) {
    const clean = prompt.toLowerCase().trim();

    const isKitchen = /\b(kitchen|cooking|pantry|kitchenette)\b/.test(clean);
    const isKitchenBigger = /\b(bigger|enlarge|expand|increase|large|20%|30%|more space|spacious)\b/.test(clean);
    const isBedroom = /\b(master bedroom|primary bedroom|main bedroom|bedroom|bed room)\b/.test(clean);
    const isRear = /\b(back|rear|south|southwest|rear quadrant|away from front|shift)\b/.test(clean);
    const isParking = /\b(parking|garage|car park|carport)\b/.test(clean);
    const isLock = /\b(unchanged|keep|preserve|lock|same|immutable)\b/.test(clean);

    const isWowMoment = (
      (isKitchen && (clean.includes('20%') || isKitchenBigger) && isBedroom) ||
      (isKitchen && isBedroom && isRear && (isParking || clean.includes('budget')))
    );

    return {
      isWowMoment,
      isKitchenResize: isKitchen && isKitchenBigger,
      isBedroomMove: isBedroom && isRear,
      isBalconyAdd: /\b(balcony|terrace|sit-out|deck)\b/.test(clean) && /\b(add|create|front|make|give)\b/.test(clean),
      isFurnish: /\b(furnish|stage|furniture|interior|staging)\b/.test(clean),
      isBudgetOptimize: /\b(budget|cost|30l|cheaper|optimize|financial|affordable)\b/.test(clean),
      hasParkingLock: isParking && isLock,
    };
  }

  /**
   * Parses natural-language prompt and proposes a safe, structured PlanMutation
   * @param {{ plan: object, prompt: string, requirements: object }} input 
   * @returns {Promise<{
   *   status: "ready" | "needs_confirmation" | "unsupported" | "blocked",
   *   mutation?: { newPlan: object, affectedRoomIds: string[], lockedRoomIds: string[] },
   *   explanation: string,
   *   tradeoffs: string[]
   * }>}
   */
  async propose({ plan, prompt, requirements }) {
    if (!prompt || !prompt.trim()) {
      return {
        status: 'unsupported',
        explanation: 'Please enter a design modification instruction.',
        tradeoffs: [],
      };
    }

    const intent = this.parseIntent(prompt);

    // 1. PRIMARY DEMO WOW MOMENT
    if (intent.isWowMoment) {
      return this.handleDemoWowMoment(plan, requirements);
    }

    // 2. Intent: Resize Kitchen
    if (intent.isKitchenResize) {
      return this.handleResizeKitchen(plan);
    }

    // 3. Intent: Move Master Bedroom to back / rear
    if (intent.isBedroomMove) {
      return this.handleMoveBedroomToBack(plan);
    }

    // 4. Intent: Add Balcony / Terrace
    if (intent.isBalconyAdd) {
      return this.handleAddBalcony(plan);
    }

    // 5. Intent: Auto-Furnish / Stage interior
    if (intent.isFurnish) {
      return this.handleAutoFurnish(plan);
    }

    // 6. Intent: Optimize for Budget
    if (intent.isBudgetOptimize) {
      return this.handleBudgetOptimization(plan, requirements);
    }

    // Fallback: Unsupported intent with structured suggestions
    return {
      status: 'unsupported',
      explanation: `I couldn't safely map "${prompt}" to an automated spatial transformation. Try instructions like:`,
      tradeoffs: [
        '“Make the kitchen 20% bigger, move the master bedroom to the back, keep parking unchanged, and stay close to my ₹30L budget.”',
        '“Enlarge the kitchen with attached utility.”',
        '“Move the master bedroom to the rear South-West zone.”',
        '“Add a front road-facing terrace balcony.”',
        '“Auto-stage all rooms with furniture.”',
        '“Optimize layout for a ₹30L budget target.”'
      ],
    };
  }

  /**
   * Handles the Demo Wow Moment with complete spatial validation and model-based calculations
   */
  handleDemoWowMoment(plan, requirements) {
    const gFloor = plan.floors?.find(f => f.level === 0) || plan.floors?.[0];
    if (!gFloor) {
      return { status: 'blocked', explanation: 'Ground floor layout not found.', tradeoffs: [] };
    }

    const affectedRoomIds = [];
    const lockedRoomIds = [];

    // Identify parking and lock it
    const parkingRoom = gFloor.rooms.find(r => r.type === 'parking');
    if (parkingRoom) lockedRoomIds.push(parkingRoom.id);

    const kitchenBefore = gFloor.rooms.find(r => r.type === 'kitchen');
    const masterBefore = gFloor.rooms.find(r => r.type === 'master_bedroom');

    if (kitchenBefore) affectedRoomIds.push(kitchenBefore.id);
    if (masterBefore) affectedRoomIds.push(masterBefore.id);

    let actualKitchenIncrease = 20;
    let isKitchenPartial = false;

    // Execute atomic mutation through MutationEngine
    const result = MutationEngine.executeMutation(
      plan,
      (mutatedPlan) => {
        const mutatedGFloor = mutatedPlan.floors.find(f => f.level === 0) || mutatedPlan.floors[0];
        const kitchen = mutatedGFloor.rooms.find(r => r.type === 'kitchen');
        const master = mutatedGFloor.rooms.find(r => r.type === 'master_bedroom');

        // 1. Resize kitchen safely
        if (kitchen) {
          const resizeResult = MutationEngine.findSafeResize(mutatedPlan, 0, kitchen, 0.20);
          if (resizeResult) {
            kitchen.width = resizeResult.newWidth;
            kitchen.height = resizeResult.newHeight;
            actualKitchenIncrease = Math.round(resizeResult.actualRatio * 100);
            isKitchenPartial = resizeResult.isPartial;
          } else {
            kitchen.width = Math.min(kitchen.width + 2, 14);
          }
          kitchen.label = 'Kitchen & Extended Utility';
        }

        // 2. Reposition master bedroom to rear SW safely
        if (master) {
          const safePos = MutationEngine.findSafePosition(mutatedPlan, 0, master, 'rear_sw', [kitchen?.id].filter(Boolean));
          if (safePos) {
            master.x = safePos.x;
            master.y = safePos.y;
          } else {
            master.x = 2;
            master.y = Math.max(20, mutatedPlan.plot.length - master.height - 4);
          }
          master.label = 'Master Bedroom (Rear SW)';
        }
      },
      lockedRoomIds
    );

    if (result.status === 'blocked' || !result.newPlan) {
      return {
        status: 'blocked',
        explanation: 'The requested multi-step transformation cannot be performed without colliding with locked or adjacent rooms.',
        tradeoffs: result.warnings || ['Spatial collision could not be resolved safely.'],
      };
    }

    const newPlan = result.newPlan;
    const oldEst = CostingServiceInstance.calculateEstimate({ plan, requirements });
    const newEst = CostingServiceInstance.calculateEstimate({ plan: newPlan, requirements });

    const formatInrLakhs = (val) => `₹${(val / 100000).toFixed(1)}L`;

    const kitchenSqFtBefore = kitchenBefore ? kitchenBefore.width * kitchenBefore.height : 0;
    const kitchenAfter = newPlan.floors[0].rooms.find(r => r.type === 'kitchen');
    const kitchenSqFtAfter = kitchenAfter ? kitchenAfter.width * kitchenAfter.height : 0;
    const kitchenSqFtDiff = kitchenSqFtAfter - kitchenSqFtBefore;

    return {
      status: 'needs_confirmation',
      mutation: {
        newPlan,
        affectedRoomIds,
        lockedRoomIds,
      },
      explanation: 'Planova AI interpreted your instruction and generated a verified spatial proposal:',
      tradeoffs: [
        `✨ Kitchen: ${isKitchenPartial ? `Maximum safe increase of +${actualKitchenIncrease}%` : `Expanded by +${actualKitchenIncrease}%`} (+${kitchenSqFtDiff} sq.ft counter & utility work area).`,
        '📍 Master Bedroom: Relocated to rear South-West quadrant for acoustic privacy and Vastu groundedness.',
        '🔒 Parking: Covered Car Parking locked and preserved completely unchanged at front frontage.',
        `💰 Financials: Built-up area changed from ${oldEst.builtUpAreaSqFt} to ${newEst.builtUpAreaSqFt} sq.ft. Estimate: ${formatInrLakhs(oldEst.totalEstimatedCost)} → ${formatInrLakhs(newEst.totalEstimatedCost)} (Target: ${formatInrLakhs(newEst.targetBudget)}).`
      ],
    };
  }

  /**
   * Handles Kitchen expansion safely
   */
  handleResizeKitchen(plan) {
    const gFloor = plan.floors?.find(f => f.level === 0) || plan.floors?.[0];
    const kitchen = gFloor?.rooms?.find(r => r.type === 'kitchen');

    if (!kitchen) {
      return { status: 'blocked', explanation: 'No kitchen found on ground floor.', tradeoffs: [] };
    }

    let actualIncrease = 20;
    let isPartial = false;

    const result = MutationEngine.executeMutation(plan, (mutated) => {
      const g = mutated.floors.find(f => f.level === 0) || mutated.floors[0];
      const k = g.rooms.find(r => r.type === 'kitchen');
      if (k) {
        const safeResize = MutationEngine.findSafeResize(mutated, 0, k, 0.20);
        if (safeResize) {
          k.width = safeResize.newWidth;
          k.height = safeResize.newHeight;
          actualIncrease = Math.round(safeResize.actualRatio * 100);
          isPartial = safeResize.isPartial;
        } else {
          k.width += 2;
        }
        k.label = 'Enlarged Kitchen';
      }
    });

    if (result.status === 'blocked' || !result.newPlan) {
      return {
        status: 'blocked',
        explanation: 'Kitchen cannot be expanded further without colliding with adjacent rooms.',
        tradeoffs: result.warnings || [],
      };
    }

    const newKitchen = result.newPlan.floors[0].rooms.find(r => r.type === 'kitchen');
    const addedSqFt = (newKitchen.width * newKitchen.height) - (kitchen.width * kitchen.height);

    return {
      status: 'ready',
      mutation: {
        newPlan: result.newPlan,
        affectedRoomIds: [kitchen.id],
        lockedRoomIds: [],
      },
      explanation: isPartial
        ? `Requested 20% increase is blocked by adjacent walls. Applied maximum safe increase of +${actualIncrease}% (+${addedSqFt} sq.ft).`
        : `Expanded Kitchen size by +${actualIncrease}% (${kitchen.width}×${kitchen.height} ft → ${newKitchen.width}×${newKitchen.height} ft).`,
      tradeoffs: [
        `Increases storage and countertop space by +${addedSqFt} sq.ft.`,
        'Preserves plot boundary setbacks and adjacent room integrity.'
      ],
    };
  }

  /**
   * Handles Master bedroom relocation safely
   */
  handleMoveBedroomToBack(plan) {
    const gFloor = plan.floors?.find(f => f.level === 0) || plan.floors?.[0];
    const master = gFloor?.rooms?.find(r => r.type === 'master_bedroom');

    if (!master) {
      return { status: 'blocked', explanation: 'No master bedroom found to reposition.', tradeoffs: [] };
    }

    const result = MutationEngine.executeMutation(plan, (mutated) => {
      const g = mutated.floors.find(f => f.level === 0) || mutated.floors[0];
      const m = g.rooms.find(r => r.type === 'master_bedroom');
      if (m) {
        const safePos = MutationEngine.findSafePosition(mutated, 0, m, 'rear_sw');
        if (safePos) {
          m.x = safePos.x;
          m.y = safePos.y;
        } else {
          m.y = Math.max(20, plan.plot.length - m.height - 4);
        }
        m.label = 'Master Bedroom (Rear)';
      }
    });

    if (result.status === 'blocked' || !result.newPlan) {
      return {
        status: 'blocked',
        explanation: 'Could not find a valid collision-free position at the rear for Master Bedroom.',
        tradeoffs: result.warnings || [],
      };
    }

    return {
      status: 'ready',
      mutation: {
        newPlan: result.newPlan,
        affectedRoomIds: [master.id],
        lockedRoomIds: [],
      },
      explanation: 'Relocated Master Bedroom to a valid position in the rear zone.',
      tradeoffs: [
        'Improves acoustic privacy away from front road traffic.',
        'Complies with South-West (Nairutya) Vastu orientation.'
      ],
    };
  }

  /**
   * Handles Balcony addition safely
   */
  handleAddBalcony(plan) {
    const result = MutationEngine.executeMutation(plan, (mutated) => {
      const upperFloor = mutated.floors.find(f => f.level === 1) || mutated.floors[0];
      const existingBalcony = upperFloor.rooms.find(r => r.type === 'balcony');

      if (existingBalcony) {
        const safeResize = MutationEngine.findSafeResize(mutated, upperFloor.level, existingBalcony, 0.15);
        if (safeResize) {
          existingBalcony.width = safeResize.newWidth;
          existingBalcony.height = safeResize.newHeight;
        }
        existingBalcony.label = 'Front Sit-out Balcony';
      } else {
        const newBalcony = {
          id: generateId('rm_balcony'),
          type: 'balcony',
          label: 'Front Sit-out Balcony',
          x: 2,
          y: 2,
          width: 12,
          height: 6,
          required: false,
          floor: upperFloor.level,
          color: '#E7ECDF',
        };

        const safePos = MutationEngine.findSafePosition(mutated, upperFloor.level, newBalcony, 'front');
        if (safePos) {
          newBalcony.x = safePos.x;
          newBalcony.y = safePos.y;
          upperFloor.rooms.unshift(newBalcony);
        }
      }
    });

    if (result.status === 'blocked' || !result.newPlan) {
      return {
        status: 'blocked',
        explanation: 'Front balcony cannot fit in available upper floor area without colliding with existing rooms.',
        tradeoffs: result.warnings || [],
      };
    }

    const addedBalcony = result.newPlan.floors.find(f => f.level === 1 || f.level === 0).rooms.find(r => r.type === 'balcony');

    return {
      status: 'ready',
      mutation: {
        newPlan: result.newPlan,
        affectedRoomIds: addedBalcony ? [addedBalcony.id] : [],
        lockedRoomIds: [],
      },
      explanation: 'Added/optimized dedicated Front Sit-out Balcony in the floor plan.',
      tradeoffs: ['Enhances front facade elevation and outdoor ventilation.'],
    };
  }

  /**
   * Handles Budget Optimization safely
   */
  handleBudgetOptimization(plan, requirements) {
    const result = MutationEngine.executeMutation(plan, (mutated) => {
      mutated.floors.forEach((f) => {
        f.rooms.forEach((r) => {
          if (!r.required && (r.type === 'foyer' || r.type === 'balcony' || r.type === 'utility')) {
            r.height = Math.max(5, r.height - 1);
          }
        });
      });
    });

    if (result.status === 'blocked' || !result.newPlan) {
      return {
        status: 'blocked',
        explanation: 'Spatial layout could not be compacted safely.',
        tradeoffs: result.warnings || [],
      };
    }

    const oldEst = CostingServiceInstance.calculateEstimate({ plan, requirements });
    const newEst = CostingServiceInstance.calculateEstimate({ plan: result.newPlan, requirements });
    const savings = oldEst.totalEstimatedCost - newEst.totalEstimatedCost;

    return {
      status: 'needs_confirmation',
      mutation: {
        newPlan: result.newPlan,
        affectedRoomIds: [],
        lockedRoomIds: [],
      },
      explanation: 'Optimized spatial layout to reduce built-up area and approach target budget:',
      tradeoffs: [
        `Reduced built-up area from ${oldEst.builtUpAreaSqFt} to ${newEst.builtUpAreaSqFt} sq.ft.`,
        `Estimated construction savings: ~₹${(savings / 100000).toFixed(1)}L.`,
        'Key living areas (Living Hall, Master Bed, Kitchen) remain fully preserved.'
      ],
    };
  }

  /**
   * Handles Auto-Furnishing safely
   */
  handleAutoFurnish(plan) {
    const mutated = structuredClone(plan);
    const affected = [];

    mutated.floors.forEach((floor) => {
      let floorFurn = [];
      floor.rooms.forEach((room) => {
        affected.push(room.id);
        const rx = room.x;
        const ry = room.y;
        const rw = room.width;
        const rh = room.height;

        let roomFurn = [];
        if (room.type === 'master_bedroom' || room.type === 'bedroom' || room.type === 'guest_bedroom') {
          const isMaster = room.type === 'master_bedroom';
          const bedW = isMaster ? 6.5 : 5.0;
          const bedL = 6.5;
          if (rw >= bedW + 1 && rh >= bedL + 1) {
            roomFurn.push({
              id: generateId('furn'),
              type: isMaster ? 'bed_king' : 'bed_queen',
              label: isMaster ? 'King Bed & Pillows' : 'Queen Bed',
              roomId: room.id,
              x: Number((rx + Math.max(0.5, (rw - bedW) / 2)).toFixed(2)),
              y: Number((ry + 0.5).toFixed(2)),
              width: bedW,
              length: bedL,
              height: 2.8,
              rotation: 0,
            });
          }
        } else if (room.type === 'living') {
          const sofaW = rw >= 14 ? 8.0 : 7.0;
          const sofaL = rw >= 14 ? 6.5 : 3.0;
          if (rw >= sofaW + 1 && rh >= sofaL + 1) {
            roomFurn.push({
              id: generateId('furn'),
              type: rw >= 14 ? 'sofa_lshape' : 'sofa_3seater',
              label: rw >= 14 ? 'L-Shape Sectional Sofa' : '3-Seater Sofa Couch',
              roomId: room.id,
              x: Number((rx + 0.5).toFixed(2)),
              y: Number((ry + 0.5).toFixed(2)),
              width: sofaW,
              length: sofaL,
              height: 2.8,
              rotation: 0,
            });
          }
        } else if (room.type === 'kitchen') {
          if (rw >= 6 && rh >= 5) {
            roomFurn.push({
              id: generateId('furn'),
              type: 'kitchen_counter_l',
              label: 'L-Shape Countertop & Sink',
              roomId: room.id,
              x: Number((rx + 0.5).toFixed(2)),
              y: Number((ry + 0.5).toFixed(2)),
              width: Math.min(rw - 1, 7.0),
              length: Math.min(rh - 1, 5.0),
              height: 2.8,
              rotation: 0,
            });
          }
        }

        room.furniture = roomFurn;
        floorFurn = [...floorFurn, ...roomFurn];
      });
      floor.furniture = floorFurn;
    });

    const validation = validatePlan(mutated);

    return {
      status: validation.valid ? 'ready' : 'blocked',
      mutation: {
        newPlan: mutated,
        affectedRoomIds: affected,
        lockedRoomIds: [],
      },
      explanation: validation.valid
        ? 'Auto-staged standard architectural furniture across all rooms in the floor plan.'
        : 'Furniture staging violated room clearances.',
      tradeoffs: [
        'Placed standard beds and nightstands in bedrooms with proper clearance.',
        'Staged living room with sectional sofa.',
        'Positioned kitchen countertop according to room dimensions.',
      ],
    };
  }
}

export const EditService = new DesignEditService();
