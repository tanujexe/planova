import React from 'react';
import { 
  Home, 
  Maximize2, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Bed, 
  Bath, 
  ArrowRight,
  Plus
} from 'lucide-react';

// Procedural Architectural Watercolor House Facade Illustrations
export const WatercolorFacade = ({ variant = 'modern_wood' }) => {
  if (variant === 'open_living') {
    return (
      <svg viewBox="0 0 500 300" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F4F8FA" />
            <stop offset="60%" stopColor="#F9FBFB" />
            <stop offset="100%" stopColor="#F7F5F0" />
          </linearGradient>
          <linearGradient id="whiteStucco" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF8F5" />
            <stop offset="100%" stopColor="#EFECE6" />
          </linearGradient>
          <linearGradient id="glassGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8E8EC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9BBCC4" stopOpacity="0.8" />
          </linearGradient>
          <filter id="softWatercolor2" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        {/* Sky wash */}
        <rect width="500" height="300" fill="url(#skyGrad2)" />

        {/* Soft watercolor tree blobs in background */}
        <g opacity="0.45" filter="url(#softWatercolor2)">
          <circle cx="90" cy="110" r="75" fill="#7C9A74" />
          <circle cx="160" cy="90" r="65" fill="#5F7D57" />
          <circle cx="410" cy="115" r="75" fill="#88A07A" />
          <circle cx="460" cy="140" r="60" fill="#6A8760" />
        </g>

        {/* Ground Grass Wash */}
        <path d="M 0,230 Q 150,225 300,228 T 500,227 L 500,300 L 0,300 Z" fill="#8FA580" opacity="0.65" filter="url(#softWatercolor2)" />
        <rect x="0" y="245" width="500" height="55" fill="#738C64" opacity="0.5" />

        {/* Concrete Foundation Plinth */}
        <rect x="110" y="215" width="280" height="15" fill="#B8B2A6" rx="2" />

        {/* Modern Villa Structure - White Stucco with dark trims */}
        <rect x="115" y="90" width="170" height="125" fill="url(#whiteStucco)" stroke="#8A8275" strokeWidth="1.5" rx="3" />
        <rect x="270" y="115" width="120" height="100" fill="#D7CEC0" stroke="#8A8275" strokeWidth="1.5" rx="2" />

        {/* Overhanging flat roof slab */}
        <rect x="105" y="85" width="190" height="7" fill="#3D3833" rx="1.5" />
        <rect x="265" y="110" width="130" height="6" fill="#3D3833" rx="1.5" />

        {/* Floor-to-ceiling glass corner windows */}
        <g fill="url(#glassGrad2)" stroke="#2D2926" strokeWidth="2">
          <rect x="135" y="110" width="60" height="95" rx="1" />
          <line x1="165" y1="110" x2="165" y2="205" stroke="#2D2926" strokeWidth="1.5" />
          <line x1="135" y1="155" x2="195" y2="155" stroke="#2D2926" strokeWidth="1.5" />

          {/* Dining Terrace Opening */}
          <rect x="210" y="125" width="65" height="80" rx="1" />
          <line x1="242" y1="125" x2="242" y2="205" stroke="#2D2926" strokeWidth="1.5" />

          {/* Right wing windows */}
          <rect x="290" y="135" width="40" height="45" rx="1" />
          <rect x="340" y="135" width="40" height="45" rx="1" />
        </g>

        {/* Front stone pathway */}
        <polygon points="210,230 250,230 280,300 180,300" fill="#CEC7BB" opacity="0.85" />
      </svg>
    );
  }

  if (variant === 'vastu_priority') {
    return (
      <svg viewBox="0 0 500 300" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="skyGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDFBF7" />
            <stop offset="100%" stopColor="#F5EFE6" />
          </linearGradient>
          <linearGradient id="stoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DFD8CE" />
            <stop offset="100%" stopColor="#C4BBAF" />
          </linearGradient>
          <filter id="softWatercolor3" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>

        <rect width="500" height="300" fill="url(#skyGrad3)" />

        {/* Trees */}
        <g opacity="0.45" filter="url(#softWatercolor3)">
          <circle cx="70" cy="130" r="70" fill="#6A8B63" />
          <circle cx="430" cy="120" r="80" fill="#75936C" />
          <circle cx="480" cy="150" r="60" fill="#587451" />
        </g>

        {/* Grass */}
        <path d="M 0,228 Q 200,225 350,230 T 500,227 L 500,300 L 0,300 Z" fill="#849C76" opacity="0.7" filter="url(#softWatercolor3)" />

        {/* Foundation */}
        <rect x="95" y="215" width="310" height="15" fill="#B2ABA0" rx="2" />

        {/* G+1 Balanced Vastu Home with Terracotta & Stone */}
        <rect x="100" y="85" width="160" height="130" fill="#EAE5DC" stroke="#877E72" strokeWidth="1.5" rx="3" />
        <rect x="250" y="115" width="150" height="100" fill="url(#stoneGrad)" stroke="#877E72" strokeWidth="1.5" rx="3" />

        {/* Parapet / Terracotta accent band */}
        <rect x="95" y="80" width="170" height="8" fill="#C08552" rx="1.5" />
        <rect x="245" y="110" width="160" height="7" fill="#C08552" rx="1.5" />

        {/* Windows & Balcony with Glass */}
        <g fill="#B4CCD4" stroke="#262320" strokeWidth="1.8">
          <rect x="120" y="105" width="50" height="40" rx="1" />
          <line x1="145" y1="105" x2="145" y2="145" stroke="#262320" strokeWidth="1.2" />

          <rect x="180" y="105" width="60" height="40" rx="1" />
          <line x1="210" y1="105" x2="210" y2="145" stroke="#262320" strokeWidth="1.2" />

          {/* Ground floor door & window */}
          <rect x="120" y="160" width="45" height="55" fill="#654321" />
          <rect x="180" y="165" width="60" height="40" rx="1" />

          {/* Right wing corner window */}
          <rect x="275" y="135" width="105" height="50" rx="1" />
          <line x1="327" y1="135" x2="327" y2="185" stroke="#262320" strokeWidth="1.2" />
        </g>

        {/* Verandah entry steps */}
        <polygon points="120,215 165,215 180,250 105,250" fill="#D2CCC0" />
      </svg>
    );
  }

  // Default: Warm Wood Cladding Villa (Matches Reference Screenshot 2!)
  return (
    <svg viewBox="0 0 500 300" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="skyGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F6F9FA" />
          <stop offset="100%" stopColor="#F4F0E8" />
        </linearGradient>
        <linearGradient id="woodVertical" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C98A4B" />
          <stop offset="25%" stopColor="#D89A5A" />
          <stop offset="50%" stopColor="#BD7C3C" />
          <stop offset="75%" stopColor="#D59556" />
          <stop offset="100%" stopColor="#BA793A" />
        </linearGradient>
        <linearGradient id="windowGlass" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1C2833" />
          <stop offset="100%" stopColor="#0B1319" />
        </linearGradient>
        <filter id="softWatercolor1" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>

      {/* Sky */}
      <rect width="500" height="300" fill="url(#skyGrad1)" />

      {/* Organic Trees in background */}
      <g opacity="0.5" filter="url(#softWatercolor1)">
        <circle cx="100" cy="100" r="70" fill="#4B6B42" />
        <circle cx="170" cy="80" r="60" fill="#3D5A35" />
        <circle cx="390" cy="110" r="75" fill="#718B62" />
        <circle cx="450" cy="130" r="60" fill="#506E47" />
      </g>

      {/* Lush Greenery / Lawn */}
      <path d="M 0,225 Q 180,220 320,226 T 500,224 L 500,300 L 0,300 Z" fill="#789269" opacity="0.75" filter="url(#softWatercolor1)" />
      <rect x="0" y="245" width="500" height="55" fill="#5F7B50" opacity="0.6" />

      {/* Foundation Concrete Base */}
      <polygon points="120,215 390,215 400,230 110,230" fill="#9DA3A6" />

      {/* Main Cedar Wood Clad Volume (Matching Screenshot 2 House!) */}
      <polygon points="125,75 305,65 305,215 125,215" fill="url(#woodVertical)" stroke="#5A3A1B" strokeWidth="1.2" />

      {/* Wood slats line pattern */}
      <g stroke="#7E4D20" strokeWidth="0.8" opacity="0.65">
        <line x1="140" y1="74" x2="140" y2="215" />
        <line x1="155" y1="73" x2="155" y2="215" />
        <line x1="170" y1="72" x2="170" y2="215" />
        <line x1="185" y1="71" x2="185" y2="215" />
        <line x1="200" y1="70" x2="200" y2="215" />
        <line x1="215" y1="69" x2="215" y2="215" />
        <line x1="230" y1="68" x2="230" y2="215" />
        <line x1="245" y1="67" x2="245" y2="215" />
        <line x1="260" y1="66" x2="260" y2="215" />
        <line x1="275" y1="65" x2="275" y2="215" />
        <line x1="290" y1="64" x2="290" y2="215" />
      </g>

      {/* Offset Right Volume */}
      <polygon points="305,80 395,85 395,215 305,215" fill="url(#woodVertical)" stroke="#5A3A1B" strokeWidth="1.2" />

      {/* Roof Fascia & Cap */}
      <polygon points="120,73 308,63 308,68 120,78" fill="#222222" />
      <polygon points="305,78 400,83 400,88 305,83" fill="#222222" />

      {/* Tall Narrow Modern Windows on Left Wing */}
      <g fill="url(#windowGlass)" stroke="#111111" strokeWidth="2">
        <rect x="145" y="95" width="12" height="65" rx="1" />
        <rect x="165" y="94" width="12" height="65" rx="1" />
        <rect x="185" y="93" width="12" height="65" rx="1" />
        <rect x="205" y="92" width="12" height="65" rx="1" />
        <rect x="225" y="91" width="12" height="65" rx="1" />
      </g>

      {/* Large Picture Window on Right Wing */}
      <g fill="url(#windowGlass)" stroke="#111111" strokeWidth="2.5">
        <rect x="325" y="110" width="55" height="55" rx="1.5" />
        <line x1="352" y1="110" x2="352" y2="165" stroke="#111111" strokeWidth="2" />
      </g>
    </svg>
  );
};

