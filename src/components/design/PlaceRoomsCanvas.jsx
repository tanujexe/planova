import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Magnet, 
  Move, 
  Maximize2, 
  Check, 
  Undo, 
  Redo, 
  RotateCw,
  Trash2
} from 'lucide-react';

export const PlaceRoomsCanvas = ({
  plot = { width: 30, length: 50 },
  rooms = [],
  selectedRoomId = null,
  onSelectRoom,
  onUpdateRoomPosition,
  onUpdateRoomSize,
  onRemoveRoom,
  snapEnabled = true,
  onToggleSnap,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging state for rooms
  const [draggingRoomId, setDraggingRoomId] = useState(null);
  const [dragStart, setDragStart] = useState({ mouseX: 0, mouseY: 0, roomX: 0, roomY: 0 });

  // Resizing state
  const [resizingRoomId, setResizingRoomId] = useState(null);
  const [resizeStart, setResizeStart] = useState({ mouseX: 0, mouseY: 0, w: 0, h: 0 });

  // Canvas scaling
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;
  const PIXELS_PER_FT = 14; // Base pixels per foot

  const canvasWidth = plotW * PIXELS_PER_FT;
  const canvasHeight = plotL * PIXELS_PER_FT;

  // Center pan initially
  useEffect(() => {
    if (containerRef.current) {
      const cw = containerRef.current.clientWidth || 800;
      const ch = containerRef.current.clientHeight || 600;
      setPan({
        x: (cw - canvasWidth * zoom) / 2,
        y: (ch - canvasHeight * zoom) / 2,
      });
    }
  }, [canvasWidth, canvasHeight]);

  const handleZoomIn = () => setZoom((z) => Math.min(2.2, Number((z + 0.15).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))));
  const handleResetZoom = () => {
    setZoom(1);
    if (containerRef.current) {
      const cw = containerRef.current.clientWidth || 800;
      const ch = containerRef.current.clientHeight || 600;
      setPan({
        x: (cw - canvasWidth) / 2,
        y: (ch - canvasHeight) / 2,
      });
    }
  };

  // Canvas background panning
  const handleContainerMouseDown = (e) => {
    if (e.target === containerRef.current || e.target.getAttribute('data-canvas-bg')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      if (onSelectRoom) onSelectRoom(null);
    }
  };

  const handleMouseMove = useCallback((e) => {
    // 1. Pan Canvas
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // 2. Drag Room
    if (draggingRoomId) {
      const room = rooms.find((r) => r.id === draggingRoomId);
      if (!room) return;

      const deltaXPixels = (e.clientX - dragStart.mouseX) / zoom;
      const deltaYPixels = (e.clientY - dragStart.mouseY) / zoom;

      let newXFt = dragStart.roomX + deltaXPixels / PIXELS_PER_FT;
      let newYFt = dragStart.roomY + deltaYPixels / PIXELS_PER_FT;

      // Snap to 1 ft grid if snap is enabled
      if (snapEnabled) {
        newXFt = Math.round(newXFt);
        newYFt = Math.round(newYFt);
      } else {
        newXFt = Number(newXFt.toFixed(1));
        newYFt = Number(newYFt.toFixed(1));
      }

      // Constrain inside plot
      const maxX = Math.max(0, plotW - room.width);
      const maxY = Math.max(0, plotL - room.height);
      newXFt = Math.min(maxX, Math.max(0, newXFt));
      newYFt = Math.min(maxY, Math.max(0, newYFt));

      if (onUpdateRoomPosition) {
        onUpdateRoomPosition(draggingRoomId, newXFt, newYFt);
      }
      return;
    }

    // 3. Resize Room
    if (resizingRoomId) {
      const room = rooms.find((r) => r.id === resizingRoomId);
      if (!room) return;

      const deltaXPixels = (e.clientX - resizeStart.mouseX) / zoom;
      const deltaYPixels = (e.clientY - resizeStart.mouseY) / zoom;

      let newWFt = resizeStart.w + deltaXPixels / PIXELS_PER_FT;
      let newHFt = resizeStart.h + deltaYPixels / PIXELS_PER_FT;

      if (snapEnabled) {
        newWFt = Math.round(newWFt);
        newHFt = Math.round(newHFt);
      } else {
        newWFt = Number(newWFt.toFixed(1));
        newHFt = Number(newHFt.toFixed(1));
      }

      // Minimum room sizes
      newWFt = Math.max(4, Math.min(plotW - room.x, newWFt));
      newHFt = Math.max(4, Math.min(plotL - room.y, newHFt));

      if (onUpdateRoomSize) {
        onUpdateRoomSize(resizingRoomId, newWFt, newHFt);
      }
    }
  }, [isPanning, panStart, draggingRoomId, dragStart, resizingRoomId, resizeStart, zoom, rooms, plotW, plotL, snapEnabled, onUpdateRoomPosition, onUpdateRoomSize]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggingRoomId(null);
    setResizingRoomId(null);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Start dragging a room
  const handleRoomPointerDown = (e, room) => {
    e.stopPropagation();
    if (onSelectRoom) onSelectRoom(room.id);

    setDraggingRoomId(room.id);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      roomX: room.x,
      roomY: room.y,
    });
  };

  // Start resizing a room
  const handleResizePointerDown = (e, room) => {
    e.stopPropagation();
    setResizingRoomId(room.id);
    setResizeStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      w: room.width,
      h: room.height,
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col select-none overflow-hidden bg-[#FAF8F5]">
      
      {/* Top Floating Mini-Toolbar matching Screenshots */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#EAE6DF] shadow-md">
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 border-r border-[#EAE6DF] pr-2">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-xl hover:bg-[#F5F2EC] text-neutral-700 hover:text-neutral-950 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-semibold text-neutral-600 px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-xl hover:bg-[#F5F2EC] text-neutral-700 hover:text-neutral-950 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-xl hover:bg-[#F5F2EC] text-neutral-700 hover:text-neutral-950 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* History Undo / Redo */}
        <div className="flex items-center gap-1 border-r border-[#EAE6DF] pr-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-xl hover:bg-[#F5F2EC] disabled:opacity-30 text-neutral-700 transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-xl hover:bg-[#F5F2EC] disabled:opacity-30 text-neutral-700 transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>

        {/* Snap Toggle matching Screenshot */}
        <button
          onClick={onToggleSnap}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
            snapEnabled
              ? 'bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]'
              : 'bg-[#F5F2EC] text-neutral-500 border border-[#DDD7CD]'
          }`}
          title="Toggle Grid Snapping"
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
          {snapEnabled && <Check className="w-3 h-3 stroke-[3]" />}
        </button>

      </div>

      {/* Main Canvas Viewport Area */}
      <div
        ref={containerRef}
        onMouseDown={handleContainerMouseDown}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Transform Group (Pan & Zoom) */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position: 'absolute',
            left: 0,
            top: 0,
          }}
          className="transition-transform duration-75 ease-out pointer-events-auto"
        >
          {/* ============================================================
              DIRECTIONAL COMPASS LABELS (Back / Front / Left / Right)
             ============================================================ */}
          {/* Top Label: Back (North) */}
          <div 
            style={{ width: `${canvasWidth}px` }}
            className="absolute -top-7 left-0 text-center text-xs font-semibold text-neutral-500 uppercase tracking-widest font-mono select-none"
          >
            Back
          </div>

          {/* Bottom Label: Front (Road / South) */}
          <div 
            style={{ width: `${canvasWidth}px`, top: `${canvasHeight + 10}px` }}
            className="absolute left-0 text-center text-xs font-semibold text-neutral-500 uppercase tracking-widest font-mono select-none"
          >
            Front
          </div>

          {/* Left Label: Left (West) */}
          <div 
            style={{ top: `${canvasHeight / 2 - 10}px` }}
            className="absolute -left-12 text-xs font-semibold text-neutral-500 uppercase tracking-widest font-mono select-none"
          >
            Left
          </div>

          {/* Right Label: Right (East) */}
          <div 
            style={{ top: `${canvasHeight / 2 - 10}px`, left: `${canvasWidth + 12}px` }}
            className="absolute text-xs font-semibold text-neutral-500 uppercase tracking-widest font-mono select-none"
          >
            Right
          </div>

          {/* ============================================================
              SAGE ARCHITECTURAL GRID CANVAS (Matching Screenshots)
             ============================================================ */}
          <div
            data-canvas-bg="true"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              backgroundColor: '#E5EAE0', // Sage-tinted grid background from screenshot
              backgroundImage: `
                linear-gradient(to right, rgba(140, 160, 135, 0.22) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(140, 160, 135, 0.22) 1px, transparent 1px),
                linear-gradient(to right, rgba(140, 160, 135, 0.45) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(140, 160, 135, 0.45) 1px, transparent 1px)
              `,
              backgroundSize: `${PIXELS_PER_FT}px ${PIXELS_PER_FT}px, ${PIXELS_PER_FT}px ${PIXELS_PER_FT}px, ${PIXELS_PER_FT * 5}px ${PIXELS_PER_FT * 5}px, ${PIXELS_PER_FT * 5}px ${PIXELS_PER_FT * 5}px`,
            }}
            className="relative border-2 border-[#94A38E] rounded-xs shadow-sm overflow-hidden"
          >
            {/* Center Crosshair Axes matching Screenshot */}
            <div
              style={{ left: `${canvasWidth / 2}px` }}
              className="absolute top-0 bottom-0 w-0.5 bg-[#8A9B84] pointer-events-none"
            />
            <div
              style={{ top: `${canvasHeight / 2}px` }}
              className="absolute left-0 right-0 h-0.5 bg-[#8A9B84] pointer-events-none"
            />

            {/* Center Crosshair Marker */}
            <div
              style={{
                left: `${canvasWidth / 2 - 6}px`,
                top: `${canvasHeight / 2 - 6}px`,
              }}
              className="absolute w-3 h-3 border border-[#6F8069] rounded-full pointer-events-none"
            />

            {/* ============================================================
                PROPERLY MOVEABLE ROOMS (Rectangles with Drag & Resize)
               ============================================================ */}
            {rooms.map((room) => {
              const isSelected = selectedRoomId === room.id;
              const isDragging = draggingRoomId === room.id;

              const leftPx = room.x * PIXELS_PER_FT;
              const topPx = room.y * PIXELS_PER_FT;
              const widthPx = room.width * PIXELS_PER_FT;
              const heightPx = room.height * PIXELS_PER_FT;

              // Choose pastel color
              let bg = '#FEEAE5';
              let border = '#F9BEB3';
              let text = '#6C3428';

              if (room.type?.includes('bath') || room.id?.includes('bath')) {
                bg = '#E0F2FE';
                border = '#BAE6FD';
                text = '#075985';
              } else if (room.type?.includes('closet') || room.id?.includes('closet')) {
                bg = '#FDEBD2';
                border = '#FBD3A4';
                text = '#7C2D12';
              } else if (room.type?.includes('kitchen') || room.id?.includes('kitchen')) {
                bg = '#FFEDD5';
                border = '#FED7AA';
                text = '#7C2D12';
              } else if (room.type?.includes('living') || room.id?.includes('living')) {
                bg = '#FEF3C7';
                border = '#FDE68A';
                text = '#78350F';
              } else if (room.type?.includes('parking') || room.id?.includes('parking')) {
                bg = '#DCFCE7';
                border = '#BBF7D0';
                text = '#166534';
              } else if (room.type?.includes('pooja') || room.id?.includes('pooja')) {
                bg = '#FFFBEB';
                border = '#FDE68A';
                text = '#92400E';
              }

              return (
                <div
                  key={room.id}
                  onPointerDown={(e) => handleRoomPointerDown(e, room)}
                  style={{
                    transform: `translate3d(${leftPx}px, ${topPx}px, 0)`,
                    width: `${widthPx}px`,
                    height: `${heightPx}px`,
                    backgroundColor: bg,
                    borderColor: isSelected ? '#1E1E1E' : border,
                    zIndex: isDragging ? 50 : isSelected ? 30 : 10,
                    cursor: isDragging ? 'grabbing' : 'grab',
                  }}
                  className={`
                    absolute rounded-lg border-2 p-2 flex flex-col justify-between
                    transition-shadow duration-150 select-none
                    ${
                      isDragging
                        ? 'shadow-2xl opacity-90 scale-[1.02]'
                        : isSelected
                        ? 'shadow-lg ring-2 ring-neutral-950/20'
                        : 'shadow-xs hover:shadow-md'
                    }
                  `}
                >
                  {/* Top: Room Label */}
                  <div className="flex items-start justify-between gap-1 overflow-hidden pointer-events-none">
                    <span
                      style={{ color: text }}
                      className="text-[11px] font-bold leading-tight truncate"
                    >
                      {room.label || 'Room'}
                    </span>

                    {/* Move indicator */}
                    <Move className="w-3 h-3 opacity-40 shrink-0" />
                  </div>

                  {/* Center: Dimensions & Area */}
                  <div className="text-center pointer-events-none space-y-0.5">
                    <div
                      style={{ color: text }}
                      className="text-[10px] font-mono font-semibold"
                    >
                      {Math.round(room.width * room.height)} ft²
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500">
                      {room.width}' × {room.height}'
                    </div>
                  </div>

                  {/* Bottom: Resize Handle (on bottom-right corner when selected) */}
                  {isSelected && (
                    <div
                      onPointerDown={(e) => handleResizePointerDown(e, room)}
                      className="absolute bottom-0 right-0 w-4 h-4 bg-neutral-900 rounded-tl-md cursor-se-resize flex items-center justify-center text-white"
                      title="Drag to resize room dimensions"
                    >
                      <span className="text-[8px] font-bold">⋱</span>
                    </div>
                  )}
                </div>
              );
            })}

          </div>
        </div>
      </div>

    </div>
  );
};
