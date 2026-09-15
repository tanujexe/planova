/**
 * Preliminary Bill of Quantities (BOQ) Service
 * Pure derivation functions adhering to PRD §22 and Spec §BoqService.
 */

class BoqService {
  /**
   * Generates a structured list of preliminary materials
   * @param {{ plan: object, requirements: object }} input 
   * @returns {Array<{
   *   id: string,
   *   category: string,
   *   material: string,
   *   specification: string,
   *   quantity: number,
   *   unit: string,
   *   unitRateInr: number,
   *   totalCostInr: number
   * }>}
   */
  generateBoq({ plan, requirements }) {
    let builtUp = 0;
    let roomCount = 0;
    let bathCount = Number(requirements?.bathrooms) || 2;
    let doorCount = 0;
    let windowCount = 0;

    if (plan && plan.floors) {
      plan.floors.forEach((f) => {
        (f.rooms || []).forEach((r) => {
          builtUp += (r.width * r.height);
          roomCount++;
        });
        (f.openings || []).forEach((op) => {
          if (op.type === 'door') doorCount++;
          if (op.type === 'window') windowCount++;
        });
      });
    }

    builtUp = Math.round(builtUp) || 1705;
    doorCount = Math.max(doorCount, roomCount + 1);
    windowCount = Math.max(windowCount, roomCount);

    const items = [
      {
        id: 'boq-cement',
        category: 'Structural Materials',
        material: 'OPC / PPC Grade Cement',
        specification: 'UltraTech / Ambuja 50kg Bags',
        quantity: Math.round(builtUp * 0.42),
        unit: 'Bags (50kg)',
        unitRateInr: 390,
        totalCostInr: Math.round(builtUp * 0.42 * 390),
      },
      {
        id: 'boq-steel',
        category: 'Structural Materials',
        material: 'TMT Reinforcement Steel',
        specification: 'Fe-550D High Ductility Rebars',
        quantity: Number(((builtUp * 3.85) / 1000).toFixed(2)),
        unit: 'Metric Tonnes',
        unitRateInr: 68000,
        totalCostInr: Math.round(((builtUp * 3.85) / 1000) * 68000),
      },
      {
        id: 'boq-bricks',
        category: 'Masonry & Partitions',
        material: 'Red Clay Bricks / AAC Blocks',
        specification: 'Class-I Standard 9" × 4" × 3"',
        quantity: Math.round(builtUp * 21.5),
        unit: 'Numbers',
        unitRateInr: 9.5,
        totalCostInr: Math.round(builtUp * 21.5 * 9.5),
      },
      {
        id: 'boq-sand-aggregate',
        category: 'Structural Materials',
        material: 'River Sand & 20mm Aggregate',
        specification: 'Coarse graded concrete mix',
        quantity: Math.round(builtUp * 1.8),
        unit: 'Cubic Feet (cft)',
        unitRateInr: 55,
        totalCostInr: Math.round(builtUp * 1.8 * 55),
      },
      {
        id: 'boq-flooring',
        category: 'Finishes & Tiling',
        material: 'Vitrified Floor & Wall Tiles',
        specification: 'Double Charged 4ft × 2ft & Anti-skid',
        quantity: Math.round(builtUp * 1.18),
        unit: 'Square Feet (sq.ft)',
        unitRateInr: 85,
        totalCostInr: Math.round(builtUp * 1.18 * 85),
      },
      {
        id: 'boq-doors',
        category: 'Openings & Carpentry',
        material: 'Flush Doors & Sal Wood Frames',
        specification: '32mm Laminated Flush Shutters',
        quantity: doorCount,
        unit: 'Units',
        unitRateInr: 6500,
        totalCostInr: doorCount * 6500,
      },
      {
        id: 'boq-windows',
        category: 'Openings & Carpentry',
        material: 'Aluminium 3-Track Windows',
        specification: 'Anodized frame with Mosquito Mesh',
        quantity: windowCount,
        unit: 'Units',
        unitRateInr: 7200,
        totalCostInr: windowCount * 7200,
      },
      {
        id: 'boq-paint',
        category: 'Finishes & Tiling',
        material: 'Internal & Exterior Paint',
        specification: 'Acrylic Emulsion + 2 Coats Putty',
        quantity: Math.round(builtUp * 0.18),
        unit: 'Litres',
        unitRateInr: 340,
        totalCostInr: Math.round(builtUp * 0.18 * 340),
      },
      {
        id: 'boq-electrical',
        category: 'Services & MEP',
        material: 'Electrical Wiring & Modular Plates',
        specification: 'Finolex FR Wire + Havells Plates',
        quantity: Math.round(builtUp * 0.08),
        unit: 'Points & Modules',
        unitRateInr: 950,
        totalCostInr: Math.round(builtUp * 0.08 * 950),
      },
      {
        id: 'boq-plumbing',
        category: 'Services & MEP',
        material: 'Sanitary Fixtures & CPVC Piping',
        specification: 'Astral CPVC + Jaquar Wall Mixers',
        quantity: bathCount * 6,
        unit: 'Fixture Points',
        unitRateInr: 4500,
        totalCostInr: bathCount * 6 * 4500,
      },
    ];

    return items;
  }
}

export const BoqServiceInstance = new BoqService();
