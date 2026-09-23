import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  Ruler, 
  Layers,
  CheckCircle2, 
  AlertTriangle,
  Grid as GridIcon,
  Eye,
  EyeOff,
  Move,
  RotateCw,
  Trash2,
  Armchair,
  Sparkles
} from 'lucide-react';
import { validateRoomMutation } from '../../domain/constraints.js';
import { CadDoorSymbol, CadWindowSymbol, CadDimensionString } from '../../lib/cadSymbols.jsx';
import { CadFurnitureSymbol } from '../../lib/furnitureSymbols.jsx';

export const getRoomFloorStyle = (room, isRealistic) => {
  if (!isRealistic) {
    return { backgroundColor: room.color || '#F8FAFC' };
  }

  const type = (room.type || '').toLowerCase();
  
  // Bedroom / Master Bedroom: Warm light oak wood planks
  if (type.includes('bedroom') || type === 'master_bedroom') {
    return {
      backgroundColor: '#F3EDE2',
      backgroundImage: `
        repeating-linear-gradient(90deg, transparent 0px, transparent 18px, rgba(160, 130, 95, 0.15) 19px, rgba(160, 130, 95, 0.15) 20px),
        repeating-linear-gradient(0deg, #F3EDE2 0px, #F3EDE2 90px, #EBE1D0 91px, #EBE1D0 92px)
      `,
    };
  }

  // Living / Dining / Hall: Elegant wide-plank Scandinavian natural wood
  if (type === 'living' || type === 'dining' || type === 'foyer' || type === 'drawing') {
    return {
      backgroundColor: '#F4ECE1',
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent 0px, transparent 22px, rgba(140, 110, 75, 0.14) 23px, rgba(140, 110, 75, 0.14) 24px),
        repeating-linear-gradient(90deg, #F4ECE1 0px, #F4ECE1 110px, #EDE2D1 111px, #EDE2D1 112px)
      `,
    };
  }

  // Kitchen / Utility: Italian polished light marble tile
  if (type === 'kitchen' || type === 'utility' || type === 'pantry') {
    return {
      backgroundColor: '#F8FAFC',
      backgroundImage: `
        radial-gradient(circle at 50% 50%, rgba(203, 213, 225, 0.4) 0%, transparent 60%),
        repeating-linear-gradient(0deg, #F8FAFC 0px, #F8FAFC 28px, #E2E8F0 29px, #E2E8F0 30px),
        repeating-linear-gradient(90deg, #F8FAFC 0px, #F8FAFC 28px, #E2E8F0 29px, #E2E8F0 30px)
      `,
    };
  }

  // Bathrooms: Clean cool marble porcelain tiles
  if (type === 'bathroom' || type === 'toilet' || type === 'powder') {
    return {
      backgroundColor: '#F0F9FF',
      backgroundImage: `
        radial-gradient(circle at 40% 40%, rgba(186, 230, 253, 0.5) 0%, transparent 70%),
        repeating-linear-gradient(0deg, #F0F9FF 0px, #F0F9FF 20px, #BAE6FD 21px, #BAE6FD 22px),
        repeating-linear-gradient(90deg, #F0F9FF 0px, #F0F9FF 20px, #BAE6FD 21px, #BAE6FD 22px)
      `,
    };
  }

  // Balcony / Patio / Terrace / Deck: Stone pavers with texture
  if (type === 'balcony' || type === 'terrace' || type === 'patio' || type === 'deck') {
    return {
      backgroundColor: '#E2E8F0',
      backgroundImage: `
        radial-gradient(#94A3B8 15%, transparent 16%),
        radial-gradient(#94A3B8 15%, transparent 16%)
      `,
      backgroundPosition: '0 0, 8px 8px',
      backgroundSize: '16px 16px',
    };
  }

  // Parking / Garage: Polished concrete screed floor
  if (type === 'parking' || type === 'garage' || type === 'carporch') {
    return {
      backgroundColor: '#CBD5E1',
      backgroundImage: 'linear-gradient(135deg, #E2E8F0 25%, #CBD5E1 75%)',
    };
  }

  // Pooja: Sacred warm ivory & sandalwood
  if (type === 'pooja') {
    return {
      backgroundColor: '#FEF9C3',
      backgroundImage: 'radial-gradient(circle, #FEF08A 10%, #FEF9C3 80%)',
    };
  }

  // Study / Office: Warm amber parquet
  if (type === 'study' || type === 'office') {
    return {
      backgroundColor: '#EDE3D2',
      backgroundImage: `
        repeating-linear-gradient(45deg, #E2D5BE 0px, #E2D5BE 10px, #EDE3D2 10px, #EDE3D2 20px)
      `,
    };
  }

  return {
    backgroundColor: room.color || '#F8FAFC',
  };
};

export const PlanCanvas = ({
  floorPlan,
  activeFloorLevel = 0,
  selectedRoomId = null,
  highlightedRoomIds = [],
  selectedFurnitureId = null,
  renderMode = 'cad', // 'cad' | 'rendered'
  onSelectRoom,
  onUpdateRoom,
  onSelectFurniture,
  onUpdateFurniture,
  onRemoveFurniture,
  readOnly = false,
}) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Layer Visibility Toggles
  const [showRealisticRender, setShowRealisticRender] = useState(renderMode === 'rendered');
  const [showDimensions, setShowDimensions] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showOpenings, setShowOpenings] = useState(true);
  const [showFurniture, setShowFurniture] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showWallThickness, setShowWallThickness] = useState(true);
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  useEffect(() => {
    if (renderMode === 'rendered') {
      setShowRealisticRender(true);
    } else if (renderMode === 'cad') {
      setShowRealisticRender(false);
    }
  }, [renderMode]);

  // Direct Drag / Resize states for Rooms
  const [draggingRoomId, setDraggingRoomId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingRoomId, setResizingRoomId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [collisionWarning, setCollisionWarning] = useState(null);

  // Direct Drag states for Furniture
  const [draggingFurnitureId, setDraggingFurnitureId] = useState(null);
  const [furnitureDragOffset, setFurnitureDragOffset] = useState({ x: 0, y: 0 });

  const plot = floorPlan?.plot || { width: 30, length: 50, roadSide: 'north', facing: 'north' };
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const currentFloor = floorPlan?.floors?.find(f => f.level === activeFloorLevel) || floorPlan?.floors?.[0] || { rooms: [], openings: [], furniture: [] };
  const rooms = currentFloor.rooms || [];
  const openings = currentFloor.openings || [];

  // Aggregate furniture from floor level + rooms
  const floorFurniture = [
    ...(currentFloor.furniture || []),
    ...rooms.flatMap(r => (r.furniture || []).map(f => ({ ...f, roomId: f.roomId || r.id })))
  ];
  // Deduplicate by ID
  const uniqueFurniture = Array.from(new Map(floorFurniture.map(f => [f.id, f])).values());

  const BASE_PIXELS = 14;
  const canvasWidth = plotW * BASE_PIXELS;
  const canvasHeight = plotL * BASE_PIXELS;

  // Outer padding for dimension chains
  const PADDING_TOP = 40;
  const PADDING_LEFT = 45;
  const PADDING_RIGHT = 35;
  const PADDING_BOTTOM = 40;

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth || 700;
      const containerHeight = containerRef.current.clientHeight || 550;
      const totalCanvasW = canvasWidth + PADDING_LEFT + PADDING_RIGHT;
      const totalCanvasH = canvasHeight + PADDING_TOP + PADDING_BOTTOM;

      const scaleX = (containerWidth - 60) / totalCanvasW;
      const scaleY = (containerHeight - 60) / totalCanvasH;
      const initialScale = Math.min(Math.max(0.6, Math.min(scaleX, scaleY)), 1.8);
      setScale(initialScale);
      setPan({
        x: (containerWidth - totalCanvasW * initialScale) / 2,
        y: (containerHeight - totalCanvasH * initialScale) / 2,
      });
    }
  }, [canvasWidth, canvasHeight, activeFloorLevel]);

  const handleMouseDownBackdrop = (e) => {
    if (e.target === containerRef.current || e.target.id === 'canvas-backdrop' || e.target.id === 'svg-canvas-root') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      if (onSelectFurniture) onSelectFurniture(null);
    }
  };

  const handleStartDragRoom = (e, room) => {
    if (readOnly) return;
    e.stopPropagation();
    if (onSelectRoom) onSelectRoom(room);
    if (onSelectFurniture) onSelectFurniture(null);

    setDraggingRoomId(room.id);
    const canvasRect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left - pan.x) / scale - PADDING_LEFT;
    const mouseY = (e.clientY - canvasRect.top - pan.y) / scale - PADDING_TOP;

    setDragOffset({
      x: mouseX - room.x * BASE_PIXELS,
      y: mouseY - room.y * BASE_PIXELS,
    });
  };

  const handleStartDragFurniture = (e, furn) => {
    if (readOnly) return;
    e.stopPropagation();
    if (onSelectFurniture) onSelectFurniture(furn.id);

    setDraggingFurnitureId(furn.id);
    const canvasRect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left - pan.x) / scale - PADDING_LEFT;
    const mouseY = (e.clientY - canvasRect.top - pan.y) / scale - PADDING_TOP;

    setFurnitureDragOffset({
      x: mouseX - furn.x * BASE_PIXELS,
      y: mouseY - furn.y * BASE_PIXELS,
    });
  };

  const handleStartResize = (e, room) => {
    if (readOnly) return;
    e.stopPropagation();
    setResizingRoomId(room.id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: room.width,
      h: room.height,
    });
  };

  const handleGlobalMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    } else if (draggingFurnitureId) {
      const canvasRect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - canvasRect.left - pan.x) / scale - PADDING_LEFT;
      const mouseY = (e.clientY - canvasRect.top - pan.y) / scale - PADDING_TOP;

      const targetFurn = uniqueFurniture.find(f => f.id === draggingFurnitureId);
      if (!targetFurn) return;

      const rawFtX = (mouseX - furnitureDragOffset.x) / BASE_PIXELS;
      const rawFtY = (mouseY - furnitureDragOffset.y) / BASE_PIXELS;
      const snapFtX = Math.round(rawFtX * 2) / 2;
      const snapFtY = Math.round(rawFtY * 2) / 2;

      const newFtX = Math.max(0, Math.min(plotW - targetFurn.width, snapFtX));
      const newFtY = Math.max(0, Math.min(plotL - targetFurn.length, snapFtY));

      if (newFtX !== targetFurn.x || newFtY !== targetFurn.y) {
        if (onUpdateFurniture) {
          onUpdateFurniture({ ...targetFurn, x: newFtX, y: newFtY });
        }
      }
    } else if (draggingRoomId) {
      const canvasRect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - canvasRect.left - pan.x) / scale - PADDING_LEFT;
      const mouseY = (e.clientY - canvasRect.top - pan.y) / scale - PADDING_TOP;

      const targetRoom = rooms.find(r => r.id === draggingRoomId);
      if (!targetRoom) return;

      // Snap to 0.5 ft intervals
      const rawFtX = (mouseX - dragOffset.x) / BASE_PIXELS;
      const rawFtY = (mouseY - dragOffset.y) / BASE_PIXELS;
      const snapFtX = Math.round(rawFtX * 2) / 2;
      const snapFtY = Math.round(rawFtY * 2) / 2;

      const newFtX = Math.max(0, Math.min(plotW - targetRoom.width, snapFtX));
      const newFtY = Math.max(0, Math.min(plotL - targetRoom.height, snapFtY));

      if (newFtX !== targetRoom.x || newFtY !== targetRoom.y) {
        const candidate = { ...targetRoom, x: newFtX, y: newFtY };
        const validation = validateRoomMutation(floorPlan, activeFloorLevel, candidate);

        if (validation.valid) {
          setCollisionWarning(null);
          if (onUpdateRoom) onUpdateRoom(candidate);
        } else {
          setCollisionWarning(validation.error);
        }
      }
    } else if (resizingRoomId) {
      const targetRoom = rooms.find(r => r.id === resizingRoomId);
      if (!targetRoom) return;

      const deltaXFt = Math.round(((e.clientX - resizeStart.x) / (BASE_PIXELS * scale)) * 2) / 2;
      const deltaYFt = Math.round(((e.clientY - resizeStart.y) / (BASE_PIXELS * scale)) * 2) / 2;

      const newW = Math.max(4, Math.min(plotW - targetRoom.x, resizeStart.w + deltaXFt));
      const newH = Math.max(4, Math.min(plotL - targetRoom.y, resizeStart.h + deltaYFt));

      if (newW !== targetRoom.width || newH !== targetRoom.height) {
        const candidate = { ...targetRoom, width: newW, height: newH };
        const validation = validateRoomMutation(floorPlan, activeFloorLevel, candidate);

        if (validation.valid) {
          setCollisionWarning(null);
          if (onUpdateRoom) onUpdateRoom(candidate);
        } else {
          setCollisionWarning(validation.error);
        }
      }
    }
  };

  const handleGlobalMouseUp = () => {
    setIsPanning(false);
    setDraggingRoomId(null);
    setDraggingFurnitureId(null);
    setResizingRoomId(null);
    setTimeout(() => setCollisionWarning(null), 2500);
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDownBackdrop}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair flex items-center justify-center ${
        showGrid ? 'bg-blueprint-grid' : 'bg-[#F8FAFC]'
      }`}
      id="canvas-backdrop"
    >
      
      {/* Collision Alert Toast */}
      {collisionWarning && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-terracotta text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-elevated flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{collisionWarning} (Snapping back)</span>
        </div>
      )}

      {/* Floating Canvas Navigation & Zoom Controls */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl border border-sand-300 shadow-elevated text-xs">
        <button
          onClick={() => setScale(prev => Math.min(prev + 0.15, 2.8))}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-sand-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale(prev => Math.max(prev - 0.15, 0.4))}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-sand-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="h-4 w-px bg-sand-300" />
        <button
          onClick={() => {
            const containerWidth = containerRef.current.clientWidth || 700;
            const containerHeight = containerRef.current.clientHeight || 550;
            const totalCanvasW = canvasWidth + PADDING_LEFT + PADDING_RIGHT;
            const totalCanvasH = canvasHeight + PADDING_TOP + PADDING_BOTTOM;
            const s = Math.min((containerWidth - 60) / totalCanvasW, (containerHeight - 60) / totalCanvasH);
            setScale(s);
            setPan({ x: (containerWidth - totalCanvasW * s) / 2, y: (containerHeight - totalCanvasH * s) / 2 });
          }}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-sand-100 rounded-lg transition-colors"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <span className="font-semibold text-[11px] text-ink-muted px-1.5 min-w-[38px] text-center">
          {Math.round(scale * 100)}%
        </span>

        <div className="h-4 w-px bg-sand-300" />

        {/* Realistic Architectural Render Mode Toggle */}
        <button
          onClick={() => setShowRealisticRender(!showRealisticRender)}
          className={`p-1.5 px-2.5 rounded-lg transition-all flex items-center gap-1.5 text-xs font-bold ${
            showRealisticRender
              ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-500/30'
              : 'text-ink-muted hover:text-ink hover:bg-sand-100'
          }`}
          title="Toggle Full Realistic Rendered Floor Plan View"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showRealisticRender ? 'Rendered Plan' : 'CAD Mode'}</span>
        </button>

        <div className="h-4 w-px bg-sand-300" />

        {/* Layer Visibility Menu */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              showLayerMenu ? 'bg-sand-200 text-ink' : 'text-ink-muted hover:text-ink hover:bg-sand-100'
            }`}
            title="CAD Layer Visibility"
          >
            <Layers className="w-4 h-4" />
            <span className="text-[11px] font-medium hidden sm:inline">Layers</span>
          </button>

          {showLayerMenu && (
            <div className="absolute top-9 left-0 w-52 bg-white/98 backdrop-blur border border-sand-300 rounded-xl shadow-xl p-2.5 flex flex-col gap-1.5 z-40 animate-in fade-in zoom-in-95">
              <span className="text-[10px] uppercase font-bold text-ink-muted px-2 py-1 tracking-wider border-b border-sand-200">
                CAD Layer Controls
              </span>
              <label className="flex items-center justify-between px-2 py-1.5 text-xs text-ink hover:bg-sand-50 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-slate-500" />
                  Dimensions
                </span>
                <input 
                  type="checkbox" 
                  checked={showDimensions} 
                  onChange={e => setShowDimensions(e.target.checked)}
                  className="rounded text-sage-600 focus:ring-sage-500" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 text-xs text-ink hover:bg-sand-50 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Armchair className="w-3.5 h-3.5 text-sage-600" />
                  Interior Furniture
                </span>
                <input 
                  type="checkbox" 
                  checked={showFurniture} 
                  onChange={e => setShowFurniture(e.target.checked)}
                  className="rounded text-sage-600 focus:ring-sage-500" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 text-xs text-ink hover:bg-sand-50 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  Room Labels & Area
                </span>
                <input 
                  type="checkbox" 
                  checked={showLabels} 
                  onChange={e => setShowLabels(e.target.checked)}
                  className="rounded text-sage-600 focus:ring-sage-500" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 text-xs text-ink hover:bg-sand-50 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 flex items-center justify-center font-bold text-[10px] text-amber-600 border border-amber-500 rounded-sm">D</span>
                  Doors & Windows
                </span>
                <input 
                  type="checkbox" 
                  checked={showOpenings} 
                  onChange={e => setShowOpenings(e.target.checked)}
                  className="rounded text-sage-600 focus:ring-sage-500" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 text-xs text-ink hover:bg-sand-50 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <GridIcon className="w-3.5 h-3.5 text-slate-500" />
                  Background Grid
                </span>
                <input 
                  type="checkbox" 
                  checked={showGrid} 
                  onChange={e => setShowGrid(e.target.checked)}
                  className="rounded text-sage-600 focus:ring-sage-500" 
                />
              </label>
              <label className="flex items-center justify-between px-2 py-1.5 text-xs text-ink hover:bg-sand-50 rounded-lg cursor-pointer">
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 bg-slate-700 rounded-sm inline-block" />
                  Double-Line Walls
                </span>
                <input 
                  type="checkbox" 
                  checked={showWallThickness} 
                  onChange={e => setShowWallThickness(e.target.checked)}
                  className="rounded text-sage-600 focus:ring-sage-500" 
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Plot Orientation Compass */}
      <div className="absolute top-4 right-4 z-30 bg-white/95 backdrop-blur px-3.5 py-2 rounded-xl border border-sand-300 shadow-elevated text-xs flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[11px] shadow-sm tracking-tighter">
          N
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-ink-muted block leading-none">Orientation</span>
          <span className="font-bold text-ink text-xs capitalize">{plot.facing || 'North'} Facing</span>
        </div>
      </div>

      {/* Scalable Architectural Canvas Container */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'top left',
          width: `${canvasWidth + PADDING_LEFT + PADDING_RIGHT}px`,
          height: `${canvasHeight + PADDING_TOP + PADDING_BOTTOM}px`,
          transition: isPanning || draggingRoomId || draggingFurnitureId || resizingRoomId ? 'none' : 'transform 0.05s ease-out',
        }}
        className="relative"
      >
        {/* SVG Architectural Dimension Strings & Exterior Lines */}
        {showDimensions && (
          <svg
            className="absolute inset-0 pointer-events-none z-20 overflow-visible"
            width={canvasWidth + PADDING_LEFT + PADDING_RIGHT}
            height={canvasHeight + PADDING_TOP + PADDING_BOTTOM}
            id="svg-canvas-root"
          >
            {/* Top Outer Dimension (Total Plot Width) */}
            <CadDimensionString
              x1={PADDING_LEFT}
              y1={PADDING_TOP - 16}
              x2={PADDING_LEFT + canvasWidth}
              y2={PADDING_TOP - 16}
              label={`${plotW}' - 0"`}
              orientation="horizontal"
            />

            {/* Left Outer Dimension (Total Plot Length) */}
            <CadDimensionString
              x1={PADDING_LEFT - 16}
              y1={PADDING_TOP}
              x2={PADDING_LEFT - 16}
              y2={PADDING_TOP + canvasHeight}
              label={`${plotL}' - 0"`}
              orientation="vertical"
            />

            {/* Selected Room Dimension Callout Strings */}
            {selectedRoom && (
              <>
                {/* Room Top Span */}
                <CadDimensionString
                  x1={PADDING_LEFT + selectedRoom.x * BASE_PIXELS}
                  y1={PADDING_TOP + selectedRoom.y * BASE_PIXELS - 6}
                  x2={PADDING_LEFT + (selectedRoom.x + selectedRoom.width) * BASE_PIXELS}
                  y2={PADDING_TOP + selectedRoom.y * BASE_PIXELS - 6}
                  label={`${selectedRoom.width}'`}
                  orientation="horizontal"
                  tickSize={3}
                />
                {/* Room Left Span */}
                <CadDimensionString
                  x1={PADDING_LEFT + selectedRoom.x * BASE_PIXELS - 6}
                  y1={PADDING_TOP + selectedRoom.y * BASE_PIXELS}
                  x2={PADDING_LEFT + selectedRoom.x * BASE_PIXELS - 6}
                  y2={PADDING_TOP + (selectedRoom.y + selectedRoom.height) * BASE_PIXELS}
                  label={`${selectedRoom.height}'`}
                  orientation="vertical"
                  tickSize={3}
                />
              </>
            )}
          </svg>
        )}

        {/* Blueprint Layout Card Box */}
        <div
          style={{
            position: 'absolute',
            left: `${PADDING_LEFT}px`,
            top: `${PADDING_TOP}px`,
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
          }}
          className={`bg-white shadow-2xl rounded-sm ${
            showWallThickness ? 'border-4 border-slate-900 ring-2 ring-slate-400' : 'border-2 border-ink'
          }`}
        >
          {/* Front Road Header */}
          <div className="absolute -top-7 left-0 right-0 h-6 bg-slate-800 text-white rounded-t flex items-center justify-center text-[10px] uppercase tracking-wider font-bold shadow-sm">
            🛣️ Road ({plot.roadSide || 'North'}) • Plot Width: {plotW} ft
          </div>

          {/* Setback Regulatory Boundary Line */}
          <div 
            className="absolute border-2 border-dashed border-amber-600/40 pointer-events-none"
            style={{
              top: `${(plot.setbacks?.front || 3) * BASE_PIXELS}px`,
              left: `${(plot.setbacks?.left || 2) * BASE_PIXELS}px`,
              right: `${(plot.setbacks?.right || 2) * BASE_PIXELS}px`,
              bottom: `${(plot.setbacks?.rear || 3) * BASE_PIXELS}px`,
            }}
          >
            <span className="absolute top-1 left-1.5 text-[8px] uppercase tracking-wider font-bold text-amber-700/60 bg-amber-50/80 px-1 rounded">
              Setback Envelope
            </span>
          </div>

          {/* Rooms Rendering */}
          {rooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const isHighlighted = highlightedRoomIds.includes(room.id);
            const roomArea = Math.round(room.width * room.height);

            const floorStyle = getRoomFloorStyle(room, showRealisticRender);

            return (
              <div
                key={room.id}
                onMouseDown={(e) => handleStartDragRoom(e, room)}
                style={{
                  left: `${room.x * BASE_PIXELS}px`,
                  top: `${room.y * BASE_PIXELS}px`,
                  width: `${room.width * BASE_PIXELS}px`,
                  height: `${room.height * BASE_PIXELS}px`,
                  ...floorStyle,
                }}
                className={`absolute transition-shadow flex flex-col justify-between p-2 select-none group cursor-move ${
                  showRealisticRender
                    ? 'border-[4px] border-slate-950 shadow-inner'
                    : showWallThickness
                    ? 'border-[3px] border-slate-800'
                    : 'border-2 border-ink'
                } ${
                  isSelected
                    ? 'border-sage-600 ring-4 ring-sage-500/25 z-10 shadow-xl'
                    : isHighlighted
                    ? 'border-terracotta ring-4 ring-terracotta/30 z-10 animate-pulse'
                    : showRealisticRender
                    ? 'hover:border-slate-800'
                    : 'hover:border-sage-500 hover:shadow-md'
                }`}
              >
                {/* Room Name Header & Vastu Badge */}
                {showLabels && (
                  <div className="flex items-center justify-between pointer-events-none">
                    <span className={`font-display font-bold text-[11px] leading-tight truncate pr-1 ${
                      showRealisticRender ? 'text-slate-900 bg-white/80 px-1.5 py-0.5 rounded shadow-2xs backdrop-blur-xs' : 'text-slate-900'
                    }`}>
                      {room.label}
                    </span>
                    {room.type === 'pooja' && (
                      <span className="text-[8px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-bold shrink-0 border border-amber-300">
                        NE
                      </span>
                    )}
                    {room.type === 'kitchen' && (
                      <span className="text-[8px] bg-red-100 text-red-900 px-1 py-0.2 rounded font-bold shrink-0 border border-red-300">
                        SE
                      </span>
                    )}
                  </div>
                )}

                {/* Room Dimensions & Area Badge */}
                {showLabels && (
                  <div className={`font-sans text-[10px] font-semibold flex items-center justify-between pt-1 pointer-events-none ${
                    showRealisticRender ? 'text-slate-800' : 'text-slate-600 border-t border-slate-900/10'
                  }`}>
                    <span className={showRealisticRender ? 'bg-white/70 px-1 py-0.5 rounded text-[9px]' : ''}>
                      {room.width}&apos; × {room.height}&apos;
                    </span>
                    <span className="font-bold text-slate-900 bg-white/90 px-1.5 py-0.5 rounded shadow-2xs text-[9px]">
                      {roomArea} sq.ft
                    </span>
                  </div>
                )}

                {/* Resize Handle at Bottom-Right corner */}
                {isSelected && !readOnly && (
                  <div
                    onMouseDown={(e) => handleStartResize(e, room)}
                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-sage-600 border-2 border-white rounded-full cursor-se-resize z-30 shadow-subtle hover:scale-125 transition-transform"
                    title="Drag to resize room width & length"
                  />
                )}
              </div>
            );
          })}

          {/* Staged Furniture Items */}
          {showFurniture && uniqueFurniture.map((furn) => {
            const isSelected = selectedFurnitureId === furn.id;
            const furnW = furn.width * BASE_PIXELS;
            const furnL = furn.length * BASE_PIXELS;

            return (
              <div
                key={furn.id}
                onMouseDown={(e) => handleStartDragFurniture(e, furn)}
                style={{
                  left: `${furn.x * BASE_PIXELS}px`,
                  top: `${furn.y * BASE_PIXELS}px`,
                  width: `${furnW}px`,
                  height: `${furnL}px`,
                }}
                className={`absolute z-20 cursor-move select-none group ${
                  isSelected ? 'ring-2 ring-sage-600 ring-offset-1 z-30 shadow-lg' : 'hover:ring-1 hover:ring-sage-400'
                }`}
              >
                <CadFurnitureSymbol
                  type={furn.type}
                  widthPx={furnW}
                  lengthPx={furnL}
                  rotation={furn.rotation || 0}
                />

                {/* Floating Quick Action Pill for Selected Furniture */}
                {isSelected && !readOnly && (
                  <div 
                    className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-lg px-1.5 py-0.5 flex items-center gap-1 shadow-elevated z-40 animate-in fade-in zoom-in-95"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => {
                        if (onUpdateFurniture) {
                          onUpdateFurniture({
                            ...furn,
                            rotation: ((furn.rotation || 0) + 90) % 360,
                          });
                        }
                      }}
                      className="p-1 hover:bg-slate-700 rounded text-slate-200 hover:text-white transition-colors"
                      title="Rotate 90°"
                    >
                      <RotateCw className="w-3 h-3" />
                    </button>
                    <div className="w-px h-3 bg-slate-700" />
                    <button
                      onClick={() => {
                        if (onRemoveFurniture) onRemoveFurniture(furn.id);
                      }}
                      className="p-1 hover:bg-red-600 rounded text-red-300 hover:text-white transition-colors"
                      title="Remove Furniture"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Architectural Door & Window CAD Openings */}
          {showOpenings && openings.map((op) => {
            const parentRoom = rooms.find(r => r.id === op.wallRoomId);
            if (!parentRoom) return null;

            const parentLeft = parentRoom.x * BASE_PIXELS;
            const parentTop = parentRoom.y * BASE_PIXELS;
            const opOffset = op.offset * BASE_PIXELS;
            const opWidthPx = (op.width || 3) * BASE_PIXELS;

            let containerStyle = {};
            let isDoor = op.type === 'door';

            if (op.wallSide === 'top') {
              containerStyle = { left: `${parentLeft + opOffset}px`, top: `${parentTop - (isDoor ? opWidthPx : 5)}px` };
            } else if (op.wallSide === 'bottom') {
              containerStyle = { left: `${parentLeft + opOffset}px`, top: `${parentTop + parentRoom.height * BASE_PIXELS - 5}px` };
            } else if (op.wallSide === 'left') {
              containerStyle = { left: `${parentLeft - (isDoor ? opWidthPx : 5)}px`, top: `${parentTop + opOffset}px` };
            } else if (op.wallSide === 'right') {
              containerStyle = { left: `${parentLeft + parentRoom.width * BASE_PIXELS - 5}px`, top: `${parentTop + opOffset}px` };
            }

            return (
              <div
                key={op.id}
                style={containerStyle}
                className="absolute z-30 pointer-events-none"
              >
                {isDoor ? (
                  <CadDoorSymbol 
                    wallSide={op.wallSide} 
                    widthPx={opWidthPx} 
                    doorType={op.doorType || 'single'} 
                  />
                ) : (
                  <CadWindowSymbol 
                    widthPx={opWidthPx} 
                    orientation={op.wallSide === 'left' || op.wallSide === 'right' ? 'vertical' : 'horizontal'} 
                  />
                )}
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};