// Furnished 2D Architectural Floor Plan Schematic (Matching Screenshot 2 Plan!)
export const Furnished2DThumbnail = ({ floorPlan }) => {
  const currentFloor = floorPlan?.floors?.[0] || { rooms: [] };
  const rooms = currentFloor.rooms || [];
  const plot = floorPlan?.plot || { width: 30, length: 50 };

  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;

  return (
    <div className="w-full bg-[#FAF8F5] p-3 rounded-2xl flex items-center justify-center border border-[#EAE6DF]">
      <svg
        viewBox={`-2 -2 ${plotW + 4} ${plotL + 4}`}
        className="w-full max-h-[300px] object-contain select-none"
      >
        {/* Exterior Plot Boundary / Wall */}
        <rect
          x="0"
          y="0"
          width={plotW}
          height={plotL}
          fill="#FFFFFF"
          stroke="#333333"
          strokeWidth="1.2"
          rx="1"
        />

        {/* Room Blocks */}
        {rooms.map((room) => {
          let fill = '#FAF7F2';
          if (room.type === 'master_bedroom' || room.type === 'bedroom') fill = '#F7EDE8';
          if (room.type === 'bathroom' || room.type === 'attached_bathroom') fill = '#E6F2F7';
          if (room.type === 'kitchen') fill = '#FDF0E2';
          if (room.type === 'living' || room.type === 'dining') fill = '#FAF3E3';
          if (room.type === 'parking') fill = '#EBF5EB';
          if (room.type === 'pooja') fill = '#FCF7E3';

          return (
            <g key={room.id}>
              {/* Room Rectangle */}
              <rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                fill={fill}
                stroke="#666666"
                strokeWidth="0.8"
              />

              {/* Minimal Room Label */}
              <text
                x={room.x + room.width / 2}
                y={room.y + room.height / 2 - 0.5}
                fontSize="1.4"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
                fill="#333333"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {room.label.length > 14 ? room.label.slice(0, 12) + '…' : room.label}
              </text>

              {/* Area */}
              <text
                x={room.x + room.width / 2}
                y={room.y + room.height / 2 + 1.2}
                fontSize="1.1"
                fontFamily="monospace"
                fill="#777777"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {Math.round(room.width * room.height)} ft²
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const DesignConceptCard = ({
  option,
  isSelected = false,
  onSelect,
  variant = 'modern_wood',
}) => {
  const plan = option.floorPlan;
  const area = plan?.builtUpAreaSqFt || 1705;
  const plot = plan?.plot || { width: 30, length: 50 };
  const groundRooms = plan?.floors?.[0]?.rooms || [];
  const allRooms = plan?.floors?.flatMap(f => f.rooms) || [];
  const bedCount = allRooms.filter(r => r.type.includes('bedroom')).length || 3;
  const bathCount = allRooms.filter(r => r.type.includes('bathroom')).length || 2;

  return (
    <div
      onClick={() => onSelect && onSelect(option)}
      className={`
        bg-white rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between
        ${
          isSelected
            ? 'border-neutral-900 ring-2 ring-neutral-900 shadow-md scale-[1.01]'
            : 'border-[#EAE6DF] hover:border-neutral-400 hover:shadow-lg'
        }
      `}
    >
      {/* Top: Architectural Watercolor Exterior Render */}
      <div className="relative border-b border-[#EAE6DF] bg-[#FAF8F5] overflow-hidden">
        <WatercolorFacade variant={variant} />

        {/* Selected / Badge indicator */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur text-neutral-900 shadow-sm border border-neutral-200">
            {option.title || option.name}
          </span>
          {isSelected && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-950 text-white shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-white" />
              <span>Selected</span>
            </span>
          )}
        </div>
      </div>

      {/* Middle: Furnished 2D Blueprint Floor Plan Preview */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <Furnished2DThumbnail floorPlan={plan} />

        {/* Bottom Metadata Bar matching Screenshot 2 */}
        <div className="pt-2 border-t border-[#F2EFE9] flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Area badges */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EAE6DF] font-medium text-neutral-800">
              <Home className="w-3.5 h-3.5 text-neutral-500" />
              <span>{area} ft²</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#EAE6DF] font-medium text-neutral-800">
              <Maximize2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>{area} ft²</span>
            </span>
          </div>

          {/* Plot & BHK badges */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-600">
            <span>{plot.width} ft W × {plot.length} ft D</span>
            <span>•</span>
            <span>{bedCount} bd</span>
            <span>•</span>
            <span>{bathCount} ba</span>
          </div>
        </div>

        {/* View Details Action Link matching Screenshots */}
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#F2EFE9]">
          <span className="text-[11px] font-semibold text-neutral-500">
            Click to activate layout
          </span>
          <span className="text-xs font-semibold text-neutral-900 group-hover:underline flex items-center gap-1">
            <span>Inspect Details</span>
            <span className="text-xs">→</span>
          </span>
        </div>
      </div>
    </div>
  );
};

// "+ Start New Design" Blank Card matching Screenshot 2
export const StartNewDesignCard = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl border-2 border-dashed border-[#DDD7CD] hover:border-neutral-900 transition-all duration-300 p-8 flex flex-col items-center justify-center min-h-[460px] cursor-pointer group shadow-2xs hover:shadow-md"
    >
      <div className="w-14 h-14 rounded-full bg-[#FAF8F5] group-hover:bg-neutral-950 group-hover:text-white text-neutral-700 flex items-center justify-center transition-colors mb-4 border border-[#EAE6DF]">
        <Plus className="w-6 h-6 stroke-[2]" />
      </div>
      <h4 className="font-serif text-xl font-semibold text-neutral-900 group-hover:text-neutral-950 mb-1">
        Start New Design
      </h4>
      <p className="text-xs text-neutral-500 text-center max-w-[200px]">
        Generate an alternate concept or customize your spatial brief.
      </p>
    </div>
  );
};
