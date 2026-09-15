import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  Ruler,
  Move,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { validateRoomMutation } from '../../domain/constraints.js';

export const PlanCanvas = ({
  floorPlan,
  activeFloorLevel = 0,
  selectedRoomId = null,
  highlightedRoomIds = [],
  onSelectRoom,
  onUpdateRoom,
  readOnly = false,
}) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Direct Drag / Resize states
  const [draggingRoomId, setDraggingRoomId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingRoomId, setResizingRoomId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [collisionWarning, setCollisionWarning] = useState(null);

  const plot = floorPlan?.plot || { width: 30, length: 50, roadSide: 'north', facing: 'north' };
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const currentFloor = floorPlan?.floors?.find(f => f.level === activeFloorLevel) || floorPlan?.floors?.[0] || { rooms: [], openings: [] };
  const rooms = currentFloor.rooms || [];
  const openings = currentFloor.openings || [];

  const BASE_PIXELS = 14;
  const canvasWidth = plotW * BASE_PIXELS;
  const canvasHeight = plotL * BASE_PIXELS;

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth || 600;
      const containerHeight = containerRef.current.clientHeight || 500;
      const scaleX = (containerWidth - 80) / canvasWidth;
      const scaleY = (containerHeight - 80) / canvasHeight;
      const initialScale = Math.min(Math.max(0.6, Math.min(scaleX, scaleY)), 1.8);
      setScale(initialScale);
      setPan({
        x: (containerWidth - canvasWidth * initialScale) / 2,
        y: (containerHeight - canvasHeight * initialScale) / 2,
      });
    }
  }, [canvasWidth, canvasHeight, activeFloorLevel]);

  const handleMouseDownBackdrop = (e) => {
    if (e.target === containerRef.current || e.target.id === 'canvas-backdrop') {
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleStartDrag = (e, room) => {
    if (readOnly) return;
    e.stopPropagation();
    if (onSelectRoom) onSelectRoom(room);

    setDraggingRoomId(room.id);
    const canvasRect = containerRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - canvasRect.left - pan.x) / scale;
    const mouseY = (e.clientY - canvasRect.top - pan.y) / scale;

    setDragOffset({
      x: mouseX - room.x * BASE_PIXELS,
      y: mouseY - room.y * BASE_PIXELS,
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
    } else if (draggingRoomId) {
      const canvasRect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - canvasRect.left - pan.x) / scale;
      const mouseY = (e.clientY - canvasRect.top - pan.y) / scale;

      const targetRoom = rooms.find(r => r.id === draggingRoomId);
      if (!targetRoom) return;

      const newFtX = Math.max(0, Math.min(plotW - targetRoom.width, Math.round((mouseX - dragOffset.x) / BASE_PIXELS)));
      const newFtY = Math.max(0, Math.min(plotL - targetRoom.height, Math.round((mouseY - dragOffset.y) / BASE_PIXELS)));

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

      const deltaXFt = Math.round((e.clientX - resizeStart.x) / (BASE_PIXELS * scale));
      const deltaYFt = Math.round((e.clientY - resizeStart.y) / (BASE_PIXELS * scale));

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
    setResizingRoomId(null);
    setTimeout(() => setCollisionWarning(null), 2500);
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDownBackdrop}
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
      className="relative w-full h-full bg-blueprint-grid overflow-hidden select-none cursor-crosshair flex items-center justify-center"
      id="canvas-backdrop"
    >
      
      {/* Collision Alert Toast */}
      {collisionWarning && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-terracotta text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-elevated flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{collisionWarning} (Snapping back)</span>
        </div>
      )}

      {/* Floating Canvas Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl border border-sand-300 shadow-elevated text-xs">
        <button
          onClick={() => setScale(prev => Math.min(prev + 0.15, 2.5))}
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
            const containerWidth = containerRef.current.clientWidth || 600;
            const containerHeight = containerRef.current.clientHeight || 500;
            const s = Math.min((containerWidth - 80) / canvasWidth, (containerHeight - 80) / canvasHeight);
            setScale(s);
            setPan({ x: (containerWidth - canvasWidth * s) / 2, y: (containerHeight - canvasHeight * s) / 2 });
          }}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-sand-100 rounded-lg transition-colors"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] text-ink-muted px-1.5">
          {Math.round(scale * 100)}%
        </span>
      </div>

      {/* Plot Orientation */}
      <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur px-3.5 py-2 rounded-xl border border-sand-300 shadow-elevated text-xs flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-sage-100 text-sage-700 flex items-center justify-center font-mono font-bold text-[10px] border border-sage-300">
          N
        </div>
        <div>
          <span className="text-[10px] uppercase font-mono text-ink-muted block leading-none">Facing</span>
          <span className="font-bold text-ink text-xs capitalize">{plot.facing || 'North'}</span>
        </div>
      </div>

      {/* Scalable Blueprint Canvas */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'top left',
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transition: isPanning || draggingRoomId || resizingRoomId ? 'none' : 'transform 0.05s ease-out',
        }}
        className="relative bg-white shadow-2xl rounded-sm border-2 border-ink"
      >
        
        {/* Front Road Header */}
        <div className="absolute -top-7 left-0 right-0 h-6 bg-sand-200/90 border border-sand-300 rounded-t flex items-center justify-center text-[10px] font-mono uppercase tracking-wider text-ink font-bold">
          🛣️ Front Access Road ({plot.roadSide || 'North'}) • Width: {plotW} ft
        </div>

        {/* Setback Dotted Line */}
        <div 
          className="absolute border border-dashed border-sand-400 pointer-events-none opacity-60"
          style={{
            top: `${(plot.setbacks?.front || 3) * BASE_PIXELS}px`,
            left: `${(plot.setbacks?.left || 2) * BASE_PIXELS}px`,
            right: `${(plot.setbacks?.right || 2) * BASE_PIXELS}px`,
            bottom: `${(plot.setbacks?.rear || 3) * BASE_PIXELS}px`,
          }}
        />

        {/* Render Rooms with Drag & Resize Handles */}
        {rooms.map((room) => {
          const isSelected = selectedRoomId === room.id;
          const isHighlighted = highlightedRoomIds.includes(room.id);
          const roomArea = Math.round(room.width * room.height);

          return (
            <div
              key={room.id}
              onMouseDown={(e) => handleStartDrag(e, room)}
              style={{
                left: `${room.x * BASE_PIXELS}px`,
                top: `${room.y * BASE_PIXELS}px`,
                width: `${room.width * BASE_PIXELS}px`,
                height: `${room.height * BASE_PIXELS}px`,
                backgroundColor: room.color || '#F7F2EB',
              }}
              className={`absolute border-2 transition-shadow flex flex-col justify-between p-2 select-none group cursor-move ${
                isSelected
                  ? 'border-sage-600 ring-4 ring-sage-500/20 z-20 shadow-xl'
                  : isHighlighted
                  ? 'border-terracotta ring-4 ring-terracotta/30 z-20 animate-pulse'
                  : 'border-ink/80 hover:border-sage-500 hover:shadow-md'
              }`}
            >
              {/* Room Name Header */}
              <div className="flex items-center justify-between pointer-events-none">
                <span className="font-display font-bold text-[11px] leading-tight text-ink truncate pr-1">
                  {room.label}
                </span>
                {room.type === 'pooja' && (
                  <span className="text-[8px] bg-sand-200 px-1 py-0.2 rounded font-bold text-ink shrink-0">
                    NE
                  </span>
                )}
              </div>

              {/* Room Dimensions */}
              <div className="font-mono text-[9px] text-ink-muted flex items-center justify-between pt-1 border-t border-ink/10 pointer-events-none">
                <span>{room.width}&apos; × {room.height}&apos;</span>
                <span className="font-semibold text-ink">{roomArea} sq.ft</span>
              </div>

              {/* Resize Handle at Bottom-Right corner */}
              {isSelected && !readOnly && (
                <div
                  onMouseDown={(e) => handleStartResize(e, room)}
                  className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-sage-500 border-2 border-white rounded-full cursor-se-resize z-30 shadow-subtle hover:scale-125 transition-transform"
                  title="Drag to resize room width & length"
                />
              )}
            </div>
          );
        })}

        {/* Door & Window Openings */}
        {openings.map((op) => {
          const parentRoom = rooms.find(r => r.id === op.wallRoomId);
          if (!parentRoom) return null;

          const parentLeft = parentRoom.x * BASE_PIXELS;
          const parentTop = parentRoom.y * BASE_PIXELS;
          const opOffset = op.offset * BASE_PIXELS;
          const opWidth = (op.width || 3) * BASE_PIXELS;

          let style = {};
          if (op.wallSide === 'top') {
            style = { left: `${parentLeft + opOffset}px`, top: `${parentTop - 3}px`, width: `${opWidth}px`, height: '6px' };
          } else if (op.wallSide === 'bottom') {
            style = { left: `${parentLeft + opOffset}px`, top: `${parentTop + parentRoom.height * BASE_PIXELS - 3}px`, width: `${opWidth}px`, height: '6px' };
          } else if (op.wallSide === 'left') {
            style = { left: `${parentLeft - 3}px`, top: `${parentTop + opOffset}px`, width: '6px', height: `${opWidth}px` };
          } else if (op.wallSide === 'right') {
            style = { left: `${parentLeft + parentRoom.width * BASE_PIXELS - 3}px`, top: `${parentTop + opOffset}px`, width: '6px', height: `${opWidth}px` };
          }

          return (
            <div
              key={op.id}
              style={style}
              className={`absolute z-10 ${
                op.type === 'door'
                  ? 'bg-amber-600 border border-white'
                  : 'bg-sky-400 border border-white'
              }`}
            />
          );
        })}

      </div>
    </div>
  );
};
