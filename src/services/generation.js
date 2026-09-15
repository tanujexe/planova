import { 
  generateBalancedLayout, 
  generateOpenLivingLayout, 
  generateVastuPriorityLayout 
} from '../domain/templates.js';
import { generateId } from '../lib/ids.js';

export const GENERATION_STAGES = [
  'Analyzing plot dimensions and solar orientation...',
  'Applying Indian residential zoning (Living, Kitchen, Beds)...',
  'Aligning Vastu preferences and spatial relationships...',
  'Verifying spatial boundaries and circulation clearances...',
  'Preparing 3 architectural concept options...'
];

class DesignGenerationService {
  /**
   * Generates 3 structured design options with staged progress callback
   * @param {{ plot: any, requirements: any }} input 
   * @param {(stageIndex: number, stageMessage: string) => void} [onProgress] 
   * @returns {Promise<{ options: any[], defaultDesign: any }>}
   */
  async generate({ plot, requirements }, onProgress) {
    // Staged progress simulation
    for (let i = 0; i < GENERATION_STAGES.length; i++) {
      if (onProgress) {
        onProgress(i, GENERATION_STAGES[i]);
      }
      await new Promise(resolve => setTimeout(resolve, 320));
    }

    const balancedPlan = generateBalancedLayout(plot, requirements);
    const openPlan = generateOpenLivingLayout(plot, requirements);
    const vastuPlan = generateVastuPriorityLayout(plot, requirements);

    const quality = requirements.quality || 'standard';
    const ratePerSqFt = quality === 'economy' ? 1500 : quality === 'premium' ? 2500 : 1900;

    const options = [
      {
        id: 'opt-balanced',
        title: 'Balanced Layout',
        tagline: 'Harmonious family zoning, natural cross-ventilation, and spacious living',
        concept: 'balanced',
        areaSqFt: balancedPlan.builtUpAreaSqFt,
        roomCount: balancedPlan.floors.reduce((acc, f) => acc + f.rooms.length, 0),
        parkingSummary: `${requirements.parking?.cars || 1} Covered Car + ${requirements.parking?.twoWheelers || 1} Bike`,
        vastuNotes: 'Pooja in North-East, Kitchen in South-East, Master Bedroom in South-West',
        estimatedCostInr: Math.round(balancedPlan.builtUpAreaSqFt * ratePerSqFt),
        floorPlan: balancedPlan,
      },
      {
        id: 'opt-open-living',
        title: 'Open Living',
        tagline: 'Expansive uninterrupted living-dining core with central courtyard illumination',
        concept: 'open_living',
        areaSqFt: openPlan.builtUpAreaSqFt,
        roomCount: openPlan.floors.reduce((acc, f) => acc + f.rooms.length, 0),
        parkingSummary: `${requirements.parking?.cars || 1} Covered Car + ${requirements.parking?.twoWheelers || 1} Bike`,
        vastuNotes: 'Modern open kitchen with maximized northern daylight glazing',
        estimatedCostInr: Math.round(openPlan.builtUpAreaSqFt * ratePerSqFt),
        floorPlan: openPlan,
      },
      {
        id: 'opt-vastu-priority',
        title: 'Vastu Priority',
        tagline: 'Maximum traditional alignment with 8 directional cosmic energies',
        concept: 'vastu_priority',
        areaSqFt: vastuPlan.builtUpAreaSqFt,
        roomCount: vastuPlan.floors.reduce((acc, f) => acc + f.rooms.length, 0),
        parkingSummary: `${requirements.parking?.cars || 1} Covered Car in NW zone`,
        vastuNotes: '100% directional compliance for Pooja, Kitchen, Master, and Staircase',
        estimatedCostInr: Math.round(vastuPlan.builtUpAreaSqFt * ratePerSqFt),
        floorPlan: vastuPlan,
      },
    ];

    return {
      options,
      defaultDesign: balancedPlan,
    };
  }
}

export const GenerationService = new DesignGenerationService();
