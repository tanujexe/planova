import React, { useState } from 'react';
import { 
  Maximize2, 
  Layers, 
  Sparkles, 
  Check, 
  Grid, 
  Move, 
  Plus, 
  Minus,
  Compass,
  Home,
  Bath,
  Bed,
  Utensils,
  DoorOpen,
  Car
} from 'lucide-react';

const ROOM_THEMES = {
  master_bedroom: {
    bg: 'bg-[#FEEAE5]',
    border: 'border-[#F9BEB3]',
    hoverBorder: 'hover:border-[#F49788]',
    text: 'text-[#6C3428]',
    accent: '#F49788',
    icon: Bed,
  },
  bedroom: {
    bg: 'bg-[#FEEAE5]',
    border: 'border-[#F9BEB3]',
    hoverBorder: 'hover:border-[#F49788]',
    text: 'text-[#6C3428]',
    accent: '#F49788',
    icon: Bed,
  },
  guest_bedroom: {
    bg: 'bg-[#FEEAE5]',
    border: 'border-[#F9BEB3]',
    hoverBorder: 'hover:border-[#F49788]',
    text: 'text-[#6C3428]',
    accent: '#F49788',
    icon: Bed,
  },
  bathroom: {
    bg: 'bg-[#E0F2FE]',
    border: 'border-[#BAE6FD]',
    hoverBorder: 'hover:border-[#7DD3FC]',
    text: 'text-[#075985]',
    accent: '#38BDF8',
    icon: Bath,
  },
  attached_bathroom: {
    bg: 'bg-[#E0F2FE]',
    border: 'border-[#BAE6FD]',
    hoverBorder: 'hover:border-[#7DD3FC]',
    text: 'text-[#075985]',
    accent: '#38BDF8',
    icon: Bath,
  },
  living: {
    bg: 'bg-[#FEF3C7]',
    border: 'border-[#FDE68A]',
    hoverBorder: 'hover:border-[#FCD34D]',
    text: 'text-[#78350F]',
    accent: '#FBBF24',
    icon: Home,
  },
  dining: {
    bg: 'bg-[#FEF3C7]',
    border: 'border-[#FDE68A]',
    hoverBorder: 'hover:border-[#FCD34D]',
    text: 'text-[#78350F]',
    accent: '#FBBF24',
    icon: Utensils,
  },
  kitchen: {
    bg: 'bg-[#FFEDD5]',
    border: 'border-[#FED7AA]',
    hoverBorder: 'hover:border-[#FDBA74]',
    text: 'text-[#7C2D12]',
    accent: '#FB923C',
    icon: Utensils,
  },
  utility: {
    bg: 'bg-[#F1F5F9]',
    border: 'border-[#CBD5E1]',
    hoverBorder: 'hover:border-[#94A3B8]',
    text: 'text-[#334155]',
    accent: '#94A3B8',
    icon: Layers,
  },
  foyer: {
    bg: 'bg-[#FAF5FF]',
    border: 'border-[#E9D5FF]',
    hoverBorder: 'hover:border-[#D8B4FE]',
    text: 'text-[#581C87]',
    accent: '#C084FC',
    icon: DoorOpen,
  },
  pooja: {
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    hoverBorder: 'hover:border-[#F59E0B]',
    text: 'text-[#92400E]',
    accent: '#D97706',
    icon: Sparkles,
  },
  parking: {
    bg: 'bg-[#DCFCE7]',
    border: 'border-[#BBF7D0]',
    hoverBorder: 'hover:border-[#86EFAC]',
    text: 'text-[#166534]',
    accent: '#4ADE80',
    icon: Car,
  },
  balcony: {
    bg: 'bg-[#F0FDF4]',
    border: 'border-[#BBF7D0]',
    hoverBorder: 'hover:border-[#86EFAC]',
    text: 'text-[#166534]',
    accent: '#4ADE80',
    icon: Maximize2,
  },
};

