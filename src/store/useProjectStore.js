import { create } from 'zustand';
import { ProjectRepository } from '../services/repository.js';
import { generateId } from '../lib/ids.js';
import { validatePlan, validateRoomMutation } from '../domain/constraints.js';

const MAX_HISTORY = 20;

export const useProjectStore = create((set, get) => ({
  projects: [],
  activeProject: null,
  isLoading: false,
  error: null,

  // History state for active project
  historyPast: [],
  historyFuture: [],

  /**
   * Loads all project summaries from storage
   */
  loadProjects: () => {
    set({ isLoading: true, error: null });
    try {
      const summaries = ProjectRepository.list();
      set({ projects: summaries, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load projects from storage', isLoading: false });
    }
  },

  /**
   * Loads active project into store
   * @param {string} id 
   */
  loadProject: (id) => {
    set({ isLoading: true, error: null });
    try {
      const project = ProjectRepository.get(id);
      if (project) {
        set({ 
          activeProject: project, 
          historyPast: [], 
          historyFuture: [], 
          isLoading: false 
        });
        return project;
      } else {
        set({ error: `Project ${id} not found`, isLoading: false });
        return null;
      }
    } catch (err) {
      set({ error: `Error loading project ${id}`, isLoading: false });
      return null;
    }
  },

  /**
   * Updates and saves active project
   * @param {any} updated 
   */
  saveActiveProject: (updated) => {
    const project = updated || get().activeProject;
    if (!project) return;
    ProjectRepository.save(project);
    set({ activeProject: { ...project, updatedAt: new Date().toISOString() } });
    get().loadProjects();
  },

  /**
   * Pushes current design to history before mutation
   */
  pushHistorySnapshot: () => {
    const active = get().activeProject;
    if (!active || !active.design) return;

    const currentDesign = structuredClone(active.design);
    set((state) => ({
      historyPast: [currentDesign, ...state.historyPast].slice(0, MAX_HISTORY),
      historyFuture: [], // Clear redo on new action
    }));
  },

  /**
   * Undo last design modification
   */
  undo: () => {
    const { historyPast, historyFuture, activeProject } = get();
    if (!historyPast.length || !activeProject) return;

    const previousDesign = historyPast[0];
    const newPast = historyPast.slice(1);
    const newFuture = [structuredClone(activeProject.design), ...historyFuture].slice(0, MAX_HISTORY);

    const updated = {
      ...activeProject,
      design: previousDesign,
    };

    ProjectRepository.save(updated);
    set({
      activeProject: updated,
      historyPast: newPast,
      historyFuture: newFuture,
    });
    get().loadProjects();
  },

  /**
   * Redo previously undone design modification
   */
  redo: () => {
    const { historyPast, historyFuture, activeProject } = get();
    if (!historyFuture.length || !activeProject) return;

    const nextDesign = historyFuture[0];
    const newFuture = historyFuture.slice(1);
    const newPast = [structuredClone(activeProject.design), ...historyPast].slice(0, MAX_HISTORY);

    const updated = {
      ...activeProject,
      design: nextDesign,
    };

    ProjectRepository.save(updated);
    set({
      activeProject: updated,
      historyPast: newPast,
      historyFuture: newFuture,
    });
    get().loadProjects();
  },

  /**
   * Updates a single room's position or dimensions
   * @param {number} floorLevel 
   * @param {object} updatedRoom 
   * @returns {{ success: boolean, error?: string }}
   */
  updateRoom: (floorLevel, updatedRoom) => {
    const active = get().activeProject;
    if (!active || !active.design) return { success: false, error: 'No active design.' };

    const validation = validateRoomMutation(active.design, floorLevel, updatedRoom);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Save history snapshot before committing
    get().pushHistorySnapshot();

    const nextDesign = structuredClone(active.design);
    const floor = nextDesign.floors.find((f) => f.level === floorLevel);
    if (!floor) return { success: false, error: 'Invalid floor.' };

    const rIdx = floor.rooms.findIndex((r) => r.id === updatedRoom.id);
    if (rIdx >= 0) {
      floor.rooms[rIdx] = { ...floor.rooms[rIdx], ...updatedRoom };
    }

    // Recalculate built-up area
    let totalBuiltUp = 0;
    nextDesign.floors.forEach(f => {
      f.rooms.forEach(r => {
        totalBuiltUp += (r.width * r.height);
      });
    });
    nextDesign.builtUpAreaSqFt = Math.round(totalBuiltUp);

    const updatedProject = {
      ...active,
      design: nextDesign,
    };

    ProjectRepository.save(updatedProject);
    set({ activeProject: updatedProject });
    get().loadProjects();
    return { success: true };
  },

  /**
   * Creates a new project and saves to store
   * @param {any} projectData 
   * @returns {string} ID of new project
   */
  createProject: (projectData) => {
    const newId = generateId('proj');
    const newProject = {
      id: newId,
      version: 1,
      name: projectData.name || 'Untitled Home Design',
      clientName: projectData.clientName || '',
      location: projectData.location || 'Bhopal, Madhya Pradesh',
      plot: projectData.plot || {
        width: 30,
        length: 50,
        unit: 'ft',
        floors: 2,
        roadSide: 'north',
        facing: 'north',
      },
      requirements: projectData.requirements || {
        bhk: 3,
        bathrooms: 2,
        attachedBathrooms: 1,
        rooms: [],
        parking: { cars: 1, twoWheelers: 1 },
        ventilation: 'high',
        vastu: 'basic',
        budgetInr: 3500000,
        quality: 'standard',
      },
      designOptions: [],
      history: { past: [], future: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    ProjectRepository.save(newProject);
    set({ activeProject: newProject, historyPast: [], historyFuture: [] });
    get().loadProjects();
    return newId;
  },

  /**
   * Duplicates an existing project
   * @param {string} id 
   * @returns {any} Cloned project
   */
  duplicateProject: (id) => {
    const cloned = ProjectRepository.duplicate(id);
    get().loadProjects();
    return cloned;
  },

  /**
   * Renames a project
   * @param {string} id 
   * @param {string} newName 
   */
  renameProject: (id, newName) => {
    ProjectRepository.rename(id, newName);
    const active = get().activeProject;
    if (active && active.id === id) {
      set({ activeProject: { ...active, name: newName } });
    }
    get().loadProjects();
  },

  /**
   * Deletes a project
   * @param {string} id 
   */
  deleteProject: (id) => {
    ProjectRepository.remove(id);
    const active = get().activeProject;
    if (active && active.id === id) {
      set({ activeProject: null });
    }
    get().loadProjects();
  },

  /**
   * Resets Sharma Residence demo project
   */
  resetDemoProject: () => {
    const demo = ProjectRepository.resetDemo();
    set({ activeProject: demo, historyPast: [], historyFuture: [] });
    get().loadProjects();
    return demo;
  },
}));
