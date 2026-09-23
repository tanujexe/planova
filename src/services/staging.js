/**
 * Architectural Auto-Staging Service
 * Automatically places furniture presets into room geometries based on room types, clearance envelopes, and Indian spatial zoning.
 */

import { generateId } from '../lib/ids.js';
import { getFurnitureDefinition } from '../domain/furnitureCatalog.js';

class StagingService {
  /**
   * Generates optimal furniture layout for a single room
   * @param {object} room 
   * @returns {Array<object>} Array of furniture placement instances
   */
  furnishRoom(room) {
    const furniture = [];
    const rx = room.x;
    const ry = room.y;
    const rw = room.width;
    const rh = room.height;

    const createItem = (type, relX, relY, rotation = 0) => {
      const def = getFurnitureDefinition(type);
      if (!def) return null;
      return {
        id: generateId('furn'),
        type,
        label: def.label,
        roomId: room.id,
        x: Number((rx + relX).toFixed(2)),
        y: Number((ry + relY).toFixed(2)),
        width: def.width,
        length: def.length,
        height: def.height,
        rotation, // 0, 90, 180, 270
      };
    };

    switch (room.type) {
      case 'master_bedroom': {
        // Bed Perimeter Area Rug
        if (rw >= 10 && rh >= 11) {
          const rug = createItem('rug_bedroom', Math.max(0.5, (rw - 7.5) / 2), 1.0, 0);
          if (rug) furniture.push(rug);
        }

        // King Bed centered on top wall
        const bedW = 6.5;
        const bedL = 6.5;
        const bedX = Math.max(1, (rw - bedW) / 2);
        const bedY = 0.6;
        const bed = createItem('bed_king', bedX, bedY, 0);
        if (bed) furniture.push(bed);

        // Flanking nightstands with lamps
        if (rw >= 10) {
          const nsL = createItem('nightstand', Math.max(0.2, bedX - 1.8), bedY, 0);
          const nsR = createItem('nightstand', Math.min(rw - 1.7, bedX + bedW + 0.3), bedY, 0);
          if (nsL) furniture.push(nsL);
          if (nsR) furniture.push(nsR);
        }

        // Wardrobe along side wall
        if (rh >= 11) {
          const wItem = createItem('wardrobe', 0.5, Math.max(0.5, rh - 2.5), 0);
          if (wItem) furniture.push(wItem);
        }

        // TV Console along bottom wall opposite bed
        if (rh >= 10 && rw >= 8) {
          const tv = createItem('tv_unit', Math.max(1, (rw - 5.5) / 2), rh - 1.8, 0);
          if (tv) furniture.push(tv);
        }

        // Corner potted plant
        if (rw >= 12 && rh >= 11) {
          const plant = createItem('plant_pot', rw - 2.2, rh - 2.2, 0);
          if (plant) furniture.push(plant);
        }
        break;
      }

      case 'bedroom':
      case 'guest_bedroom': {
        // Bedroom Rug
        if (rw >= 9 && rh >= 10) {
          const rug = createItem('rug_bedroom', Math.max(0.5, (rw - 7.0) / 2), 0.8, 0);
          if (rug) furniture.push(rug);
        }

        const bedW = 5.0;
        const bedL = 6.5;
        const bedX = Math.max(0.8, (rw - bedW) / 2);
        const bedY = 0.5;
        const bed = createItem('bed_queen', bedX, bedY, 0);
        if (bed) furniture.push(bed);

        if (rw >= 8.5) {
          const ns = createItem('nightstand', Math.max(0.2, bedX - 1.7), bedY, 0);
          if (ns) furniture.push(ns);
        }

        if (rh >= 10) {
          const desk = createItem('study_desk', rw - 4.5, rh - 2.5, 0);
          if (desk) furniture.push(desk);
        }

        if (rw >= 11 && rh >= 10) {
          const wardrobe = createItem('wardrobe', 0.5, rh - 2.5, 0);
          if (wardrobe) furniture.push(wardrobe);
        }
        break;
      }

      case 'living': {
        // Living Lounge Zone
        if (rw >= 14 && rh >= 12) {
          // Large Area Rug
          const rug = createItem('rug_area', Math.max(0.8, (rw - 9.0) / 2), 1.0, 0);
          if (rug) furniture.push(rug);

          // L-Shape Sectional
          const sofa = createItem('sofa_lshape', 1.0, 1.2, 0);
          if (sofa) furniture.push(sofa);

          // Central Coffee Table
          const table = createItem('coffee_table', 3.5, 3.2, 0);
          if (table) furniture.push(table);

          // Accent Armchair
          if (rw >= 15) {
            const chair = createItem('armchair', rw - 3.2, 2.5, 270);
            if (chair) furniture.push(chair);
          }

          // TV Console on opposite wall
          const tv = createItem('tv_unit', rw - 2.0, 2.0, 90);
          if (tv) furniture.push(tv);

          // Indoor Potted Plants
          const plant1 = createItem('plant_pot', 0.5, 0.5, 0);
          const plant2 = createItem('plant_pot', rw - 2.2, 0.5, 0);
          if (plant1) furniture.push(plant1);
          if (plant2) furniture.push(plant2);

          // Integrated Dining Table in spacious living hall
          if (rh >= 16) {
            const dining = createItem('dining_6seater', (rw - 5.5) / 2, rh - 5.0, 0);
            if (dining) furniture.push(dining);
          }
        } else {
          // Standard Living Hall
          const rug = createItem('rug_area', Math.max(0.5, (rw - 8.0) / 2), 0.8, 0);
          if (rug) furniture.push(rug);

          const sofa = createItem('sofa_3seater', Math.max(0.8, (rw - 7.0) / 2), 1.0, 0);
          if (sofa) furniture.push(sofa);

          const table = createItem('coffee_table', Math.max(1, (rw - 3.5) / 2), 4.2, 0);
          if (table) furniture.push(table);

          if (rh >= 9) {
            const tv = createItem('tv_unit', Math.max(0.8, (rw - 5.5) / 2), rh - 1.8, 0);
            if (tv) furniture.push(tv);
          }

          const plant = createItem('plant_pot', 0.5, 0.5, 0);
          if (plant) furniture.push(plant);
        }
        break;
      }

      case 'dining': {
        const diningType = rw >= 10 && rh >= 9 ? 'dining_6seater' : 'dining_4seater';
        const dW = diningType === 'dining_6seater' ? 5.5 : 4.0;
        const dL = diningType === 'dining_6seater' ? 3.5 : 3.0;
        const dining = createItem(diningType, (rw - dW) / 2, (rh - dL) / 2, 0);
        if (dining) furniture.push(dining);

        const plant = createItem('plant_pot', 0.5, 0.5, 0);
        if (plant) furniture.push(plant);
        break;
      }

      case 'kitchen': {
        // L-counter in top-left
        const counter = createItem('kitchen_counter_l', 0.5, 0.5, 0);
        if (counter) furniture.push(counter);

        // Gas Hob
        const hob = createItem('gas_hob', 3.2, 0.5, 0);
        if (hob) furniture.push(hob);

        // Kitchen Island if space allows
        if (rw >= 11 && rh >= 10) {
          const island = createItem('kitchen_island', 1.0, rh - 3.8, 0);
          if (island) furniture.push(island);
        }

        // Refrigerator
        if (rw >= 7) {
          const fridge = createItem('refrigerator', rw - 3.0, 0.5, 0);
          if (fridge) furniture.push(fridge);
        }
        break;
      }

      case 'bathroom':
      case 'attached_bathroom': {
        // WC Commode
        const wc = createItem('toilet_wc', 0.5, 0.5, 0);
        if (wc) furniture.push(wc);

        // Vanity basin
        if (rw >= 5) {
          const vanity = createItem('vanity_sink', rw - 2.8, 0.5, 0);
          if (vanity) furniture.push(vanity);
        }

        // Bathtub or Shower
        if (rw >= 8 && rh >= 7) {
          const tub = createItem('bathtub', 0.5, rh - 3.2, 0);
          if (tub) furniture.push(tub);
        } else if (rh >= 6) {
          const shower = createItem('shower_cubicle', 0.5, rh - 3.5, 0);
          if (shower) furniture.push(shower);
        }
        break;
      }

      case 'balcony': {
        const patio = createItem('patio_set', Math.max(0.5, (rw - 6.0) / 2), Math.max(0.5, (rh - 4.5) / 2), 0);
        if (patio) furniture.push(patio);

        const plant1 = createItem('plant_pot', 0.5, 0.5, 0);
        const plant2 = createItem('plant_pot', rw - 2.2, 0.5, 0);
        if (plant1) furniture.push(plant1);
        if (plant2) furniture.push(plant2);
        break;
      }

      case 'parking': {
        const car1 = createItem('car_sedan', Math.max(0.8, (rw - 6.0) / 2), 1.0, 0);
        if (car1) furniture.push(car1);
        if (rw >= 14) {
          const car2 = createItem('car_suv', rw - 7.0, 1.0, 0);
          if (car2) furniture.push(car2);
        }
        break;
      }

      case 'pooja': {
        const mandir = createItem('pooja_mandir', Math.max(0.5, (rw - 3.0) / 2), 0.5, 0);
        if (mandir) furniture.push(mandir);
        break;
      }

      case 'utility': {
        const wm = createItem('washing_machine', 0.5, 0.5, 0);
        if (wm) furniture.push(wm);
        break;
      }

      case 'foyer': {
        const shoe = createItem('shoe_rack', 0.5, 0.5, 0);
        if (shoe) furniture.push(shoe);

        const plant = createItem('plant_pot', rw - 2.2, 0.5, 0);
        if (plant) furniture.push(plant);
        break;
      }

      default:
        break;
    }

    return furniture.filter(Boolean);
  }

