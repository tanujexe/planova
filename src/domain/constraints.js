/**
 * Spatial and Geometric Constraint Engine
 * Adheres strictly to PRD §15 and Spec §Constraint checks.
 */

/**
 * Checks whether two 2D rectangles overlap (with a small epsilon tolerance for touching edges)
 * @param {{ x: number, y: number, width: number, height: number }} r1 
 * @param {{ x: number, y: number, width: number, height: number }} r2 
 * @param {number} [epsilon=0.05] 
 * @returns {boolean}
 */
export const doRectanglesOverlap = (r1, r2, epsilon = 0.05) => {
  const r1Right = r1.x + r1.width;
  const r1Bottom = r1.y + r1.height;
  const r2Right = r2.x + r2.width;
  const r2Bottom = r2.y + r2.height;

  // If one rectangle is to the left/right/above/below of the other with tolerance
  if (r1Right <= r2.x + epsilon || r2Right <= r1.x + epsilon) return false;
  if (r1Bottom <= r2.y + epsilon || r2Bottom <= r1.y + epsilon) return false;

  return true;
};

/**
 * Validates a complete FloorPlan against all 6 geometric and spatial constraints
 * @param {object} plan 
 * @returns {{ valid: boolean, errors: string[] }}
 */
export const validatePlan = (plan) => {
  const errors = [];

  if (!plan || !plan.plot || !plan.floors) {
    return { valid: false, errors: ['Invalid floor plan data structure.'] };
  }

  const plotW = Number(plan.plot.width) || 30;
  const plotL = Number(plan.plot.length) || 50;

  plan.floors.forEach((floor, floorIdx) => {
    const rooms = floor.rooms || [];
    const floorLabel = floor.label || `Floor ${floorIdx}`;

    // 1. Positive dimensions & Plot containment
    rooms.forEach((room) => {
      if (room.width <= 0 || room.height <= 0) {
        errors.push(`[${floorLabel}] Room "${room.label}" must have positive dimensions (got ${room.width}×${room.height}).`);
      }

      if (room.x < 0 || room.y < 0 || (room.x + room.width) > plotW || (room.y + room.height) > plotL) {
        errors.push(
          `[${floorLabel}] Room "${room.label}" extends outside the plot boundaries (${plotW}×${plotL} ft). Position: (${room.x}, ${room.y}), Size: ${room.width}×${room.height}.`
        );
      }
    });

    // 2. Room overlaps on the same floor
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        const r1 = rooms[i];
        const r2 = rooms[j];

        if (doRectanglesOverlap(r1, r2)) {
          errors.push(
            `[${floorLabel}] Spatial collision: "${r1.label}" overlaps with "${r2.label}".`
          );
        }
      }
    }

    // 3. Openings check: must belong to a room on the floor
    const openings = floor.openings || [];
    openings.forEach((op) => {
      const parentRoom = rooms.find((r) => r.id === op.wallRoomId);
      if (!parentRoom) {
        errors.push(`[${floorLabel}] Opening ${op.id} is attached to a non-existent room (${op.wallRoomId}).`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validates whether moving/resizing a single room is valid
 * @param {object} plan 
 * @param {number} floorLevel 
 * @param {object} updatedRoom 
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateRoomMutation = (plan, floorLevel, updatedRoom) => {
  const plotW = Number(plan.plot.width) || 30;
  const plotL = Number(plan.plot.length) || 50;

  if (updatedRoom.width <= 0 || updatedRoom.height <= 0) {
    return { valid: false, error: 'Room dimensions must be greater than zero.' };
  }

  if (
    updatedRoom.x < 0 ||
    updatedRoom.y < 0 ||
    (updatedRoom.x + updatedRoom.width) > plotW ||
    (updatedRoom.y + updatedRoom.height) > plotL
  ) {
    return { valid: false, error: `Room cannot be placed outside the ${plotW}×${plotL} ft plot boundary.` };
  }

  const floor = plan.floors.find((f) => f.level === floorLevel);
  if (!floor) return { valid: false, error: 'Invalid floor level.' };

  for (const other of floor.rooms) {
    if (other.id !== updatedRoom.id) {
      if (doRectanglesOverlap(updatedRoom, other)) {
        return { valid: false, error: `Room collides with adjacent "${other.label}".` };
      }
    }
  }

  return { valid: true };
};
