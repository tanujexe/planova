import React, { useState } from 'react';
import { 
  Box, 
  Trash2, 
  Plus, 
  Minus, 
  Info, 
  Layers, 
  Check, 
  Ruler, 
  Compass, 
  Home, 
  Bed, 
  Bath, 
  Sparkles, 
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  Car,
  Utensils,
  DoorOpen
} from 'lucide-react';
import { RoomIsometricSketch } from './RoomIsometricSketch.jsx';

export const ROOM_DEFINITIONS = [
  // --- Beds & Baths ---
  {
    id: 'primary_bedroom',
    category: 'beds_baths',
    label: 'Primary Bed',
    icon: Bed,
    color: 'bg-[#FEEAE5]',
    borderColor: 'border-[#F9BEB3]',
    textColor: 'text-[#6C3428]',
    sizes: {
      S: { width: 13, height: 14, area: 182, label: '13 × 14 ft' },
      M: { width: 15, height: 15, area: 225, label: '15 × 15 ft' },
      L: { width: 16, height: 17.5, area: 280, label: '16 × 17.5 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'bedroom',
    category: 'beds_baths',
    label: 'Bedroom',
    icon: Bed,
    color: 'bg-[#FEEAE5]',
    borderColor: 'border-[#F9BEB3]',
    textColor: 'text-[#6C3428]',
    sizes: {
      S: { width: 10, height: 12, area: 120, label: '10 × 12 ft' },
      M: { width: 12, height: 12.6, area: 152, label: '12 × 12.6 ft' },
      L: { width: 13, height: 15, area: 195, label: '13 × 15 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'primary_bathroom',
    category: 'beds_baths',
    label: 'Primary Bath',
    icon: Bath,
    color: 'bg-[#E0F2FE]',
    borderColor: 'border-[#BAE6FD]',
    textColor: 'text-[#075985]',
    sizes: {
      S: { width: 7, height: 8, area: 56, label: '7 × 8 ft' },
      M: { width: 8, height: 11, area: 88, label: '8 × 11 ft' },
      L: { width: 10, height: 11, area: 110, label: '10 × 11 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'bathroom',
    category: 'beds_baths',
    label: 'Bathroom',
    icon: Bath,
    color: 'bg-[#E0F2FE]',
    borderColor: 'border-[#BAE6FD]',
    textColor: 'text-[#075985]',
    sizes: {
      S: { width: 6, height: 7, area: 42, label: '6 × 7 ft' },
      M: { width: 7, height: 8.7, area: 61, label: '7 × 8.7 ft' },
      L: { width: 8, height: 10, area: 80, label: '8 × 10 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'primary_closet',
    category: 'beds_baths',
    label: 'Primary Closet',
    subtitle: 'Auto-included with Primary Bed',
    icon: Layers,
    color: 'bg-[#FDEBD2]',
    borderColor: 'border-[#FBD3A4]',
    textColor: 'text-[#7C2D12]',
    sizes: {
      S: { width: 5, height: 8, area: 40, label: '5 × 8 ft' },
      M: { width: 7, height: 9, area: 62, label: '7 × 9 ft' },
      L: { width: 8, height: 10.5, area: 84, label: '8 × 10.5 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'bed_closet',
    category: 'beds_baths',
    label: 'Bed Closet',
    subtitle: 'Auto-included with Bedroom',
    icon: Layers,
    color: 'bg-[#FDEBD2]',
    borderColor: 'border-[#FBD3A4]',
    textColor: 'text-[#7C2D12]',
    sizes: {
      S: { width: 4, height: 4, area: 16, label: '4 × 4 ft' },
      M: { width: 4.5, height: 5.1, area: 23, label: '4.5 × 5.1 ft' },
      L: { width: 5, height: 7, area: 35, label: '5 × 7 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },

  // --- Living Spaces ---
  {
    id: 'kitchen',
    category: 'living_spaces',
    label: 'Kitchen',
    icon: Utensils,
    color: 'bg-[#FFEDD5]',
    borderColor: 'border-[#FED7AA]',
    textColor: 'text-[#7C2D12]',
    sizes: {
      S: { width: 9, height: 10, area: 90, label: '9 × 10 ft' },
      M: { width: 10, height: 13, area: 130, label: '10 × 13 ft' },
      L: { width: 12, height: 15, area: 180, label: '12 × 15 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'dining',
    category: 'living_spaces',
    label: 'Dining',
    icon: Utensils,
    color: 'bg-[#FEF3C7]',
    borderColor: 'border-[#FDE68A]',
    textColor: 'text-[#78350F]',
    sizes: {
      S: { width: 8, height: 10, area: 80, label: '8 × 10 ft' },
      M: { width: 10, height: 12, area: 120, label: '10 × 12 ft' },
      L: { width: 12, height: 13.5, area: 162, label: '12 × 13.5 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'breakfast_nook',
    category: 'living_spaces',
    label: 'Breakfast Nook',
    icon: Utensils,
    color: 'bg-[#FEF3C7]',
    borderColor: 'border-[#FDE68A]',
    textColor: 'text-[#78350F]',
    sizes: {
      S: { width: 5, height: 8, area: 40, label: '5 × 8 ft' },
      M: { width: 6, height: 10, area: 60, label: '6 × 10 ft' },
      L: { width: 8, height: 10.5, area: 84, label: '8 × 10.5 ft' },
    },
    defaultCount: 0,
    defaultSize: 'M',
  },
  {
    id: 'pantry',
    category: 'living_spaces',
    label: 'Pantry',
    icon: Layers,
    color: 'bg-[#F1F5F9]',
    borderColor: 'border-[#CBD5E1]',
    textColor: 'text-[#334155]',
    sizes: {
      S: { width: 5, height: 5, area: 25, label: '5 × 5 ft' },
      M: { width: 5, height: 8, area: 40, label: '5 × 8 ft' },
      L: { width: 6, height: 10, area: 60, label: '6 × 10 ft' },
    },
    defaultCount: 0,
    defaultSize: 'M',
  },
  {
    id: 'living',
    category: 'living_spaces',
    label: 'Living',
    icon: Home,
    color: 'bg-[#FEF3C7]',
    borderColor: 'border-[#FDE68A]',
    textColor: 'text-[#78350F]',
    sizes: {
      S: { width: 12, height: 13.5, area: 162, label: '12 × 13.5 ft' },
      M: { width: 14, height: 15.7, area: 220, label: '14 × 15.7 ft' },
      L: { width: 17, height: 17.5, area: 298, label: '17 × 17.5 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },

  // --- Special & Indian Living ---
  {
    id: 'pooja',
    category: 'special_spaces',
    label: 'Pooja Room',
    icon: Sparkles,
    color: 'bg-[#FFFBEB]',
    borderColor: 'border-[#FDE68A]',
    textColor: 'text-[#92400E]',
    sizes: {
      S: { width: 4, height: 6, area: 24, label: '4 × 6 ft' },
      M: { width: 6, height: 8, area: 48, label: '6 × 8 ft' },
      L: { width: 8, height: 9, area: 72, label: '8 × 9 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'parking',
    category: 'special_spaces',
    label: 'Car Parking',
    icon: Car,
    color: 'bg-[#DCFCE7]',
    borderColor: 'border-[#BBF7D0]',
    textColor: 'text-[#166534]',
    sizes: {
      S: { width: 10, height: 13, area: 130, label: '10 × 13 ft' },
      M: { width: 11, height: 14, area: 154, label: '11 × 14 ft' },
      L: { width: 12, height: 18, area: 216, label: '12 × 18 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'utility',
    category: 'special_spaces',
    label: 'Utility Balcony',
    icon: Layers,
    color: 'bg-[#F1F5F9]',
    borderColor: 'border-[#CBD5E1]',
    textColor: 'text-[#334155]',
    sizes: {
      S: { width: 5, height: 7, area: 35, label: '5 × 7 ft' },
      M: { width: 6, height: 9, area: 54, label: '6 × 9 ft' },
      L: { width: 8, height: 10, area: 80, label: '8 × 10 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
  {
    id: 'foyer',
    category: 'special_spaces',
    label: 'Entrance Foyer',
    icon: DoorOpen,
    color: 'bg-[#FAF5FF]',
    borderColor: 'border-[#E9D5FF]',
    textColor: 'text-[#581C87]',
    sizes: {
      S: { width: 5, height: 6, area: 30, label: '5 × 6 ft' },
      M: { width: 6, height: 7.5, area: 45, label: '6 × 7.5 ft' },
      L: { width: 7, height: 10, area: 70, label: '7 × 10 ft' },
    },
    defaultCount: 1,
    defaultSize: 'M',
  },
];

export const RoomCatalogBuilder = ({ onBuildProject }) => {
  // Room quantities & chosen sizes (S/M/L)
  const [roomSelections, setRoomSelections] = useState(() => {
    const initial = {};
    ROOM_DEFINITIONS.forEach((def) => {
      initial[def.id] = {
        count: def.defaultCount,
        size: def.defaultSize,
      };
    });
    return initial;
  });

  const [activeRoomId, setActiveRoomId] = useState('primary_bedroom');

  // Plot Area Decider states
  const [plotWidth, setPlotWidth] = useState(30);
  const [plotLength, setPlotLength] = useState(50);
  const [stories, setStories] = useState(2); // 1 Story (Ground) or 2 Story (G+1)
  const [plotFacing, setPlotFacing] = useState('north');
  const [budgetInr, setBudgetInr] = useState(3500000);
  const [projectName, setProjectName] = useState('My Dream Home');
  const [isPlotDrawerOpen, setIsPlotDrawerOpen] = useState(false);

  // Active room definition
  const activeDef = ROOM_DEFINITIONS.find((r) => r.id === activeRoomId) || ROOM_DEFINITIONS[0];
  const activeSize = roomSelections[activeRoomId]?.size || 'M';

  // Increment / Decrement handlers
  const handleUpdateCount = (roomId, delta) => {
    setRoomSelections((prev) => {
      const current = prev[roomId] || { count: 0, size: 'M' };
      const newCount = Math.max(0, current.count + delta);
      return {
        ...prev,
        [roomId]: {
          ...current,
          count: newCount,
        },
      };
    });
  };

  const handleUpdateSize = (roomId, newSize) => {
    setRoomSelections((prev) => {
      const current = prev[roomId] || { count: 1, size: 'M' };
      return {
        ...prev,
        [roomId]: {
          ...current,
          size: newSize,
        },
      };
    });
  };

  const handleClearAll = () => {
    setRoomSelections((prev) => {
      const cleared = {};
      Object.keys(prev).forEach((key) => {
        cleared[key] = { ...prev[key], count: 0 };
      });
      return cleared;
    });
  };

  // Compile list of added rooms
  const addedRooms = [];
  let totalBuiltUp = 0;

  ROOM_DEFINITIONS.forEach((def) => {
    const sel = roomSelections[def.id];
    if (sel && sel.count > 0) {
      for (let i = 0; i < sel.count; i++) {
        const sizeData = def.sizes[sel.size] || def.sizes.M;
        totalBuiltUp += sizeData.area;
        addedRooms.push({
          id: `${def.id}-${i}`,
          typeId: def.id,
          label: def.label,
          size: sel.size,
          area: sizeData.area,
          width: sizeData.width,
          height: sizeData.height,
          color: def.color,
          borderColor: def.borderColor,
          textColor: def.textColor,
        });
      }
    }
  });

  // Calculate Capacity against Plot Area
  const totalPlotArea = plotWidth * plotLength;
  const maxBuildableFloorArea = Math.round(totalPlotArea * 0.72 * stories);
  const capacityPercent = Math.min(100, Math.round((totalBuiltUp / maxBuildableFloorArea) * 100));

  // Presets for quick plot sizing
  const PLOT_PRESETS = [
    { label: '30 × 50 ft', w: 30, l: 50, desc: 'Standard 1,500 sq.ft' },
    { label: '25 × 40 ft', w: 25, l: 40, desc: 'Compact 1,000 sq.ft' },
    { label: '40 × 60 ft', w: 40, l: 60, desc: 'Spacious 2,400 sq.ft' },
    { label: '20 × 50 ft', w: 20, l: 50, desc: 'Narrow Urban 1,000 sq.ft' },
  ];

  const handleContinue = () => {
    // Determine BHK from bedrooms
    const bedCount = (roomSelections['primary_bedroom']?.count || 0) + (roomSelections['bedroom']?.count || 0);
    const bathCount = (roomSelections['primary_bathroom']?.count || 0) + (roomSelections['bathroom']?.count || 0);

    const projectData = {
      name: projectName || 'My Dream Home',
      location: 'Bhopal, Madhya Pradesh',
      plot: {
        width: Number(plotWidth) || 30,
        length: Number(plotLength) || 50,
        unit: 'ft',
        floors: Number(stories) || 2,
        roadSide: plotFacing,
        facing: plotFacing,
        setbacks: { front: 3, rear: 3, left: 2, right: 2 },
      },
      requirements: {
        bhk: Math.max(1, bedCount),
        bathrooms: Math.max(1, bathCount),
        attachedBathrooms: Math.min(bathCount, bedCount),
        rooms: addedRooms.map(r => ({ type: r.typeId, count: 1, size: r.size })),
        parking: { cars: roomSelections['parking']?.count || 1, twoWheelers: 1 },
        ventilation: 'high',
        vastu: 'basic',
        budgetInr: budgetInr,
        quality: 'standard',
      },
    };

    if (onBuildProject) {
      onBuildProject(projectData);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-xs overflow-hidden">
      
      {/* =========================================================================
          TOP BAR: Room Catalog Header & Plot Area Decider Toggle
         ========================================================================= */}
      <div className="px-6 py-4 border-b border-[#EAE6DF] flex flex-wrap items-center justify-between gap-4 bg-[#FAF8F5]">
        
        {/* Left Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-950 text-white flex items-center justify-center">
            <Box className="w-4 h-4" />
          </div>
          <h2 className="font-serif text-lg font-bold text-neutral-900">
            Room Catalog
          </h2>
        </div>

        {/* Center: Plot Area Decider Quick Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlotDrawerOpen(!isPlotDrawerOpen)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-[#DDD7CD] hover:border-neutral-950 text-xs font-semibold text-neutral-800 transition-all shadow-2xs"
          >
            <Ruler className="w-3.5 h-3.5 text-neutral-500" />
            <span>Plot: {plotWidth} × {plotLength} ft ({totalPlotArea} sq.ft)</span>
            <span className="text-neutral-300">•</span>
            <span>{stories === 1 ? '1 Story' : '2 Story (G+1)'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>

        {/* Right: Clear All Button matching Screenshot */}
        <button
          onClick={handleClearAll}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#DDD7CD] hover:border-red-300 hover:bg-red-50 text-neutral-700 hover:text-red-700 text-xs font-semibold transition-colors shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
          <span>Clear All</span>
        </button>
      </div>

      {/* =========================================================================
          COLLAPSIBLE PLOT AREA DECIDER DRAWER
         ========================================================================= */}
      {isPlotDrawerOpen && (
        <div className="p-6 bg-[#F5F2EC] border-b border-[#EAE6DF] animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  Decide Your Plot Area & Story Configuration
                </h3>
                <p className="text-xs text-neutral-600">
                  Adjust plot boundaries to calibrate spatial capacity and buildable footprint.
                </p>
              </div>
              <button
                onClick={() => setIsPlotDrawerOpen(false)}
                className="px-3 py-1 bg-neutral-950 text-white rounded-lg text-xs font-semibold"
              >
                Done
              </button>
            </div>

            {/* Quick Plot Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-neutral-500 font-semibold mr-1">
                Presets:
              </span>
              {PLOT_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setPlotWidth(p.w);
                    setPlotLength(p.l);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    plotWidth === p.w && plotLength === p.l
                      ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs'
                      : 'bg-white text-neutral-700 border-[#DDD7CD] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Manual Dimensions, Stories, and Facing */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 font-semibold mb-1">
                  Width (ft)
                </label>
                <input
                  type="number"
                  value={plotWidth}
                  onChange={(e) => setPlotWidth(Math.max(15, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD7CD] text-xs font-bold text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 font-semibold mb-1">
                  Length / Depth (ft)
                </label>
                <input
                  type="number"
                  value={plotLength}
                  onChange={(e) => setPlotLength(Math.max(20, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD7CD] text-xs font-bold text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 font-semibold mb-1">
                  Structure / Stories
                </label>
                <select
                  value={stories}
                  onChange={(e) => setStories(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD7CD] text-xs font-semibold text-neutral-900"
                >
                  <option value={1}>1 Story (Ground Only)</option>
                  <option value={2}>2 Stories (G+1 Duplex)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-neutral-500 font-semibold mb-1">
                  Plot Facing
                </label>
                <select
                  value={plotFacing}
                  onChange={(e) => setPlotFacing(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#DDD7CD] text-xs font-semibold text-neutral-900"
                >
                  <option value="north">North Facing</option>
                  <option value="east">East Facing</option>
                  <option value="south">South Facing</option>
                  <option value="west">West Facing</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN 3-COLUMN LAYOUT (Matching Screenshot 100%)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        
        {/* -------------------------------------------------------------
            LEFT COLUMN: Room Catalog List with Categories & Steppers
           ------------------------------------------------------------- */}
        <div className="lg:col-span-4 border-r border-[#EAE6DF] p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[700px]">
          
          {/* Category 1: Beds & Baths */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono">
              <span className="text-neutral-400">≡</span>
              <span>Beds & Baths</span>
            </div>

            <div className="space-y-2">
              {ROOM_DEFINITIONS.filter(r => r.category === 'beds_baths').map((room) => {
                const count = roomSelections[room.id]?.count || 0;
                const isSelected = activeRoomId === room.id;
                const Icon = room.icon;

                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`
                      p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3
                      ${
                        count > 0
                          ? `${room.color} ${room.borderColor} shadow-2xs`
                          : 'bg-white border-[#EAE6DF] hover:bg-[#FAF8F5]'
                      }
                      ${isSelected ? 'ring-2 ring-neutral-900' : ''}
                    `}
                  >
                    {/* Left: Icon & Label */}
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${count > 0 ? 'bg-white/80' : 'bg-[#FAF8F5]'}`}>
                        <Icon className={`w-4 h-4 ${count > 0 ? room.textColor : 'text-neutral-500'}`} />
                      </div>
                      <div>
                        <h4 className={`text-xs font-semibold ${count > 0 ? room.textColor : 'text-neutral-800'}`}>
                          {room.label}
                        </h4>
                        {room.subtitle && (
                          <p className="text-[10px] text-neutral-400 leading-tight">
                            {room.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Quantity Stepper matching Screenshot */}
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {count > 0 && (
                        <button
                          onClick={() => handleUpdateCount(room.id, -1)}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="w-5 text-center text-xs font-bold font-mono text-neutral-900">
                        {count > 0 ? count : ''}
                      </span>

                      <button
                        onClick={() => handleUpdateCount(room.id, 1)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-2xs ${
                          count > 0 
                            ? 'bg-white/90 hover:bg-white border border-neutral-300 text-neutral-700' 
                            : 'bg-[#F5F2EC] hover:bg-[#EAE6DF] text-neutral-800 border border-[#DDD7CD]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category 2: Living Spaces */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono">
              <div className="w-1 h-3.5 bg-amber-400 rounded-full" />
              <span>Living Spaces</span>
            </div>

            <div className="space-y-2">
              {ROOM_DEFINITIONS.filter(r => r.category === 'living_spaces').map((room) => {
                const count = roomSelections[room.id]?.count || 0;
                const isSelected = activeRoomId === room.id;
                const Icon = room.icon;

                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`
                      p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3
                      ${
                        count > 0
                          ? `${room.color} ${room.borderColor} shadow-2xs`
                          : 'bg-white border-[#EAE6DF] hover:bg-[#FAF8F5]'
                      }
                      ${isSelected ? 'ring-2 ring-neutral-900' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${count > 0 ? 'bg-white/80' : 'bg-[#FAF8F5]'}`}>
                        <Icon className={`w-4 h-4 ${count > 0 ? room.textColor : 'text-neutral-500'}`} />
                      </div>
                      <h4 className={`text-xs font-semibold ${count > 0 ? room.textColor : 'text-neutral-800'}`}>
                        {room.label}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {count > 0 && (
                        <button
                          onClick={() => handleUpdateCount(room.id, -1)}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="w-5 text-center text-xs font-bold font-mono text-neutral-900">
                        {count > 0 ? count : ''}
                      </span>

                      <button
                        onClick={() => handleUpdateCount(room.id, 1)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-2xs ${
                          count > 0 
                            ? 'bg-white/90 hover:bg-white border border-neutral-300 text-neutral-700' 
                            : 'bg-[#F5F2EC] hover:bg-[#EAE6DF] text-neutral-800 border border-[#DDD7CD]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category 3: Special & Indian Living */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono">
              <div className="w-1 h-3.5 bg-emerald-500 rounded-full" />
              <span>Special & Indian Spaces</span>
            </div>

            <div className="space-y-2">
              {ROOM_DEFINITIONS.filter(r => r.category === 'special_spaces').map((room) => {
                const count = roomSelections[room.id]?.count || 0;
                const isSelected = activeRoomId === room.id;
                const Icon = room.icon;

                return (
                  <div
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`
                      p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3
                      ${
                        count > 0
                          ? `${room.color} ${room.borderColor} shadow-2xs`
                          : 'bg-white border-[#EAE6DF] hover:bg-[#FAF8F5]'
                      }
                      ${isSelected ? 'ring-2 ring-neutral-900' : ''}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${count > 0 ? 'bg-white/80' : 'bg-[#FAF8F5]'}`}>
                        <Icon className={`w-4 h-4 ${count > 0 ? room.textColor : 'text-neutral-500'}`} />
                      </div>
                      <h4 className={`text-xs font-semibold ${count > 0 ? room.textColor : 'text-neutral-800'}`}>
                        {room.label}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {count > 0 && (
                        <button
                          onClick={() => handleUpdateCount(room.id, -1)}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white border border-neutral-300 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition-colors shadow-2xs"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <span className="w-5 text-center text-xs font-bold font-mono text-neutral-900">
                        {count > 0 ? count : ''}
                      </span>

                      <button
                        onClick={() => handleUpdateCount(room.id, 1)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-2xs ${
                          count > 0 
                            ? 'bg-white/90 hover:bg-white border border-neutral-300 text-neutral-700' 
                            : 'bg-[#F5F2EC] hover:bg-[#EAE6DF] text-neutral-800 border border-[#DDD7CD]'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* -------------------------------------------------------------
            CENTER COLUMN: Architectural Isometric Sketch & S / M / L Selector
           ------------------------------------------------------------- */}
        <div className="lg:col-span-4 border-r border-[#EAE6DF] p-6 flex flex-col justify-between items-center bg-[#FAF8F5]">
          
          {/* Top: Isometric Wireframe Graphic */}
          <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
            <RoomIsometricSketch 
              roomType={activeDef.id} 
              size={activeSize} 
            />

            {/* Room Bubble Pill under graphic matching Screenshot */}
            <div className="mt-4">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs border ${activeDef.color} ${activeDef.borderColor} ${activeDef.textColor}`}>
                {activeDef.label} {activeSize} - {activeDef.sizes[activeSize]?.area} ft²
              </span>
            </div>
          </div>

          {/* Bottom: Room Label + S / M / L Size Buttons */}
          <div className="w-full pt-6 border-t border-[#EAE6DF] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-800">
                {activeDef.label}
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                ({activeDef.sizes[activeSize]?.label})
              </span>
            </div>

            {/* S | M | L Selector Pills matching Screenshot */}
            <div className="flex items-center gap-1.5">
              {['S', 'M', 'L'].map((sizeKey) => {
                const isCurrentSize = activeSize === sizeKey;
                return (
                  <button
                    key={sizeKey}
                    onClick={() => handleUpdateSize(activeDef.id, sizeKey)}
                    className={`
                      w-8 h-8 rounded-xl text-xs font-bold transition-all shadow-2xs
                      ${
                        isCurrentSize
                          ? 'bg-neutral-950 text-white shadow-xs'
                          : 'bg-white hover:bg-[#F5F2EC] text-neutral-700 border border-[#DDD7CD]'
                      }
                    `}
                  >
                    {sizeKey}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* -------------------------------------------------------------
            RIGHT COLUMN: "My Rooms" Bubble Canvas, Capacity & Build Button
           ------------------------------------------------------------- */}
        <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-white">
          
          <div className="space-y-6">
            
            {/* My Rooms Header matching Screenshot */}
            <div className="flex items-center justify-between pb-4 border-b border-[#EAE6DF]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#FAF8F5] border border-[#EAE6DF] flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                  </div>
                </div>
                <h3 className="font-serif text-base font-bold text-neutral-900">
                  My Rooms
                </h3>
                <span className="text-xs font-semibold text-neutral-600 font-mono">
                  {addedRooms.length} Rooms
                </span>
              </div>

              {/* Story selector pill matching Screenshot */}
              <button
                onClick={() => setStories(stories === 1 ? 2 : 1)}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] hover:bg-[#F5F2EC] border border-[#DDD7CD] rounded-xl text-xs font-semibold text-neutral-800 transition-colors"
              >
                <span>{stories === 1 ? '1 Story' : '2 Story (G+1)'}</span>
              </button>
            </div>

            {/* Room Bubbles Canvas matching Screenshot */}
            <div className="flex flex-wrap gap-2.5 max-h-[300px] overflow-y-auto p-1">
              {addedRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => setActiveRoomId(room.typeId)}
                  className={`
                    p-3 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs
                    ${room.color} ${room.borderColor} ${room.textColor}
                    ${activeRoomId === room.typeId ? 'ring-2 ring-neutral-900 scale-105' : ''}
                  `}
                >
                  <div className="text-[11px] font-bold leading-tight">
                    {room.label}
                  </div>
                  <div className="text-[10px] font-mono opacity-80 pt-0.5">
                    {room.size} {room.area} ft²
                  </div>
                </div>
              ))}
            </div>

            {/* Room List Capacity Progress Bar matching Screenshot */}
            <div className="pt-4 border-t border-[#F2EFE9] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-neutral-600">
                  <span>Room List Capacity</span>
                  <Info className="w-3.5 h-3.5 text-neutral-400" />
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                  <span>{capacityPercent}% Filled</span>
                  <span className={`w-2 h-2 rounded-full ${
                    capacityPercent <= 75 ? 'bg-emerald-500' : capacityPercent <= 95 ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-[#F5F2EC] rounded-full overflow-hidden border border-[#EAE6DF]">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    capacityPercent <= 75 ? 'bg-emerald-500' : capacityPercent <= 95 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, capacityPercent)}%` }}
                />
              </div>

              <p className="text-[11px] text-neutral-400">
                Based on {plotWidth}×{plotLength} ft plot ({maxBuildableFloorArea} sq.ft buildable footprint).
              </p>
            </div>

          </div>

          {/* Bottom Summary Card & Big Continue Button matching Screenshot */}
          <div className="pt-6 border-t border-[#EAE6DF] space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-600 font-mono">
              <span>Total <strong>{totalBuiltUp} ft²</strong></span>
              <span className="text-neutral-300">•</span>
              <span>Heated <strong>{totalBuiltUp} ft²</strong></span>
              <span className="text-neutral-300">•</span>
              <span>{stories === 1 ? '1 Story' : '2 Story'}</span>
            </div>

            {/* Black CTA Button with Grid Icon matching Screenshot */}
            <button
              onClick={handleContinue}
              disabled={addedRooms.length === 0}
              className="w-full py-3.5 px-5 bg-neutral-950 hover:bg-neutral-800 disabled:opacity-40 text-white rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 transition-all shadow-md hover:shadow-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-xs bg-white" />
                  <span className="w-1.5 h-1.5 rounded-xs bg-white" />
                  <span className="w-1.5 h-1.5 rounded-xs bg-white" />
                  <span className="w-1.5 h-1.5 rounded-xs bg-white" />
                </div>
                <span>Generate Design ({addedRooms.length} rooms)</span>
              </div>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