  /**
   * Auto-furnishes an entire floor level or whole floor plan
   * @param {object} floorPlan 
   * @param {number|'all'} [level='all'] 
   * @returns {object} Updated FloorPlan with staged furniture
   */
  autoFurnishPlan(floorPlan, level = 'all') {
    if (!floorPlan || !floorPlan.floors) return floorPlan;

    const updated = structuredClone(floorPlan);
    updated.floors = updated.floors.map((floor) => {
      if (level !== 'all' && floor.level !== level) {
        return floor;
      }

      let allFloorFurniture = [];
      const updatedRooms = (floor.rooms || []).map((room) => {
        const roomFurniture = this.furnishRoom(room);
        allFloorFurniture = [...allFloorFurniture, ...roomFurniture];
        return {
          ...room,
          furniture: roomFurniture,
        };
      });

      return {
        ...floor,
        rooms: updatedRooms,
        furniture: allFloorFurniture,
      };
    });

    return updated;
  }

  /**
   * Clears all furniture staging from a floor or room
   * @param {object} floorPlan 
   * @param {number|'all'} [level='all'] 
   * @param {string} [roomId=null] 
   * @returns {object}
   */
  clearStaging(floorPlan, level = 'all', roomId = null) {
    if (!floorPlan || !floorPlan.floors) return floorPlan;

    const updated = structuredClone(floorPlan);
    updated.floors = updated.floors.map((floor) => {
      if (level !== 'all' && floor.level !== level) {
        return floor;
      }

      const updatedRooms = (floor.rooms || []).map((room) => {
        if (roomId && room.id !== roomId) return room;
        return {
          ...room,
          furniture: [],
        };
      });

      const updatedFurniture = roomId 
        ? (floor.furniture || []).filter(f => f.roomId !== roomId)
        : [];

      return {
        ...floor,
        rooms: updatedRooms,
        furniture: updatedFurniture,
      };
    });

    return updated;
  }
}

export const StagingServiceInstance = new StagingService();
