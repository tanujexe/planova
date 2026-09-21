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
  onToggleStagingDrawer,
  viewMode = '2d', // '2d' | 'split' | '3d'
  onViewModeChange,
}) => {
  const [showRoomPalette, setShowRoomPalette] = useState(false);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-slate-900/95 backdrop-blur text-white px-3 py-2 rounded-2xl border border-slate-700 shadow-2xl">
      {/* Select / Move Tool */}
      <button
        onClick={() => {
          onSelectTool('select');
          setShowRoomPalette(false);
        }}
        className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
          activeTool === 'select' ? 'bg-sage-600 text-white shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
        title="Select & Move Tool (V)"
      >
        <MousePointer className="w-4 h-4" />
        <span className="hidden sm:inline">Select</span>
      </button>

      {/* Add Room Palette Trigger */}
      <div className="relative">
        <button
          onClick={() => setShowRoomPalette(!showRoomPalette)}
          className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
            showRoomPalette ? 'bg-sky-500 text-slate-950 font-bold shadow-sm' : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
          title="Add New Room to Floor"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Add Room</span>
        </button>

        {/* Room Presets Dropup */}
        {showRoomPalette && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 bg-slate-900/98 backdrop-blur border border-slate-700 rounded-2xl shadow-2xl p-3 z-50 flex flex-col gap-1.5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Select Space Type
              </span>
              <button
                onClick={() => setShowRoomPalette(false)}
                className="p-0.5 text-slate-400 hover:text-white rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1.5 max-h-60 overflow-y-auto no-scrollbar">
              {ROOM_PRESETS.map((preset) => (
                <button
                  key={preset.type}
                  onClick={() => {
                    onAddRoom(preset);
                    setShowRoomPalette(false);
                  }}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-left transition-colors flex items-center justify-between group"
                >
                  <span className="font-semibold text-xs text-white group-hover:text-sky-400">
                    {preset.label}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
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
        className="p-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        title="Open Furniture Staging Drawer"
      >
        <Armchair className="w-4 h-4 text-sage-400" />
        <span className="hidden sm:inline">Staging</span>
      </button>

      <div className="w-px h-5 bg-slate-700 mx-1" />

      {/* View Mode Switcher (2D / Split / 3D) */}
      <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
        <button
          onClick={() => onViewModeChange('2d')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '2d' ? 'bg-white text-slate-950 shadow-sm font-bold' : 'text-slate-400 hover:text-white'
          }`}
          title="2D CAD Plan View"
        >
          2D CAD
        </button>
        <button
          onClick={() => onViewModeChange('split')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            viewMode === 'split' ? 'bg-sky-500 text-slate-950 shadow-sm font-bold' : 'text-slate-400 hover:text-white'
          }`}
          title="2D + 3D Simultaneous Split Screen"
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Split View</span>
        </button>
        <button
          onClick={() => onViewModeChange('3d')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
            viewMode === '3d' ? 'bg-amber-400 text-slate-950 shadow-sm font-bold' : 'text-slate-400 hover:text-white'
          }`}
          title="3D Real-time Scene"
        >
          3D Scene
        </button>
      </div>
    </div>
  );
};
