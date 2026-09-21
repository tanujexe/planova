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
   * Adds a new room to the active floor
   */
  addRoom: (floorLevel, newRoom) => {
    const active = get().activeProject;
    if (!active || !active.design) return { success: false, error: 'No active design.' };

    get().pushHistorySnapshot();
    const nextDesign = structuredClone(active.design);
    const floor = nextDesign.floors.find((f) => f.level === floorLevel);
    if (!floor) return { success: false, error: 'Invalid floor.' };

    const roomToAdd = {
      id: generateId('rm'),
      type: newRoom.type || 'bedroom',
      label: newRoom.label || 'New Room',
      x: newRoom.x || 2,
      y: newRoom.y || 2,
      width: newRoom.width || 12,
      height: newRoom.height || 12,
      floor: floorLevel,
      color: newRoom.color || '#F8FAFC',
      required: false,
    };

    floor.rooms.push(roomToAdd);

    let totalBuiltUp = 0;
    nextDesign.floors.forEach(f => f.rooms.forEach(r => totalBuiltUp += (r.width * r.height)));
    nextDesign.builtUpAreaSqFt = Math.round(totalBuiltUp);

    const updatedProject = { ...active, design: nextDesign };
    ProjectRepository.save(updatedProject);
    set({ activeProject: updatedProject });
    get().loadProjects();
    return { success: true, room: roomToAdd };
  },

  /**
   * Removes a room from the active floor
   */
  removeRoom: (floorLevel, roomId) => {
    const active = get().activeProject;
    if (!active || !active.design) return { success: false, error: 'No active design.' };

    get().pushHistorySnapshot();
    const nextDesign = structuredClone(active.design);
    const floor = nextDesign.floors.find((f) => f.level === floorLevel);
    if (!floor) return { success: false, error: 'Invalid floor.' };

    floor.rooms = floor.rooms.filter(r => r.id !== roomId);
    if (floor.openings) {
      floor.openings = floor.openings.filter(op => op.wallRoomId !== roomId);
    }
    if (floor.furniture) {
      floor.furniture = floor.furniture.filter(f => f.roomId !== roomId);
    }

    let totalBuiltUp = 0;
    nextDesign.floors.forEach(f => f.rooms.forEach(r => totalBuiltUp += (r.width * r.height)));
    nextDesign.builtUpAreaSqFt = Math.round(totalBuiltUp);

    const updatedProject = { ...active, design: nextDesign };
    ProjectRepository.save(updatedProject);
    set({ activeProject: updatedProject });
    get().loadProjects();
    return { success: true };
  },

  /**
   * Automatically furnishes all rooms on the specified floor or all floors
   * @param {number|'all'} floorLevel 
   */
  autoFurnishFloor: (floorLevel = 'all') => {
    const active = get().activeProject;
    if (!active || !active.design) return;

    get().pushHistorySnapshot();
    import('../services/staging.js').then(({ StagingServiceInstance }) => {
      const updatedDesign = StagingServiceInstance.autoFurnishPlan(active.design, floorLevel);
      const updatedProject = {
        ...active,
        design: updatedDesign,
      };
      ProjectRepository.save(updatedProject);
      set({ activeProject: updatedProject });
      get().loadProjects();
    });
  },

  /**
   * Clears furniture staging on the specified floor
   * @param {number|'all'} floorLevel 
   * @param {string} [roomId=null]
   */
  clearFloorFurniture: (floorLevel = 'all', roomId = null) => {
    const active = get().activeProject;
    if (!active || !active.design) return;

    get().pushHistorySnapshot();
    import('../services/staging.js').then(({ StagingServiceInstance }) => {
      const updatedDesign = StagingServiceInstance.clearStaging(active.design, floorLevel, roomId);
      const updatedProject = {
        ...active,
        design: updatedDesign,
      };
      ProjectRepository.save(updatedProject);
      set({ activeProject: updatedProject });
      get().loadProjects();
    });
  },

  /**
   * Adds or updates a single furniture item on a floor
   */
  addFurnitureItem: (floorLevel, furnitureItem) => {
    const active = get().activeProject;
    if (!active || !active.design) return;

    get().pushHistorySnapshot();
    const nextDesign = structuredClone(active.design);
    const floor = nextDesign.floors.find((f) => f.level === floorLevel);
    if (!floor) return;

    if (!floor.furniture) floor.furniture = [];
    floor.furniture.push(furnitureItem);

    const updatedProject = { ...active, design: nextDesign };
    ProjectRepository.save(updatedProject);
    set({ activeProject: updatedProject });
    get().loadProjects();
  },

  /**
   * Updates an existing furniture item (position, rotation)
   */
  updateFurnitureItem: (floorLevel, updatedItem) => {
    const active = get().activeProject;
    if (!active || !active.design) return;

    const nextDesign = structuredClone(active.design);
    const floor = nextDesign.floors.find((f) => f.level === floorLevel);
    if (!floor || !floor.furniture) return;

    const fIdx = floor.furniture.findIndex((f) => f.id === updatedItem.id);
    if (fIdx >= 0) {
      floor.furniture[fIdx] = { ...floor.furniture[fIdx], ...updatedItem };
      const updatedProject = { ...active, design: nextDesign };
      ProjectRepository.save(updatedProject);
      set({ activeProject: updatedProject });
    }
  },

  /**
   * Removes a single furniture item
   */
  removeFurnitureItem: (floorLevel, furnitureId) => {
    const active = get().activeProject;
    if (!active || !active.design) return;

    get().pushHistorySnapshot();
    const nextDesign = structuredClone(active.design);
    const floor = nextDesign.floors.find((f) => f.level === floorLevel);
    if (!floor || !floor.furniture) return;

    floor.furniture = floor.furniture.filter((f) => f.id !== furnitureId);
    const updatedProject = { ...active, design: nextDesign };
    ProjectRepository.save(updatedProject);
    set({ activeProject: updatedProject });
    get().loadProjects();
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
