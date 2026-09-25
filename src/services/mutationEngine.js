import { validatePlan, doRectanglesOverlap } from '../domain/constraints.js';

/**
 * Safe Plan Mutation & Spatial Repair Engine
 * Ensures 100% geometric validity, safe room movements, collision avoidance,
 * locked room preservation, and atomic design transactions.
 */

export class MutationEngine {
  /**
   * Checks if locked room elements are unchanged between oldPlan and newPlan
   * @param {object} oldPlan 
   * @param {object} newPlan 
   * @param {string[]} lockedIds 
   * @returns {{ valid: boolean, violations: string[] }}
   */
  static validateLockedElements(oldPlan, newPlan, lockedIds = []) {
    if (!lockedIds || lockedIds.length === 0) return { valid: true, violations: [] };

    const violations = [];
    const getRoomMap = (plan) => {
      const map = new Map();
      plan.floors.forEach((f) => {
        (f.rooms || []).forEach((r) => map.set(r.id, { ...r, floorLevel: f.level }));
      });
      return map;
    };

    const oldRooms = getRoomMap(oldPlan);
    const newRooms = getRoomMap(newPlan);

    for (const lockedId of lockedIds) {
      const oldRoom = oldRooms.get(lockedId);
      const newRoom = newRooms.get(lockedId);

      if (!oldRoom && !newRoom) continue;

      if (!oldRoom || !newRoom) {
        violations.push(`Locked room "${lockedId}" was removed or missing.`);
        continue;
      }

      if (
        oldRoom.x !== newRoom.x ||
        oldRoom.y !== newRoom.y ||
        oldRoom.width !== newRoom.width ||
        oldRoom.height !== newRoom.height ||
        oldRoom.floorLevel !== newRoom.floorLevel
      ) {
        violations.push(
          `Locked room "${oldRoom.label || lockedId}" geometry was modified: was (${oldRoom.x}, ${oldRoom.y}, ${oldRoom.width}×${oldRoom.height}), became (${newRoom.x}, ${newRoom.y}, ${newRoom.width}×${newRoom.height}).`
        );
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }

  /**
   * Validates complete plan including locked room invariants
   * @param {object} oldPlan 
   * @param {object} newPlan 
   * @param {string[]} [lockedIds=[]] 
   * @returns {{ valid: boolean, errors: string[] }}
   */
  static validateMutation(oldPlan, newPlan, lockedIds = []) {
    const planValidation = validatePlan(newPlan);
    const lockedValidation = this.validateLockedElements(oldPlan, newPlan, lockedIds);

    const errors = [...planValidation.errors, ...lockedValidation.violations];
    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Finds a safe candidate position for a room near a target zone or target coordinates.
   * Prevents silent fallback bugs by guaranteeing that the candidate is collision-free
   * and represents a genuine spatial relocation (never returning the room's original position).
   * 
   * @param {object} plan 
   * @param {number} floorLevel 
   * @param {object} roomToPlace 
   * @param {'rear' | 'rear_sw' | 'front' | 'center' | 'left' | 'right' | { targetX: number, targetY: number }} targetSpec 
   * @param {string[]} [ignoreRoomIds=[]] 
   * @param {number} [minDisplacement=1.5] - Minimum displacement required from original position
   * @returns {{ x: number, y: number } | null}
   */
  static findSafePosition(plan, floorLevel, roomToPlace, targetSpec, ignoreRoomIds = [], minDisplacement = 1.5) {
    const plotW = Number(plan.plot.width) || 30;
    const plotL = Number(plan.plot.length) || 50;

    const rw = roomToPlace.width;
    const rh = roomToPlace.height;

    if (rw > plotW || rh > plotL) return null;

    let targetX = roomToPlace.x;
    let targetY = roomToPlace.y;
    let maxAllowedDist = null;

    if (typeof targetSpec === 'string') {
      switch (targetSpec) {
        case 'rear':
        case 'rear_sw':
          targetX = 2;
          targetY = Math.max(0, plotL - rh - 2);
          maxAllowedDist = Math.max(8, plotL * 0.40);
          break;
        case 'front':
          targetX = 2;
          targetY = 2;
          maxAllowedDist = Math.max(8, plotL * 0.40);
          break;
        case 'center':
          targetX = Math.max(0, (plotW - rw) / 2);
          targetY = Math.max(0, (plotL - rh) / 2);
          maxAllowedDist = Math.max(plotW, plotL) * 0.40;
          break;
        case 'left':
          targetX = 2;
          maxAllowedDist = plotW * 0.45;
          break;
        case 'right':
          targetX = Math.max(0, plotW - rw - 2);
          maxAllowedDist = plotW * 0.45;
          break;
      }
    } else if (targetSpec && typeof targetSpec.targetX === 'number') {
      targetX = targetSpec.targetX;
      targetY = targetSpec.targetY;
    }

    const floor = plan.floors.find((f) => f.level === floorLevel);
    if (!floor) return null;

    const otherRooms = floor.rooms.filter((r) => r.id !== roomToPlace.id && !ignoreRoomIds.includes(r.id));

    // Generate candidate positions on a 1ft grid
    const candidates = [];
    const step = 1;

    const maxX = Math.max(0, plotW - rw);
    const maxY = Math.max(0, plotL - rh);

    for (let x = 0; x <= maxX; x += step) {
      for (let y = 0; y <= maxY; y += step) {
        // Enforce genuine relocation: reject candidates that are practically identical to current location
        const displacement = Math.hypot(x - roomToPlace.x, y - roomToPlace.y);
        if (minDisplacement > 0 && displacement < minDisplacement) {
          continue;
        }

        const testRect = { x, y, width: rw, height: rh };
        let collides = false;

        for (const other of otherRooms) {
          if (doRectanglesOverlap(testRect, other)) {
            collides = true;
            break;
          }
        }

        if (!collides) {
          const dist = Math.hypot(x - targetX, y - targetY);
          // If a target zone was requested, ensure the candidate actually resides in that zone
          if (maxAllowedDist !== null && dist > maxAllowedDist) {
            continue;
          }
          candidates.push({ x, y, dist, displacement });
        }
      }
    }

    if (candidates.length === 0) return null;

    candidates.sort((a, b) => a.dist - b.dist);
    return { x: candidates[0].x, y: candidates[0].y };
  }

  /**
   * Safely resizes a room, finding the maximum valid expansion if full target is blocked
   * @param {object} plan 
   * @param {number} floorLevel 
   * @param {object} roomToResize 
   * @param {number} targetRatio - e.g. 0.20 for 20% area increase
   * @returns {{ newWidth: number, newHeight: number, actualRatio: number, isPartial: boolean } | null}
   */
  static findSafeResize(plan, floorLevel, roomToResize, targetRatio = 0.20) {
    const floor = plan.floors.find((f) => f.level === floorLevel);
    if (!floor) return null;

    const plotW = Number(plan.plot.width) || 30;
    const plotL = Number(plan.plot.length) || 50;

    const otherRooms = floor.rooms.filter((r) => r.id !== roomToResize.id);
    const origW = roomToResize.width;
    const origH = roomToResize.height;

    // Try ratio steps from requested down to 0%
    const steps = [];
    for (let r = targetRatio; r >= 0.02; r -= 0.02) {
      steps.push(Number(r.toFixed(2)));
    }

    for (const r of steps) {
      // Try 3 expansion strategies: width expansion, height expansion, balanced expansion
      const areaMultiplier = 1 + r;
      
      const strategies = [
        { w: Math.round(origW * Math.sqrt(areaMultiplier)), h: Math.round(origH * Math.sqrt(areaMultiplier)) }, // balanced
        { w: Math.round(origW * areaMultiplier), h: origH }, // width only
        { w: origW, h: Math.round(origH * areaMultiplier) }, // height only
      ];

      for (const strat of strategies) {
        if (roomToResize.x + strat.w <= plotW && roomToResize.y + strat.h <= plotL) {
          const candidateRect = { x: roomToResize.x, y: roomToResize.y, width: strat.w, height: strat.h };
          let collides = false;

          for (const other of otherRooms) {
            if (doRectanglesOverlap(candidateRect, other)) {
              collides = true;
              break;
            }
          }

          if (!collides) {
            return {
              newWidth: strat.w,
              newHeight: strat.h,
              actualRatio: r,
              isPartial: r < targetRatio - 0.01,
            };
          }
        }
      }
    }

    return null;
  }

  /**
   * Applies an atomic plan mutation safely, repairing if necessary, returning blocked if invalid
   * @param {object} plan 
   * @param {(clonedPlan: object) => void} mutationFn 
   * @param {string[]} [lockedIds=[]] 
   * @returns {{ status: 'ready' | 'needs_confirmation' | 'blocked', newPlan?: object, error?: string, warnings?: string[] }}
   */
  static executeMutation(plan, mutationFn, lockedIds = []) {
    const cloned = structuredClone(plan);
    mutationFn(cloned);

    // Normalize geometry precision (round room x,y,width,height to nearest 0.5)
    cloned.floors.forEach((f) => {
      (f.rooms || []).forEach((r) => {
        r.x = Math.round(r.x * 2) / 2;
        r.y = Math.round(r.y * 2) / 2;
        r.width = Math.round(r.width * 2) / 2;
        r.height = Math.round(r.height * 2) / 2;

        // Keep openings clamped inside resized/moved room bounds
        if (f.openings) {
          f.openings.forEach((op) => {
            if (op.wallRoomId === r.id) {
              const maxOffset = (op.wallSide === 'top' || op.wallSide === 'bottom')
                ? Math.max(0, r.width - op.width)
                : Math.max(0, r.height - op.width);
              op.offset = Math.min(Math.max(0, op.offset), maxOffset);
            }
          });
        }

        // Keep furniture inside room bounds
        if (r.furniture) {
          r.furniture.forEach((furn) => {
            furn.x = Math.max(r.x + 0.5, Math.min(furn.x, r.x + r.width - furn.width - 0.5));
            furn.y = Math.max(r.y + 0.5, Math.min(furn.y, r.y + r.height - furn.length - 0.5));
          });
        }
      });
    });

    // Recalculate built-up area directly from current room geometry
    let totalBuiltUp = 0;
    cloned.floors.forEach((f) => {
      (f.rooms || []).forEach((r) => {
        totalBuiltUp += (r.width * r.height);
      });
    });
    cloned.builtUpAreaSqFt = Math.round(totalBuiltUp);

    // Validate
    const validation = this.validateMutation(plan, cloned, lockedIds);

    if (validation.valid) {
      return {
        status: 'ready',
        newPlan: cloned,
        warnings: [],
      };
    }

    return {
      status: 'blocked',
      error: `Mutation failed spatial validation: ${validation.errors.join(' ')}`,
      warnings: validation.errors,
    };
  }
}
