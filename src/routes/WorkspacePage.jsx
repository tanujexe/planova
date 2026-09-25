import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Layout, 
  Sparkles, 
  Undo, 
  Redo, 
  Layers, 
  Box, 
  Download,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Armchair,
  Trash2,
  Columns2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { PlanCanvas } from '../components/design/PlanCanvas.jsx';
import { RoomInspector } from '../components/design/RoomInspector.jsx';
import { FurnitureDrawer } from '../components/design/FurnitureDrawer.jsx';
import { StudioToolbar } from '../components/design/StudioToolbar.jsx';
import { ThreeScene } from '../components/visualization/ThreeScene.jsx';
import { NaturalLanguageAssistant } from '../components/assistant/NaturalLanguageAssistant.jsx';
import { validatePlan } from '../domain/constraints.js';
import { formatInrShorthand } from '../lib/currency.js';
import { formatDimension } from '../lib/units.js';
import { getFurnitureDefinition } from '../domain/furnitureCatalog.js';
import { generateId } from '../lib/ids.js';

export const WorkspacePage = () => {
  const { projectId } = useParams();
  const { 
    activeProject, 
    loadProject, 
    saveActiveProject,
    updateRoom, 
    addRoom,
    removeRoom,
    autoFurnishFloor,
    clearFloorFurniture,
    addFurnitureItem,
    updateFurnitureItem,
    removeFurnitureItem,
    pushHistorySnapshot,
    undo, 
    redo, 
    historyPast, 
    historyFuture 
  } = useProjectStore();

  const [activeFloorLevel, setActiveFloorLevel] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedFurnitureId, setSelectedFurnitureId] = useState(null);
  const [isFurnitureDrawerOpen, setIsFurnitureDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('2d'); // '2d' | 'split' | '3d'
  const [activeTool, setActiveTool] = useState('select');
  const [previewPlan, setPreviewPlan] = useState(null);
  const [highlightedRoomIds, setHighlightedRoomIds] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId, loadProject]);

  // Global Keyboard shortcuts: Ctrl+Z / Ctrl+Y
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (historyPast.length > 0) {
          undo();
          showToast('Undone previous layout change');
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        if (historyFuture.length > 0) {
          redo();
          showToast('Redone layout change');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyPast, historyFuture, undo, redo]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const project = activeProject || {
    plot: { width: 30, length: 50, floors: 2 },
    design: { floors: [] },
    requirements: { bhk: 3, budgetInr: 3500000 },
  };

  // Active or Preview plan
  const plan = previewPlan || project.design || {
    plot: project.plot || { width: 30, length: 50 },
    floors: [],
  };

  const validation = validatePlan(plan);
  const currentFloor = plan.floors?.find(f => f.level === activeFloorLevel) || plan.floors?.[0] || { rooms: [], furniture: [] };
  const rooms = currentFloor.rooms || [];
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  const handleRoomUpdate = (updated) => {
    const res = updateRoom(activeFloorLevel, updated);
    if (!res.success) {
      showToast(res.error || 'Invalid placement');
    }
  };

  const handleAddRoomPreset = (preset) => {
    // Find open coordinate inside setback
    const newX = Math.min(plan.plot?.width - preset.width - 2, 4 + (rooms.length * 2) % 10);
    const newY = Math.min(plan.plot?.length - preset.height - 4, 4 + (rooms.length * 3) % 12);

    const res = addRoom(activeFloorLevel, {
      ...preset,
      x: Math.max(2, newX),
      y: Math.max(2, newY),
    });

    if (res.success) {
      setSelectedRoomId(res.room.id);
      showToast(`Added ${preset.label} to floor plan!`);
    } else {
      showToast(res.error || 'Could not add room');
    }
  };

  const handleApplyMutation = (newPlan) => {
    pushHistorySnapshot();
    const updated = {
      ...project,
      design: newPlan,
    };
    saveActiveProject(updated);
    setPreviewPlan(null);
    setHighlightedRoomIds([]);
    showToast('Applied AI design mutation successfully!');
  };

  const handlePreviewMutation = (newPlan, affectedIds) => {
    setPreviewPlan(newPlan);
    setHighlightedRoomIds(affectedIds || []);
  };

  const handleClearPreview = () => {
    setPreviewPlan(null);
    setHighlightedRoomIds([]);
  };

  // Staging handlers
  const handleAutoStage = () => {
    autoFurnishFloor(activeFloorLevel);
    showToast(`Auto-staged all rooms on ${currentFloor.label || 'this floor'}!`);
  };

  const handleClearStaging = () => {
    clearFloorFurniture(activeFloorLevel);
    setSelectedFurnitureId(null);
    showToast(`Cleared furniture on ${currentFloor.label || 'this floor'}.`);
  };

  const handleAddFurniture = (furnitureType) => {
    const def = getFurnitureDefinition(furnitureType);
    if (!def) return;

    let targetX = 5;
    let targetY = 5;
    let targetRoomId = null;

    if (selectedRoom) {
      targetX = selectedRoom.x + Math.max(0.5, (selectedRoom.width - def.width) / 2);
      targetY = selectedRoom.y + Math.max(0.5, (selectedRoom.height - def.length) / 2);
      targetRoomId = selectedRoom.id;
    }

    const newItem = {
      id: generateId('furn'),
      type: furnitureType,
      label: def.label,
      roomId: targetRoomId,
      x: Number(targetX.toFixed(2)),
      y: Number(targetY.toFixed(2)),
      width: def.width,
      length: def.length,
      height: def.height,
      rotation: 0,
    };

    addFurnitureItem(activeFloorLevel, newItem);
    setSelectedFurnitureId(newItem.id);
    showToast(`Added ${def.label} to floor!`);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === 'rendered') {
      const floorFurn = currentFloor.furniture || [];
      const roomFurn = (currentFloor.rooms || []).flatMap(r => r.furniture || []);
      if (floorFurn.length + roomFurn.length === 0) {
        autoFurnishFloor(activeFloorLevel);
        showToast('Auto-Furnished layout for Full Architectural Render! ✨');
      }
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-linen overflow-hidden h-full w-full">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl shadow-elevated border border-sand-400/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-sage-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Workspace Toolbar */}
      <div className="bg-white border-b border-sand-300 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 z-10">
        
        {/* Left: Rooms Toggle, Floor Level Switcher & Undo/Redo */}
        <div className="flex items-center gap-3">
          {/* Toggle Left Sidebar (Rooms Schedule) */}
          <button
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isLeftPanelOpen
                ? 'bg-sand-100 text-ink border-sand-300 hover:bg-sand-200'
                : 'bg-white text-ink-muted border-sand-300 hover:text-ink hover:bg-sand-50'
            }`}
            title={isLeftPanelOpen ? "Minimize Rooms Schedule" : "Show Rooms Schedule"}
            aria-label="Toggle Rooms Schedule"
          >
            {isLeftPanelOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4 text-sage-600" />}
            <span className="hidden xl:inline text-[11px]">{isLeftPanelOpen ? 'Hide Rooms' : 'Rooms'}</span>
          </button>

          <div className="h-4 w-px bg-sand-300 hidden sm:block" />

          <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl border border-sand-200">
            {plan.floors?.map((f) => (
              <button
                key={f.level}
                onClick={() => {
                  setActiveFloorLevel(f.level);
                  setSelectedRoomId(null);
                  setSelectedFurnitureId(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeFloorLevel === f.level
                    ? 'bg-sage-600 text-white shadow-subtle'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {f.label || `Level ${f.level}`}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-sand-300 hidden sm:block" />

          {/* Undo / Redo controls */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => {
                undo();
                showToast('Undone layout modification');
              }}
              disabled={historyPast.length === 0}
              className="p-1.5 text-ink hover:bg-sand-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                redo();
                showToast('Redone layout modification');
              }}
              disabled={historyFuture.length === 0}
              className="p-1.5 text-ink hover:bg-sand-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
            {historyPast.length > 0 && (
              <span className="text-[10px] font-mono text-ink-muted pl-1">
                ({historyPast.length} past)
              </span>
            )}
          </div>
        </div>

        {/* Center/Right: Staging Toggle, 3D & Status, CAD Export & Copilot Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-ink-muted">
            <span>{plan.plot?.width || 30} × {plan.plot?.length || 50} ft</span>
            <span>•</span>
            <span className="font-bold text-ink">~{plan.builtUpAreaSqFt || 1705} sq.ft</span>
          </div>

          {previewPlan ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sage-500 text-white rounded-lg font-semibold text-[11px] shadow-subtle animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Previewing AI Proposal</span>
            </span>
          ) : validation.valid ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sage-50 text-sage-800 rounded-lg font-semibold text-[11px] border border-sage-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-sage-600" />
              <span className="hidden sm:inline">Geometry Valid</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-terracotta-light text-terracotta-dark rounded-lg font-semibold text-[11px] border border-terracotta/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Spatial Conflict</span>
            </span>
          )}

          <Link
            to={`/projects/${project.id}/export`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CAD Export</span>
          </Link>

          <div className="h-4 w-px bg-sand-300 hidden sm:block" />

          {/* Toggle Right Sidebar (AI Copilot / Inspector) */}
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className={`p-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isRightPanelOpen
                ? 'bg-sand-100 text-ink border-sand-300 hover:bg-sand-200'
                : 'bg-white text-ink-muted border-sand-300 hover:text-ink hover:bg-sand-50'
            }`}
            title={isRightPanelOpen ? "Minimize AI Copilot" : "Show AI Copilot"}
            aria-label="Toggle AI Copilot"
          >
            {isRightPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4 text-sage-600" />}
            <span className="hidden xl:inline text-[11px]">{isRightPanelOpen ? 'Hide Copilot' : 'Copilot'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio 3-Column Independent Viewport Area */}
      <div className="flex-1 min-h-0 flex overflow-hidden relative w-full">
        
        {/* 1. Left Section: Rooms Schedule (Independent Scrollable Column) */}
        <aside
          className={`bg-white border-r border-sand-300 flex flex-col shrink-0 h-full overflow-hidden z-10 shadow-xs transition-all duration-300 ease-in-out ${
            isLeftPanelOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 border-r-0 pointer-events-none'
          }`}
        >
          <div className="w-64 flex flex-col h-full shrink-0">
            {/* Fixed Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 shrink-0 bg-sand-50/50">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink">
                  Rooms Schedule
                </h3>
                <span className="text-[10px] font-mono text-sage-800 bg-sage-100 px-2 py-0.5 rounded-full font-bold border border-sage-300">
                  {rooms.length} Spaces
                </span>
              </div>
              <button
                onClick={() => setIsLeftPanelOpen(false)}
                className="p-1 text-ink-muted hover:text-ink hover:bg-sand-200/60 rounded-lg transition-colors"
                title="Minimize Rooms Schedule"
                aria-label="Minimize Rooms Schedule"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Room List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {rooms.map((room) => {
                const isSelected = selectedRoomId === room.id;
                const isHighlighted = highlightedRoomIds.includes(room.id);
                const area = Math.round(room.width * room.height);

                return (
                  <button
                    key={room.id}
                    onClick={() => {
                      setSelectedRoomId(room.id);
                      setSelectedFurnitureId(null);
                      setIsRightPanelOpen(true);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-sage-50 border-sage-500 ring-2 ring-sage-500/20 shadow-subtle'
                        : isHighlighted
                        ? 'bg-terracotta-light/60 border-terracotta ring-2 ring-terracotta/30 animate-pulse'
                        : 'bg-linen border-sand-200 hover:border-sand-300 hover:bg-sand-50 text-ink'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs text-ink truncate">
                        {room.label}
                      </span>
                      {room.type === 'pooja' && (
                        <span className="text-[9px] bg-amber-100 text-amber-900 px-1 rounded font-bold border border-amber-300">
                          NE
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-ink-muted flex items-center justify-between mt-1">
                      <span>{room.width}&apos; × {room.height}&apos;</span>
                      <span className="font-semibold text-ink">{area} sq.ft</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* 2. Center Section: Canvas / 2D / 3D Blueprint Area (Independent Viewport) */}
        <main className="flex-1 h-full min-w-0 relative flex flex-col overflow-hidden bg-linen">
          {/* Docked Tab to Restore Left Panel (Rooms Schedule) */}
          {!isLeftPanelOpen && (
            <button
              onClick={() => setIsLeftPanelOpen(true)}
              className="absolute left-0 top-20 z-20 bg-white/95 hover:bg-white text-ink border border-l-0 border-sand-300 py-3 px-2 rounded-r-xl shadow-subtle hover:shadow-card flex flex-col items-center gap-2 transition-all group hover:pl-3"
              title="Show Rooms Schedule"
              aria-label="Show Rooms Schedule"
            >
              <PanelLeftOpen className="w-4 h-4 text-sage-600 group-hover:scale-110 transition-transform" />
              <span 
                className="text-[10px] font-bold text-ink-muted uppercase tracking-wider select-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Rooms ({rooms.length})
              </span>
            </button>
          )}

          {/* Docked Tab to Restore Right Panel (AI Copilot / Room Inspector) */}
          {!isRightPanelOpen && (
            <button
              onClick={() => setIsRightPanelOpen(true)}
              className="absolute right-0 top-20 z-20 bg-white/95 hover:bg-white text-ink border border-r-0 border-sand-300 py-3 px-2 rounded-l-xl shadow-subtle hover:shadow-card flex flex-col items-center gap-2 transition-all group hover:pr-3"
              title={selectedRoom ? "Show Room Inspector" : "Show AI Copilot"}
              aria-label="Show AI Copilot"
            >
              <Sparkles className="w-4 h-4 text-sage-600 group-hover:scale-110 transition-transform" />
              <span 
                className="text-[10px] font-bold text-ink-muted uppercase tracking-wider select-none"
                style={{ writingMode: 'vertical-rl' }}
              >
                {selectedRoom ? selectedRoom.label : 'AI Copilot'}
              </span>
            </button>
          )}

          {/* 2D Plan View / Full Furnished Rendered Architectural View */}
          {(viewMode === '2d' || viewMode === 'rendered' || viewMode === 'split') && (
            <div className={`relative h-full ${viewMode === 'split' ? 'w-1/2 border-r border-[#EAE6DF]' : 'w-full'}`}>
              <PlanCanvas
                floorPlan={plan}
                activeFloorLevel={activeFloorLevel}
                selectedRoomId={selectedRoomId}
                selectedFurnitureId={selectedFurnitureId}
                highlightedRoomIds={highlightedRoomIds}
                renderMode={viewMode === 'rendered' ? 'rendered' : 'cad'}
                onSelectRoom={(room) => {
                  setSelectedRoomId(room.id);
                  setSelectedFurnitureId(null);
                  setIsRightPanelOpen(true);
                }}
                onUpdateRoom={handleRoomUpdate}
                onSelectFurniture={(fId) => {
                  setSelectedFurnitureId(fId);
                  if (fId) setSelectedRoomId(null);
                }}
                onUpdateFurniture={(updated) => updateFurnitureItem(activeFloorLevel, updated)}
                onRemoveFurniture={(fId) => removeFurnitureItem(activeFloorLevel, fId)}
              />
            </div>
          )}

          {/* 3D Scene View */}
          {(viewMode === '3d' || viewMode === 'split') && (
            <div className={`relative h-full ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <ThreeScene
                floorPlan={plan}
                visibleFloorLevel={activeFloorLevel}
              />
            </div>
          )}

          {/* Staging Catalog Drawer Floating Overlay */}
          <FurnitureDrawer
            isOpen={isFurnitureDrawerOpen}
            onClose={() => setIsFurnitureDrawerOpen(false)}
            onAutoStage={handleAutoStage}
            onClearStaging={handleClearStaging}
            onAddFurniture={handleAddFurniture}
            selectedRoom={selectedRoom}
          />

          {/* Bottom Floating Studio Toolbar */}
          <StudioToolbar
            activeTool={activeTool}
            onSelectTool={setActiveTool}
            onAddRoom={handleAddRoomPreset}
            onAutoStage={handleAutoStage}
            isStagingOpen={isFurnitureDrawerOpen}
            onToggleStagingDrawer={() => setIsFurnitureDrawerOpen(!isFurnitureDrawerOpen)}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />
        </main>

        {/* 3. Right Section: AI Copilot Chat / Room Inspector (Independent Scrollable Column) */}
        <aside
          className={`bg-white border-l border-sand-300 flex flex-col shrink-0 h-full overflow-hidden z-10 shadow-xs transition-all duration-300 ease-in-out ${
            isRightPanelOpen ? 'w-80 lg:w-96 opacity-100' : 'w-0 opacity-0 border-l-0 pointer-events-none'
          }`}
        >
          <div className="w-80 lg:w-96 flex flex-col h-full shrink-0">
            {selectedRoom ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Fixed Inspector Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 shrink-0 bg-sand-50/50">
                  <span className="font-display font-bold text-xs uppercase text-ink tracking-wider">
                    Room Inspector
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        removeRoom(activeFloorLevel, selectedRoom.id);
                        setSelectedRoomId(null);
                        showToast(`Deleted ${selectedRoom.label}`);
                      }}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1 mr-1"
                      title="Delete Room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                    <button
                      onClick={() => setIsRightPanelOpen(false)}
                      className="p-1 text-ink-muted hover:text-ink hover:bg-sand-200/60 rounded-lg transition-colors"
                      title="Minimize Inspector"
                      aria-label="Minimize Inspector"
                    >
                      <PanelRightClose className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Scrollable Inspector Controls */}
                <div className="flex-1 overflow-y-auto p-4">
                  <RoomInspector
                    room={selectedRoom}
                    plot={plan.plot || { width: 30, length: 50 }}
                    onUpdateRoom={handleRoomUpdate}
                    onClose={() => setSelectedRoomId(null)}
                  />
                </div>
              </div>
            ) : (
              <NaturalLanguageAssistant
                plan={project.design || plan}
                requirements={project.requirements || {}}
                onApplyMutation={handleApplyMutation}
                onPreviewMutation={handlePreviewMutation}
                onClearPreview={handleClearPreview}
                onMinimize={() => setIsRightPanelOpen(false)}
              />
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};
