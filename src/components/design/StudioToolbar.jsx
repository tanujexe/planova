import React, { useState } from 'react';
import { 
  MousePointer, 
  PlusCircle, 
  Ruler, 
  Armchair, 
  Columns2, 
  Layers, 
  Square,
  Sparkles,
  Bed,
  CookingPot,
  Bath,
  UtensilsCrossed,
  X
} from 'lucide-react';

export const ROOM_PRESETS = [
  { type: 'master_bedroom', label: 'Master Bedroom', width: 14, height: 14, color: '#DFE5DA' },
  { type: 'bedroom', label: 'Bedroom', width: 12, height: 12, color: '#E2E8DC' },
  { type: 'living', label: 'Living & Dining', width: 16, height: 18, color: '#F0F4EC' },
  { type: 'kitchen', label: 'Kitchen & Utility', width: 10, height: 12, color: '#F9EDE8' },
  { type: 'dining', label: 'Dining Area', width: 10, height: 10, color: '#E8E3DC' },
  { type: 'bathroom', label: 'Attached Bath', width: 6, height: 8, color: '#DCE8EC' },
  { type: 'balcony', label: 'Balcony Terrace', width: 10, height: 6, color: '#E7ECDF' },
  { type: 'pooja', label: 'Pooja Room', width: 6, height: 6, color: '#FBF2E3' },
];

export const StudioToolbar = ({
  activeTool = 'select',
  onSelectTool,
  onAddRoom,
  onAutoStage,
  isStagingOpen = false,
  onToggleStagingDrawer,
  viewMode = '2d', // '2d' | 'split' | '3d'
  onViewModeChange,
}) => {
  const [showRoomPalette, setShowRoomPalette] = useState(false);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-neutral-900 px-3 py-2 rounded-2xl border border-[#EAE6DF] shadow-elevated">
      {/* Select / Move Tool */}
      <button
        onClick={() => {
          onSelectTool('select');
          setShowRoomPalette(false);
        }}
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
          activeTool === 'select' && !showRoomPalette && !isStagingOpen
            ? 'bg-neutral-950 text-white shadow-xs' 
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-[#F5F2EC]'
        }`}
        title="Select & Move Tool (V)"
      >
        <MousePointer className="w-3.5 h-3.5 stroke-[2.2]" />
        <span className="hidden sm:inline">Select</span>
      </button>

      {/* Add Room Palette Trigger */}
      <div className="relative">
        <button
          onClick={() => setShowRoomPalette(!showRoomPalette)}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
            showRoomPalette
              ? 'bg-neutral-950 text-white shadow-xs font-bold'
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-[#F5F2EC]'
          }`}
          title="Add New Room to Floor"
        >
          <PlusCircle className="w-3.5 h-3.5 stroke-[2.2]" />
          <span className="hidden sm:inline">Add Room</span>
        </button>

        {/* Room Presets Dropup */}
        {showRoomPalette && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-72 bg-white/98 backdrop-blur-md border border-[#EAE6DF] rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#F2EFE9]">
              <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
                Select Space Type
              </span>
              <button
                onClick={() => setShowRoomPalette(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 hover:bg-[#F5F2EC] rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-64 overflow-y-auto no-scrollbar">
              {ROOM_PRESETS.map((preset) => (
                <button
                  key={preset.type}
                  onClick={() => {
                    onAddRoom(preset);
                    setShowRoomPalette(false);
                  }}
                  className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F5F2EC] border border-[#EAE6DF]/70 text-left transition-all flex items-center justify-between group hover:border-[#DDD8CE]"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 border border-black/10" 
                      style={{ backgroundColor: preset.color }}
                    />
                    <span className="font-semibold text-xs text-neutral-900 group-hover:text-neutral-950">
                      {preset.label}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-neutral-500 bg-white px-2 py-0.5 rounded border border-[#EAE6DF]">
                    {preset.width}&apos; × {preset.height}&apos;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Auto-Staging Drawer Trigger */}
      <button
        onClick={onToggleStagingDrawer}
        className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
          isStagingOpen
            ? 'bg-neutral-950 text-white shadow-xs'
            : 'text-neutral-600 hover:text-neutral-950 hover:bg-[#F5F2EC]'
        }`}
        title="Open Furniture Staging Drawer"
      >
        <Armchair className="w-3.5 h-3.5 stroke-[2.2]" />
        <span className="hidden sm:inline">Staging</span>
      </button>

      {/* Subtle Vertical Divider */}
      <div className="w-px h-5 bg-[#E5E0D8] mx-1" />

      {/* View Mode Switcher (2D CAD / Furnished / Split / 3D) */}
      <div className="flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-xl border border-[#EAE6DF]">
        <button
          onClick={() => onViewModeChange('2d')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '2d' 
              ? 'bg-neutral-950 text-white shadow-xs' 
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
          }`}
          title="2D CAD Blueprint Plan"
        >
          2D CAD
        </button>
        <button
          onClick={() => onViewModeChange('rendered')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewMode === 'rendered' 
              ? 'bg-amber-600 text-white shadow-xs' 
              : 'text-amber-800 hover:text-amber-950 hover:bg-white/60'
          }`}
          title="Full Top-Down Furnished Architectural View"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold">Furnished View</span>
        </button>
        <button
          onClick={() => onViewModeChange('split')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            viewMode === 'split' 
              ? 'bg-neutral-950 text-white shadow-xs' 
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
          }`}
          title="2D + 3D Simultaneous Split Screen"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Split</span>
        </button>
        <button
          onClick={() => onViewModeChange('3d')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '3d' 
              ? 'bg-neutral-950 text-white shadow-xs' 
              : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
          }`}
          title="3D Real-time Scene"
        >
          3D Scene
        </button>
      </div>
    </div>
  );
};
