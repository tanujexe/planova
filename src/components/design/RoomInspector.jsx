import React from 'react';
import { 
  Sliders, 
  Ruler, 
  Sparkles, 
  Layers, 
  Lock, 
  X, 
  Maximize2, 
  Move,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatDimension } from '../../lib/units.js';

export const getVastuSector = (room, plot) => {
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;

  const centerX = room.x + room.width / 2;
  const centerY = room.y + room.height / 2;

  const isNorth = centerY < plotL * 0.35;
  const isSouth = centerY > plotL * 0.65;
  const isWest = centerX < plotW * 0.4;
  const isEast = centerX > plotW * 0.6;

  if (isNorth && isEast) return { name: 'North-East (Ishanya)', desc: 'Optimal for Pooja, Entrance & Water' };
  if (isSouth && isEast) return { name: 'South-East (Agni)', desc: 'Ideal for Kitchen & Heat appliances' };
  if (isSouth && isWest) return { name: 'South-West (Nairutya)', desc: 'Ideal for Master Bedroom & Stability' };
  if (isNorth && isWest) return { name: 'North-West (Vayavya)', desc: 'Optimal for Guest room, Parking & Air' };
  if (isNorth) return { name: 'North (Kubera)', desc: 'Auspicious for Living & Open space' };
  if (isEast) return { name: 'East (Indra)', desc: 'Optimal for Daylight & Main halls' };
  if (isSouth) return { name: 'South (Yama)', desc: 'Suitable for Bedrooms & Heavy storage' };
  if (isWest) return { name: 'West (Varuna)', desc: 'Suitable for Study, Dining & Staircase' };

  return { name: 'Central (Brahmasthan)', desc: 'Sacred core; keep open and uncluttered' };
};

export const RoomInspector = ({
  room,
  plot,
  onUpdateRoom,
  onClose,
}) => {
  if (!room) return null;

  const vastuInfo = getVastuSector(room, plot);
  const area = Math.round(room.width * room.height);

  const handleDimensionChange = (field, delta) => {
    const current = Number(room[field]) || 10;
    const next = Math.max(4, current + delta);
    onUpdateRoom({ ...room, [field]: next });
  };

  const handlePositionChange = (field, delta) => {
    const current = Number(room[field]) || 0;
    const next = Math.max(0, current + delta);
    onUpdateRoom({ ...room, [field]: next });
  };

  return (
    <div className="bg-white rounded-2xl border border-sand-300 p-5 shadow-elevated space-y-5 animate-in fade-in-50 duration-100">
      
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-sand-200">
        <div>
          <span className="text-[10px] font-mono uppercase bg-sage-100 text-sage-800 px-2 py-0.5 rounded font-bold border border-sage-200">
            Room Inspector
          </span>
          <h3 className="font-display font-bold text-base text-ink mt-1">
            {room.label}
          </h3>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-ink-muted hover:text-ink hover:bg-sand-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Label & Type */}
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-ink-muted mb-1">
            Room Label
          </label>
          <input
            type="text"
            value={room.label}
            onChange={(e) => onUpdateRoom({ ...room, label: e.target.value })}
            className="w-full px-3 py-2 text-xs bg-linen border border-sand-300 rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-sage-500/20 focus:border-sage-500"
          />
        </div>

        {/* Numeric Dimension Sizers */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-linen p-3 rounded-xl border border-sand-200">
            <span className="text-[10px] uppercase font-mono text-ink-muted block mb-1">
              Width (ft)
            </span>
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={() => handleDimensionChange('width', -1)}
                className="w-7 h-7 bg-white rounded-lg border border-sand-300 font-bold text-sm text-ink hover:bg-sand-100 flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="font-mono font-bold text-sm text-ink">
                {room.width}&apos;
              </span>
              <button
                onClick={() => handleDimensionChange('width', 1)}
                className="w-7 h-7 bg-white rounded-lg border border-sand-300 font-bold text-sm text-ink hover:bg-sand-100 flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="bg-linen p-3 rounded-xl border border-sand-200">
            <span className="text-[10px] uppercase font-mono text-ink-muted block mb-1">
              Length (ft)
            </span>
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={() => handleDimensionChange('height', -1)}
                className="w-7 h-7 bg-white rounded-lg border border-sand-300 font-bold text-sm text-ink hover:bg-sand-100 flex items-center justify-center transition-colors"
              >
                -
              </button>
              <span className="font-mono font-bold text-sm text-ink">
                {room.height}&apos;
              </span>
              <button
                onClick={() => handleDimensionChange('height', 1)}
                className="w-7 h-7 bg-white rounded-lg border border-sand-300 font-bold text-sm text-ink hover:bg-sand-100 flex items-center justify-center transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Position Controls */}
        <div className="p-3 bg-sand-50 rounded-xl border border-sand-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-ink flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-sage-600" />
              <span>Grid Placement (X, Y)</span>
            </span>
            <span className="font-mono text-ink-muted text-[11px]">
              ({room.x}, {room.y}) ft
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-mono">
            <button
              onClick={() => handlePositionChange('y', -1)}
              className="py-1.5 bg-white border border-sand-300 rounded-lg hover:bg-sand-100 text-center font-bold"
              title="Move North / Up"
            >
              ↑ N
            </button>
            <button
              onClick={() => handlePositionChange('y', 1)}
              className="py-1.5 bg-white border border-sand-300 rounded-lg hover:bg-sand-100 text-center font-bold"
              title="Move South / Down"
            >
              ↓ S
            </button>
            <button
              onClick={() => handlePositionChange('x', -1)}
              className="py-1.5 bg-white border border-sand-300 rounded-lg hover:bg-sand-100 text-center font-bold"
              title="Move West / Left"
            >
              ← W
            </button>
            <button
              onClick={() => handlePositionChange('x', 1)}
              className="py-1.5 bg-white border border-sand-300 rounded-lg hover:bg-sand-100 text-center font-bold"
              title="Move East / Right"
            >
              → E
            </button>
          </div>
        </div>

        {/* Total Space & Vastu Position Tag */}
        <div className="p-3 bg-sage-50 rounded-xl border border-sage-200 space-y-1.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-ink-muted text-[11px]">Calculated Footprint:</span>
            <span className="font-mono font-bold text-ink">{area} sq.ft</span>
          </div>
          <div className="pt-1.5 border-t border-sage-200/80">
            <div className="flex items-center gap-1 font-semibold text-sage-900 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-sage-600" />
              <span>{vastuInfo.name}</span>
            </div>
            <p className="text-[10px] text-ink-muted mt-0.5 leading-tight">
              {vastuInfo.desc}
            </p>
          </div>
        </div>

        {room.required && (
          <div className="p-2.5 bg-sand-100 rounded-lg text-[11px] text-ink-muted flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-sand-500 shrink-0" />
            <span>Core layout room protected from accidental deletion.</span>
          </div>
        )}
      </div>

    </div>
  );
};
