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
  RotateCcw
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore.js';
import { PlanCanvas } from '../components/design/PlanCanvas.jsx';
import { RoomInspector } from '../components/design/RoomInspector.jsx';
import { NaturalLanguageAssistant } from '../components/assistant/NaturalLanguageAssistant.jsx';
import { validatePlan } from '../domain/constraints.js';
import { formatInrShorthand } from '../lib/currency.js';
import { formatDimension } from '../lib/units.js';

export const WorkspacePage = () => {
  const { projectId } = useParams();
  const { 
    activeProject, 
    loadProject, 
    saveActiveProject,
    updateRoom, 
    pushHistorySnapshot,
    undo, 
    redo, 
    historyPast, 
    historyFuture 
  } = useProjectStore();

  const [activeFloorLevel, setActiveFloorLevel] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [previewPlan, setPreviewPlan] = useState(null);
  const [highlightedRoomIds, setHighlightedRoomIds] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

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
  const currentFloor = plan.floors?.find(f => f.level === activeFloorLevel) || plan.floors?.[0] || { rooms: [] };
  const rooms = currentFloor.rooms || [];
  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  const handleRoomUpdate = (updated) => {
    const res = updateRoom(activeFloorLevel, updated);
    if (!res.success) {
      showToast(res.error || 'Invalid placement');
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

  return (
    <div className="flex-1 flex flex-col bg-linen overflow-hidden">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-ink text-white px-4 py-2.5 rounded-xl shadow-elevated border border-sand-400/20 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-sage-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Workspace Toolbar */}
      <div className="bg-white border-b border-sand-300 px-4 sm:px-6 py-2.5 flex items-center justify-between shrink-0 z-10">
        
        {/* Left: Floor Level Switcher & Undo/Redo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl border border-sand-200">
            {plan.floors?.map((f) => (
              <button
                key={f.level}
                onClick={() => {
                  setActiveFloorLevel(f.level);
                  setSelectedRoomId(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeFloorLevel === f.level
                    ? 'bg-sage-500 text-white shadow-subtle'
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

        {/* Center/Right: Geometry Status & Quick Links */}
        <div className="flex items-center gap-3">
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
              <span>Geometry Valid</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-terracotta-light text-terracotta-dark rounded-lg font-semibold text-[11px] border border-terracotta/30">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Spatial Conflict</span>
            </span>
          )}

          <Link
            to={`/projects/${project.id}/3d`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg text-xs font-semibold border border-sand-300 transition-colors"
          >
            <Box className="w-3.5 h-3.5 text-sage-700" />
            <span className="hidden sm:inline">3D View</span>
          </Link>
        </div>
      </div>

      {/* Tri-Panel Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Rooms Schedule */}
        <aside className="w-64 bg-white border-r border-sand-300 p-4 hidden lg:flex flex-col gap-3 overflow-y-auto shrink-0">
          <div className="flex items-center justify-between pb-2 border-b border-sand-200">
            <h3 className="font-display font-bold text-xs uppercase tracking-wider text-ink-muted">
              Rooms on Floor
            </h3>
            <span className="text-[10px] font-mono text-sage-800 bg-sage-100 px-1.5 py-0.5 rounded font-bold border border-sage-200">
              {rooms.length} Spaces
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1">
            {rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              const isHighlighted = highlightedRoomIds.includes(room.id);
              const area = Math.round(room.width * room.height);

              return (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-sage-50 border-sage-500 ring-2 ring-sage-500/20 shadow-subtle'
                      : isHighlighted
                      ? 'bg-terracotta-light/60 border-terracotta ring-2 ring-terracotta/30 animate-pulse'
                      : 'bg-linen border-sand-200 hover:border-sand-300 text-ink'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-xs text-ink truncate">
                      {room.label}
                    </span>
                    {room.type === 'pooja' && (
                      <span className="text-[9px] bg-sand-200 px-1 rounded font-bold text-ink">
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
        </aside>

        {/* Center: 2D Interactive Blueprint Canvas */}
        <main className="flex-1 relative flex flex-col overflow-hidden">
          <PlanCanvas
            floorPlan={plan}
            activeFloorLevel={activeFloorLevel}
            selectedRoomId={selectedRoomId}
            highlightedRoomIds={highlightedRoomIds}
            onSelectRoom={(room) => setSelectedRoomId(room.id)}
            onUpdateRoom={handleRoomUpdate}
          />
        </main>

        {/* Right Panel: AI Assistant & Room Inspector */}
        <aside className="w-80 bg-white border-l border-sand-300 flex flex-col shrink-0 overflow-y-auto">
          {selectedRoom ? (
            <div className="p-4 flex-1">
              <RoomInspector
                room={selectedRoom}
                plot={plan.plot || { width: 30, length: 50 }}
                onUpdateRoom={handleRoomUpdate}
                onClose={() => setSelectedRoomId(null)}
              />
            </div>
          ) : (
            <NaturalLanguageAssistant
              plan={project.design || plan}
              requirements={project.requirements || {}}
              onApplyMutation={handleApplyMutation}
              onPreviewMutation={handlePreviewMutation}
              onClearPreview={handleClearPreview}
            />
          )}
        </aside>

      </div>
    </div>
  );
};