export const ShapesAndRoomsView = ({
  floorPlan,
  activeFloorLevel = 0,
  onSelectFloorLevel,
  onOpenStudio,
}) => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  const floors = floorPlan?.floors || [];
  const currentFloor = floors.find((f) => f.level === activeFloorLevel) || floors[0] || { rooms: [] };
  const rooms = currentFloor.rooms || [];

  const totalFloorArea = rooms.reduce((acc, r) => acc + (r.width * r.height), 0);

  return (
    <div className="flex flex-col h-full bg-[#FAF8F5] rounded-3xl p-6 relative select-none">
      
      {/* Floor Switcher & Meta Bar */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EAE5DC]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider font-mono">
            Spatial Zoning:
          </span>
          <div className="flex items-center gap-1 bg-[#ECE7DE] p-1 rounded-xl">
            {floors.map((floor) => (
              <button
                key={floor.level}
                onClick={() => onSelectFloorLevel && onSelectFloorLevel(floor.level)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  activeFloorLevel === floor.level
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {floor.label || `Level ${floor.level}`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-neutral-600">
          <span>{rooms.length} Rooms Planned</span>
          <span className="text-neutral-300">•</span>
          <span className="font-semibold text-neutral-800">{totalFloorArea} sq.ft</span>
        </div>
      </div>

      {/* Bubble Canvas Layout */}
      <div className="flex-1 flex flex-wrap items-center justify-center content-center gap-5 p-4 min-h-[360px] relative bg-[#FAF8F5]">
        {rooms.map((room) => {
          const area = Math.round(room.width * room.height);
          const theme = ROOM_THEMES[room.type] || ROOM_THEMES.bedroom;
          const isSelected = selectedRoom?.id === room.id;
          const Icon = theme.icon;

          // Compute proportionate relative bubble size
          const minDim = 110;
          const maxDim = 175;
          const dimension = Math.min(
            maxDim,
            Math.max(minDim, Math.round(Math.sqrt(area) * 8.5))
          );

          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              style={{
                width: `${dimension}px`,
                height: `${dimension * 0.9}px`,
              }}
              className={`
                group relative cursor-pointer transition-all duration-300 ease-out
                rounded-3xl border-2 p-3.5 flex flex-col justify-between
                shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                hover:shadow-[0_6px_20px_rgba(0,0,0,0.07)] hover:-translate-y-0.5
                ${theme.bg} ${theme.border} ${theme.hoverBorder}
                ${isSelected ? 'ring-2 ring-neutral-900 ring-offset-2 scale-105 shadow-md' : ''}
              `}
            >
              {/* Top: Room Label & Icon */}
              <div className="flex items-start justify-between gap-1">
                <span className={`text-xs font-semibold leading-tight line-clamp-2 ${theme.text}`}>
                  {room.label}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 opacity-70 ${theme.text}`} />
              </div>

              {/* Center: Dimensions badge */}
              <div className="text-[11px] font-mono text-neutral-500 text-center">
                {room.width}' × {room.height}'
              </div>

              {/* Bottom: Square Footage Pill */}
              <div className="flex items-center justify-center">
                <span className={`text-[11px] font-medium tracking-tight px-2 py-0.5 rounded-full bg-white/70 shadow-2xs ${theme.text}`}>
                  {area} ft²
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Room Details Bar & Studio Launch */}
      <div className="mt-4 pt-4 border-t border-[#EAE5DC] flex flex-wrap items-center justify-between gap-3 text-xs">
        {selectedRoom ? (
          <div className="flex items-center gap-3">
            <span className="font-semibold text-neutral-800">
              Selected: {selectedRoom.label} ({selectedRoom.width}' × {selectedRoom.height}' = {selectedRoom.width * selectedRoom.height} sq.ft)
            </span>
            <span className="text-neutral-400">|</span>
            <span className="text-neutral-500 capitalize">Type: {selectedRoom.type.replace('_', ' ')}</span>
          </div>
        ) : (
          <p className="text-neutral-500">
            Click any room bubble to inspect its dimensions and spatial allocation.
          </p>
        )}

        <button
          onClick={onOpenStudio}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition-all shadow-sm"
        >
          <span>Open Full Blueprint Editor</span>
          <span className="text-xs">→</span>
        </button>
      </div>

    </div>
  );
};
