import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  Zap, 
  Layers, 
  MapPin, 
  Shapes, 
  Box, 
  Grid, 
  Maximize2, 
  Check, 
  Edit2, 
  ArrowRight, 
  RotateCcw,
  BookOpen,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { PlaceRoomsCanvas } from './PlaceRoomsCanvas.jsx';
import { ThreeScene } from '../visualization/ThreeScene.jsx';

export const PlaceRoomsWorkspace = ({
  initialPlot = { width: 30, length: 50, floors: 2, facing: 'north' },
  initialRooms = [],
  onBackToRoomList,
  onCompleteToResults,
}) => {
  // Unplaced vs Placed rooms state
  const [unplacedRooms, setUnplacedRooms] = useState([]);
  const [placedRooms, setPlacedRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [activeMode, setActiveMode] = useState('rooms'); // 'pin' | 'shape' | 'rooms'
  const [activeVariant, setActiveVariant] = useState('A');
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);
  const [is3DExpanded, setIs3DExpanded] = useState(false);

  // Initialize rooms from props
  useEffect(() => {
    if (initialRooms && initialRooms.length > 0) {
      // Place first 2 or 3 rooms on canvas as default matching Screenshot 1 & 2
      const toPlace = initialRooms.slice(0, 3);
      const toKeep = initialRooms.slice(3);

      const placedWithCoords = toPlace.map((r, idx) => {
        const plotW = initialPlot.width || 30;
        const plotL = initialPlot.length || 50;

        // Spread nicely near center
        let defaultX = Math.round(plotW / 2 - r.width / 2);
        let defaultY = Math.round(plotL / 2 - r.height / 2);

        if (idx === 0) defaultY = Math.max(2, defaultY - 8);
        if (idx === 1) defaultX = Math.max(2, defaultX - 6);
        if (idx === 2) {
          defaultX = Math.min(plotW - r.width - 2, defaultX + 5);
          defaultY = Math.min(plotL - r.height - 2, defaultY + 6);
        }

        return {
          ...r,
          x: defaultX,
          y: defaultY,
        };
      });

      setPlacedRooms(placedWithCoords);
      setUnplacedRooms(toKeep);
    } else {
      // Default fallback starter rooms matching Screenshot 1
      const defaultRooms = [
        { id: 'primary-bed-0', typeId: 'primary_bedroom', label: 'Primary Bedroom', width: 15, height: 15, x: 8, y: 10 },
        { id: 'bedroom-0', typeId: 'bedroom', label: 'Bedroom', width: 12, height: 12.6, x: 16, y: 22 },
        { id: 'primary-bath-0', typeId: 'primary_bathroom', label: 'Primary Bathroom', width: 8, height: 11, x: 10, y: 27 },
      ];
      setPlacedRooms(defaultRooms);
      setUnplacedRooms([
        { id: 'bathroom-0', typeId: 'bathroom', label: 'Bathroom', width: 7, height: 8.7, area: 61 },
        { id: 'primary-closet-0', typeId: 'primary_closet', label: 'Primary Closet', width: 7, height: 9, area: 62 },
        { id: 'bed-closet-0', typeId: 'bed_closet', label: 'Bed Closet', width: 4.5, height: 5.1, area: 23 },
      ]);
    }
  }, [initialRooms, initialPlot]);

  // Snapshot helper for Undo / Redo
  const pushHistory = () => {
    setHistoryPast((prev) => [structuredClone(placedRooms), ...prev].slice(0, 20));
    setHistoryFuture([]);
  };

  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const prev = historyPast[0];
    setHistoryFuture((fut) => [structuredClone(placedRooms), ...fut]);
    setHistoryPast((past) => past.slice(1));
    setPlacedRooms(prev);
  };

  const handleRedo = () => {
    if (historyFuture.length === 0) return;
    const next = historyFuture[0];
    setHistoryPast((past) => [structuredClone(placedRooms), ...past]);
    setHistoryFuture((fut) => fut.slice(1));
    setPlacedRooms(next);
  };

  // Move a room on the canvas
  const handleUpdateRoomPosition = (id, newX, newY) => {
    setPlacedRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, x: newX, y: newY } : r))
    );
  };

  // Resize a room on the canvas
  const handleUpdateRoomSize = (id, newW, newH) => {
    setPlacedRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, width: newW, height: newH } : r))
    );
  };

  // Place an unplaced room onto the canvas
  const handlePlaceRoom = (room) => {
    pushHistory();
    const plotW = initialPlot.width || 30;
    const plotL = initialPlot.length || 50;

    const w = room.width || 10;
    const h = room.height || 10;
    const newPlaced = {
      ...room,
      width: w,
      height: h,
      x: Math.max(2, Math.min(plotW - w - 2, Math.round(plotW / 2 - w / 2 + (placedRooms.length * 3) % 8))),
      y: Math.max(2, Math.min(plotL - h - 2, Math.round(plotL / 2 - h / 2 + (placedRooms.length * 4) % 10))),
    };

    setPlacedRooms((prev) => [...prev, newPlaced]);
    setUnplacedRooms((prev) => prev.filter((r) => r.id !== room.id));
    setSelectedRoomId(newPlaced.id);
  };

  // Return a placed room to the unplaced queue
  const handleUnplaceRoom = (id) => {
    pushHistory();
    const roomToReturn = placedRooms.find((r) => r.id === id);
    if (!roomToReturn) return;

    setPlacedRooms((prev) => prev.filter((r) => r.id !== id));
    setUnplacedRooms((prev) => [...prev, roomToReturn]);
    if (selectedRoomId === id) setSelectedRoomId(null);
  };

  // Metrics
  const totalRoomsCount = placedRooms.length + unplacedRooms.length;
  const placedPercent = totalRoomsCount > 0 ? Math.round((placedRooms.length / totalRoomsCount) * 100) : 0;
  const aiCreatePercent = 100 - placedPercent;

  const totalArea = placedRooms.reduce((acc, r) => acc + (r.width * r.height), 0);

  // Convert placed rooms into a FloorPlan object for the 3D model
  const liveFloorPlan = {
    plot: initialPlot,
    floors: [
      {
        level: 0,
        label: 'Ground Floor',
        rooms: placedRooms.map((r) => ({
          ...r,
          type: r.typeId || r.type || 'bedroom',
        })),
        furniture: [],
      },
    ],
  };

  const handleFurnishAndRender = () => {
    if (onCompleteToResults) {
      onCompleteToResults({
        plot: initialPlot,
        placedRooms,
        unplacedRooms,
        totalArea,
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] min-h-[700px] bg-[#FAF8F5] select-none overflow-hidden">
      
      {/* =========================================================================
          TOP STEPPER BAR (Matching Screenshot 2 Header)
         ========================================================================= */}
      <div className="bg-white border-b border-[#EAE6DF] px-6 py-3 flex items-center justify-between gap-4 shrink-0 z-30">
        
        {/* Left: Back Arrow to Step 1 */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToRoomList}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-600 hover:text-neutral-950 px-2 py-1 rounded-lg hover:bg-[#FAF8F5] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Place Rooms & Shape</span>
          </button>
        </div>

        {/* Center: 3-Step Wizard Progress Stepper matching Screenshot 2 */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={onBackToRoomList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold flex items-center justify-center">
              1
            </span>
            <span>Create Room List</span>
          </button>

          <span className="w-4 h-px bg-neutral-300" />

          {/* Active Step 2 Pill */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-950 text-white shadow-xs">
            <span className="w-4 h-4 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center">
              2
            </span>
            <span>Place Rooms & Shape</span>
          </div>

          <span className="w-4 h-px bg-neutral-300" />

          <button
            onClick={handleFurnishAndRender}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-neutral-400 hover:text-neutral-800 transition-colors"
          >
            <span className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-bold flex items-center justify-center">
              3
            </span>
            <span>Results</span>
          </button>
        </div>

        {/* Right: Quick Credits & Learn */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl text-xs font-medium text-neutral-700">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-[11px] font-mono font-semibold">4 left</span>
          </div>
        </div>

      </div>

      {/* =========================================================================
          MAIN WORKSPACE LAYOUT (Left Drawer + Center Canvas + Right 3D Panel)
         ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* -------------------------------------------------------------
            LEFT SIDEBAR: "My Rooms" & AI-Create Mix (Screenshot 1)
           ------------------------------------------------------------- */}
        <aside className="w-72 sm:w-80 bg-white border-r border-[#EAE6DF] p-5 flex flex-col justify-between overflow-y-auto shrink-0 z-20 shadow-xs">
          
          <div className="space-y-5">
            
            {/* My Rooms Title & Add Rooms Button matching Screenshot 1 */}
            <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                </div>
                <h3 className="font-serif text-sm font-bold text-neutral-900">
                  My Rooms
                </h3>
              </div>

              <button
                onClick={onBackToRoomList}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#DDD7CD] hover:border-neutral-950 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Rooms</span>
              </button>
            </div>

            {/* AI-Create Mix Gauge matching Screenshot 1 */}
            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#EAE6DF] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800">AI-Create Mix</span>
                <span className="text-[11px] font-serif font-bold text-[#9C753A]">
                  Best Balance ▾
                </span>
              </div>

              {/* Cyan Gradient Progress Bar */}
              <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${aiCreatePercent}%` }}
                  className="h-full bg-gradient-to-r from-[#BAE6FD] to-[#38BDF8] transition-all duration-300"
                />
                <div
                  style={{ width: `${placedPercent}%` }}
                  className="h-full bg-neutral-800 transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 font-semibold pt-0.5">
                <span>⚡ {aiCreatePercent}% AI-Create</span>
                <span>⏱ {placedPercent}% Placed by You</span>
              </div>
            </div>

            {/* Section: "Placed by You" matching Screenshot 1 */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-500">✋</span>
                  <span>Placed by You</span>
                </div>
                <span className="font-mono text-neutral-400">
                  {placedRooms.length} Rooms
                </span>
              </div>

              {placedRooms.length === 0 ? (
                <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#DDD7CD] text-center">
                  <p className="text-xs text-neutral-400 italic leading-relaxed">
                    Place rooms on canvas to control their specific location and shape.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                  {placedRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`
                        p-2 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition-all
                        ${
                          selectedRoomId === room.id
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                            : 'bg-white hover:bg-[#FAF8F5] border-[#EAE6DF] text-neutral-800'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-semibold truncate">{room.label}</span>
                        <span className="text-[10px] font-mono opacity-70">
                          {Math.round(room.width * room.height)} ft²
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnplaceRoom(room.id);
                        }}
                        className="text-neutral-400 hover:text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded hover:bg-white/20"
                        title="Return to unplaced queue"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section: "AI-Create" (Unplaced Rooms) matching Screenshot 1 */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-500">⚡</span>
                  <span>AI-Create Queue</span>
                </div>
                <span className="font-mono text-neutral-400">
                  {unplacedRooms.length} Rooms
                </span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-[180px] overflow-y-auto">
                {unplacedRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handlePlaceRoom(room)}
                    className="p-2.5 rounded-xl border border-[#DDD7CD] bg-[#FAF8F5] hover:bg-neutral-950 hover:text-white hover:border-neutral-950 text-left transition-all text-xs shadow-2xs group"
                    title="Click to drop onto canvas"
                  >
                    <div className="font-bold text-[11px] leading-tight">
                      {room.label}
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300">
                      {room.area || Math.round((room.width || 10) * (room.height || 10))} ft²
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Footprint Info */}
          <div className="pt-4 border-t border-[#F2EFE9] text-[11px] font-mono text-neutral-500 flex items-center justify-between">
            <span>Total <strong>{totalArea} ft²</strong></span>
            <span>•</span>
            <span>Plot <strong>{initialPlot.width}×{initialPlot.length} ft</strong></span>
          </div>

        </aside>

        {/* -------------------------------------------------------------
            CENTER: The Moveable PlaceRoomsCanvas
           ------------------------------------------------------------- */}
        <div className="flex-1 relative flex flex-col">
          
          <PlaceRoomsCanvas
            plot={initialPlot}
            rooms={placedRooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={(id) => setSelectedRoomId(id)}
            onUpdateRoomPosition={handleUpdateRoomPosition}
            onUpdateRoomSize={handleUpdateRoomSize}
            onRemoveRoom={handleUnplaceRoom}
            snapEnabled={snapEnabled}
            onToggleSnap={() => setSnapEnabled(!snapEnabled)}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyPast.length > 0}
            canRedo={historyFuture.length > 0}
          />

          {/* Bottom Metric & Action Bar matching Screenshot 2 */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
            
            {/* Metric Pill matching Screenshot 2: "Total 511 ft² | Heated -- | -- Rooms" */}
            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border border-[#EAE6DF] shadow-md flex items-center gap-3 text-xs font-mono text-neutral-700">
              <span>Total <strong>{totalArea} ft²</strong></span>
              <span className="text-neutral-300">•</span>
              <span>Heated <strong>{totalArea} ft²</strong></span>
              <span className="text-neutral-300">•</span>
              <span><strong>{placedRooms.length}</strong> Placed</span>
            </div>

            {/* "Furnish & Render" Primary Action Button matching Screenshot 2 */}
            <button
              onClick={handleFurnishAndRender}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-2xl text-xs font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Furnish & Render</span>
            </button>

          </div>

          {/* Bottom Concept Variants Carousel matching Screenshot 2 */}
          <div className="absolute bottom-5 left-6 z-20 hidden md:flex items-center gap-2">
            {['A', 'B', 'C', 'D', 'E'].map((variant) => (
              <button
                key={variant}
                onClick={() => setActiveVariant(variant)}
                className={`
                  w-10 h-12 rounded-2xl border flex flex-col items-center justify-center transition-all shadow-2xs
                  ${
                    activeVariant === variant
                      ? 'bg-white border-neutral-950 ring-2 ring-neutral-950/20 font-bold'
                      : 'bg-white/90 border-[#EAE6DF] text-neutral-500 hover:bg-white'
                  }
                `}
              >
                <span className="text-xs font-serif font-bold">{variant}</span>
                {variant === 'A' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                ) : (
                  <span className="text-[8px] opacity-40">⏳</span>
                )}
              </button>
            ))}
          </div>

        </div>

        {/* -------------------------------------------------------------
            RIGHT FLOATING PANEL: Real-time 3D Model Window (Screenshot 2)
           ------------------------------------------------------------- */}
        <aside className="w-72 sm:w-88 bg-white border-l border-[#EAE6DF] p-4 hidden lg:flex flex-col justify-between shrink-0 z-20 shadow-xs">
          
          {/* Header of 3D card */}
          <div className="flex items-center justify-between pb-3 border-b border-[#F2EFE9]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-950 text-white text-[10px] font-serif font-bold flex items-center justify-center">
                A
              </span>
              <h4 className="font-serif text-xs font-bold text-neutral-900">
                Procedural 3D Model Preview
              </h4>
            </div>

            <button
              onClick={() => setIs3DExpanded(!is3DExpanded)}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-[#FAF8F5]"
              title="Expand 3D View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3D Viewport matching Screenshot 2 right box */}
          <div className="flex-1 rounded-2xl bg-[#F5F2EC] border border-[#EAE6DF] overflow-hidden relative my-3 flex items-center justify-center">
            {placedRooms.length > 0 ? (
              <div className="w-full h-full">
                <ThreeScene 
                  floorPlan={liveFloorPlan} 
                  visibleFloorLevel={0}
                  showFurniture={false}
                  showLabels={true}
                />
              </div>
            ) : (
              <div className="text-center p-6 space-y-2">
                <div className="w-8 h-8 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin mx-auto" />
                <p className="text-xs text-neutral-500 font-mono">
                  Building 3D model...
                </p>
              </div>
            )}

            {/* Left Height Ruler scale matching Screenshot 2 */}
            <div className="absolute left-2 top-4 bottom-4 w-1.5 flex flex-col justify-between opacity-30 pointer-events-none font-mono text-[8px]">
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
              <span>-</span>
            </div>
          </div>

          {/* Bottom 3D Status */}
          <div className="pt-2 border-t border-[#F2EFE9] flex items-center justify-between text-xs text-neutral-500">
            <span>R3F Real-Time Massing</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Live Sync
            </span>
          </div>

        </aside>

      </div>

    </div>
  );
};
