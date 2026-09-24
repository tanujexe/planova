import { validateProject } from '../domain/project.js';
import { SHARMA_RESIDENCE_PROJECT } from '../data/demoProject.js';
import { generateId } from '../lib/ids.js';

const STORAGE_KEY = 'planova_projects_v1';
const LEGACY_STORAGE_KEY = 'drafted_projects_v1';

// In-memory fallback for non-browser / test environments
const memoryStorage = new Map();

const getStorageItem = (key) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem(key);
  }
  return memoryStorage.get(key) || null;
};

const setStorageItem = (key, value) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(key, value);
  } else {
    memoryStorage.set(key, value);
  }
};

class ProjectRepositoryService {
  constructor() {
    this.init();
  }

  init() {
    try {
      let stored = getStorageItem(STORAGE_KEY);
      if (!stored) {
        const legacy = getStorageItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          stored = legacy;
          setStorageItem(STORAGE_KEY, legacy);
        }
      }
      if (!stored || stored === '[]') {
        this.seedDemoIfEmpty();
      }
    } catch (e) {
      console.warn('Storage initialisation error:', e);
    }
  }

  /**
   * Normalizes legacy or partial project objects into the current schema
   * @param {any} p 
   * @returns {any}
   */
  normalizeProject(p) {
    if (!p || typeof p !== 'object') return structuredClone(SHARMA_RESIDENCE_PROJECT);

    return {
      id: p.id || generateId('proj'),
      version: 1,
      name: p.name || 'Untitled Home Design',
      clientName: p.clientName || '',
      location: p.location || 'Bhopal, Madhya Pradesh',
      plot: {
        width: Number(p.plot?.width) || 30,
        length: Number(p.plot?.length) || 50,
        unit: p.plot?.unit || 'ft',
        floors: p.plot?.floors || 2,
        roadSide: p.plot?.roadSide || 'north',
        facing: p.plot?.facing || 'north',
        setbacks: p.plot?.setbacks || { front: 3, rear: 3, left: 2, right: 2 },
      },
      requirements: {
        bhk: p.requirements?.bhk || 3,
        bathrooms: p.requirements?.bathrooms || 2,
        attachedBathrooms: p.requirements?.attachedBathrooms || 1,
        rooms: p.requirements?.rooms || [],
        parking: p.requirements?.parking || { cars: 1, twoWheelers: 1 },
        ventilation: p.requirements?.ventilation || 'high',
        vastu: p.requirements?.vastu || 'basic',
        budgetInr: p.requirements?.budgetInr || 3500000,
        quality: p.requirements?.quality || 'standard',
      },
      designOptions: p.designOptions || [],
      selectedOptionId: p.selectedOptionId,
      design: p.design || null,
      history: p.history || { past: [], future: [] },
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
    };
  }

  /**
   * Returns list of all project summaries
   * @returns {Array<{id: string, name: string, clientName?: string, location: string, plot: any, requirements: any, updatedAt: string}>}
   */
  list() {
    try {
      const raw = getStorageItem(STORAGE_KEY);
      if (!raw) return [this.getSummary(SHARMA_RESIDENCE_PROJECT)];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [this.getSummary(SHARMA_RESIDENCE_PROJECT)];
      return parsed.map((p) => this.getSummary(this.normalizeProject(p)));
    } catch (err) {
      console.error('Error listing projects from storage:', err);
      return [this.getSummary(SHARMA_RESIDENCE_PROJECT)];
    }
  }

  /**
   * Retrieves full project by ID
   * @param {string} id 
   * @returns {any | null}
   */
  get(id) {
    try {
      const raw = getStorageItem(STORAGE_KEY);
      if (!raw) {
        if (id === SHARMA_RESIDENCE_PROJECT.id) return structuredClone(SHARMA_RESIDENCE_PROJECT);
        return null;
      }
      const projects = JSON.parse(raw);
      if (!Array.isArray(projects)) return null;

      const found = projects.find((p) => p.id === id);
      if (found) return this.normalizeProject(found);

      if (id === SHARMA_RESIDENCE_PROJECT.id) {
        this.save(SHARMA_RESIDENCE_PROJECT);
        return structuredClone(SHARMA_RESIDENCE_PROJECT);
      }
      return null;
    } catch (err) {
      console.error(`Error loading project ${id}:`, err);
      if (id === SHARMA_RESIDENCE_PROJECT.id) return structuredClone(SHARMA_RESIDENCE_PROJECT);
      return null;
    }
  }

  /**
   * Validates and persists project
   * @param {any} project 
   * @returns {boolean}
   */
  save(project) {
    try {
      const normalized = this.normalizeProject(project);
      const parseResult = validateProject(normalized);
      if (!parseResult.success) {
        console.warn('Project validation warnings during save:', parseResult.error.format());
      }

      const validProject = {
        ...normalized,
        updatedAt: new Date().toISOString(),
      };

      const raw = getStorageItem(STORAGE_KEY);
      let projects = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(projects)) projects = [];

      const index = projects.findIndex((p) => p.id === validProject.id);

      if (index >= 0) {
        projects[index] = validProject;
      } else {
        projects.unshift(validProject);
      }

      setStorageItem(STORAGE_KEY, JSON.stringify(projects));
      return true;
    } catch (err) {
      console.error('Error saving project to storage:', err);
      return false;
    }
  }

  /**
   * Deletes a project by ID
   * @param {string} id 
   */
  remove(id) {
    try {
      const raw = getStorageItem(STORAGE_KEY);
      if (!raw) return;
      const projects = JSON.parse(raw);
      if (!Array.isArray(projects)) return;
      const filtered = projects.filter((p) => p.id !== id);
      setStorageItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.error(`Error removing project ${id}:`, err);
    }
  }

  /**
   * Duplicates an existing project
   * @param {string} id 
   * @returns {any | null}
   */
  duplicate(id) {
    const existing = this.get(id);
    if (!existing) return null;

    const newId = generateId('proj');
    const cloned = {
      ...structuredClone(existing),
      id: newId,
      name: `${existing.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.save(cloned);
    return cloned;
  }

  /**
   * Renames a project
   * @param {string} id 
   * @param {string} newName 
   * @returns {boolean}
   */
  rename(id, newName) {
    const existing = this.get(id);
    if (!existing) return false;
    existing.name = newName.trim();
    return this.save(existing);
  }

  /**
   * Seeds demo project if storage is empty
   */
  seedDemoIfEmpty() {
    try {
      const raw = getStorageItem(STORAGE_KEY);
      if (!raw || JSON.parse(raw).length === 0) {
        setStorageItem(STORAGE_KEY, JSON.stringify([SHARMA_RESIDENCE_PROJECT]));
      }
    } catch (e) {
      console.warn('Failed to seed demo project:', e);
    }
  }

  /**
   * Resets Sharma Residence project back to pristine seed state
   * @returns {any}
   */
  resetDemo() {
    this.save(SHARMA_RESIDENCE_PROJECT);
    return structuredClone(SHARMA_RESIDENCE_PROJECT);
  }

  getSummary(p) {
    return {
      id: p.id,
      name: p.name,
      clientName: p.clientName,
      location: p.location,
      plot: p.plot,
      requirements: p.requirements,
      updatedAt: p.updatedAt,
      builtUpAreaSqFt: p.design?.builtUpAreaSqFt || 1705,
      bhk: p.requirements?.bhk || 3,
    };
  }
}

export const ProjectRepository = new ProjectRepositoryService();
