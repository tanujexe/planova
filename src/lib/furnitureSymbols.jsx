/**
 * 2D Architectural CAD Vector & Realistic Rendered Symbols for Furniture
 * Provides high-fidelity top-down architectural graphics with cushions, pillows, rugs, plants, sanitary fixtures, cars, and cooktops.
 */

import React from 'react';

export const CadFurnitureSymbol = ({ type, widthPx, lengthPx, rotation = 0, isRendered = true }) => {
  const w = widthPx;
  const l = lengthPx;

  const renderContent = () => {
    switch (type) {
      case 'rug_area':
      case 'rug_bedroom':
        return (
          <g>
            {/* Outer Rug Border with subtle woven fringe */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#ECE6DB" stroke="#D1C7B7" strokeWidth="1" rx="4" />
            {/* Inner Decorative Inset Panel */}
            <rect x={w * 0.08} y={l * 0.08} width={w * 0.84} height={l * 0.84} fill="#E2D9CB" stroke="#BAAE9B" strokeWidth="0.8" strokeDasharray="3,2" rx="2" />
            {/* Center Weave Motif */}
            <rect x={w * 0.22} y={l * 0.22} width={w * 0.56} height={l * 0.56} fill="#DDD3C3" stroke="#C5B9A6" strokeWidth="0.6" rx="2" />
            {/* Fringe details on ends */}
            <line x1="2" y1="2" x2="2" y2={l - 2} stroke="#B3A694" strokeWidth="1" strokeDasharray="2,2" />
            <line x1={w - 2} y1="2" x2={w - 2} y2={l - 2} stroke="#B3A694" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        );

      case 'plant_pot':
        return (
          <g>
            {/* Pot base shadow */}
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.44} fill="#4A5568" opacity="0.15" />
            {/* Ceramic Pot Rim */}
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.38} fill="#C29B7F" stroke="#8C6549" strokeWidth="1.2" />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.28} fill="#3E2723" />
            {/* Lush Overlapping Green Leaves */}
            <ellipse cx={w / 2} cy={l * 0.25} rx={w * 0.16} ry={l * 0.24} fill="#2E7D32" stroke="#1B5E20" strokeWidth="0.8" />
            <ellipse cx={w / 2} cy={l * 0.75} rx={w * 0.16} ry={l * 0.24} fill="#388E3C" stroke="#1B5E20" strokeWidth="0.8" />
            <ellipse cx={w * 0.25} cy={l / 2} rx={w * 0.24} ry={l * 0.16} fill="#43A047" stroke="#1B5E20" strokeWidth="0.8" />
            <ellipse cx={w * 0.75} cy={l / 2} rx={w * 0.24} ry={l * 0.16} fill="#4CAF50" stroke="#1B5E20" strokeWidth="0.8" />
            {/* Diagonal Leaf Spreads */}
            <ellipse cx={w * 0.32} cy={l * 0.32} rx={w * 0.18} ry={l * 0.18} fill="#66BB6A" stroke="#2E7D32" strokeWidth="0.6" transform={`rotate(45, ${w*0.32}, ${l*0.32})`} />
            <ellipse cx={w * 0.68} cy={l * 0.68} rx={w * 0.18} ry={l * 0.18} fill="#81C784" stroke="#2E7D32" strokeWidth="0.6" transform={`rotate(45, ${w*0.68}, ${l*0.68})`} />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.12} fill="#1B5E20" />
          </g>
        );

      case 'car_sedan':
        return (
          <g>
            {/* Sedan Body */}
            <rect x="2" y="2" width={w - 4} height={l - 4} fill="#F8FAFC" stroke="#334155" strokeWidth="1.5" rx={w * 0.25} />
            {/* Windshield Front */}
            <path d={`M ${w * 0.15},${l * 0.26} L ${w * 0.85},${l * 0.26} L ${w * 0.78},${l * 0.38} L ${w * 0.22},${l * 0.38} Z`} fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
            {/* Roof Top */}
            <rect x={w * 0.2} y={l * 0.38} width={w * 0.6} height={l * 0.28} fill="#E2E8F0" stroke="#64748B" strokeWidth="0.8" rx="2" />
            {/* Rear Window */}
            <path d={`M ${w * 0.22},${l * 0.66} L ${w * 0.78},${l * 0.66} L ${w * 0.85},${l * 0.76} L ${w * 0.15},${l * 0.76} Z`} fill="#0F172A" stroke="#334155" strokeWidth="0.8" />
            {/* Hood & Trunk lines */}
            <line x1={w * 0.2} y1={l * 0.15} x2={w * 0.8} y2={l * 0.15} stroke="#CBD5E1" strokeWidth="1" />
            <line x1={w * 0.25} y1={l * 0.88} x2={w * 0.75} y2={l * 0.88} stroke="#CBD5E1" strokeWidth="1" />
            {/* Side Mirrors */}
            <ellipse cx="1" cy={l * 0.32} rx="2" ry="4" fill="#334155" />
            <ellipse cx={w - 1} cy={l * 0.32} rx="2" ry="4" fill="#334155" />
            {/* Headlights */}
            <ellipse cx={w * 0.22} cy="3" rx="3" ry="1.5" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.5" />
            <ellipse cx={w * 0.78} cy="3" rx="3" ry="1.5" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.5" />
            {/* Taillights */}
            <ellipse cx={w * 0.22} cy={l - 3} rx="3" ry="1.5" fill="#EF4444" />
            <ellipse cx={w * 0.78} cy={l - 3} rx="3" ry="1.5" fill="#EF4444" />
          </g>
        );

      case 'car_suv':
        return (
          <g>
            {/* SUV Body */}
            <rect x="2" y="2" width={w - 4} height={l - 4} fill="#64748B" stroke="#0F172A" strokeWidth="1.8" rx={w * 0.22} />
            {/* Panoramic Sunroof / Tinted Roof */}
            <rect x={w * 0.18} y={l * 0.28} width={w * 0.64} height={l * 0.45} fill="#0F172A" stroke="#1E293B" strokeWidth="1" rx="3" />
            {/* Roof Rails */}
            <line x1={w * 0.16} y1={l * 0.25} x2={w * 0.16} y2={l * 0.78} stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            <line x1={w * 0.84} y1={l * 0.25} x2={w * 0.84} y2={l * 0.78} stroke="#334155" strokeWidth="2" strokeLinecap="round" />
            {/* Side Mirrors */}
            <ellipse cx="1" cy={l * 0.32} rx="2.5" ry="4.5" fill="#0F172A" />
            <ellipse cx={w - 1} cy={l * 0.32} rx="2.5" ry="4.5" fill="#0F172A" />
            {/* Headlights */}
            <rect x={w * 0.16} y="2" width={w * 0.18} height="3" fill="#FEF08A" rx="1" />
            <rect x={w * 0.66} y="2" width={w * 0.18} height="3" fill="#FEF08A" rx="1" />
            {/* Taillights */}
            <rect x={w * 0.16} y={l - 5} width={w * 0.18} height="3" fill="#EF4444" rx="1" />
            <rect x={w * 0.66} y={l - 5} width={w * 0.18} height="3" fill="#EF4444" rx="1" />
          </g>
        );

      case 'bed_king':
      case 'bed_queen':
      case 'bed_single': {
        const isSingle = type === 'bed_single';
        return (
          <g>
            {/* Wooden Frame / Border */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#EAE5DB" stroke="#8C7A6B" strokeWidth="1.2" rx="3" />
            {/* Headboard */}
            <rect x="2" y="2" width={w - 4} height={l * 0.16} fill="#5C4D41" stroke="#3D322A" strokeWidth="1" rx="2" />
            {/* White Soft Mattress Surface */}
            <rect x="3" y={l * 0.17} width={w - 6} height={l * 0.8} fill="#FFFFFF" stroke="#D1C7BA" strokeWidth="0.8" rx="2" />
            {/* Pillows with soft shadows */}
            {isSingle ? (
              <rect x={w * 0.18} y={l * 0.2} width={w * 0.64} height={l * 0.22} fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" rx="2" />
            ) : (
              <>
                <rect x={w * 0.08} y={l * 0.2} width={w * 0.38} height={l * 0.22} fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" rx="2" />
                <rect x={w * 0.54} y={l * 0.2} width={w * 0.38} height={l * 0.22} fill="#F8FAFC" stroke="#94A3B8" strokeWidth="0.8" rx="2" />
              </>
            )}
            {/* Duvet / Folded Throw Blanket */}
            <rect x="3" y={l * 0.46} width={w - 6} height={l * 0.51} fill="#F4EFE6" stroke="#C5BAAA" strokeWidth="0.8" rx="1" />
            {/* Decorative Runner Strip */}
            <rect x="3" y={l * 0.75} width={w - 6} height={l * 0.18} fill="#D4A373" stroke="#A97142" strokeWidth="0.6" rx="1" />
          </g>
        );
      }

      case 'nightstand':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#D8C7B5" stroke="#785B43" strokeWidth="1.2" rx="2" />
            {/* Bedside Lamp */}
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.3} fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.12} fill="#F59E0B" />
          </g>
        );

      case 'wardrobe':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#EFECE6" stroke="#4A3B32" strokeWidth="1.5" rx="1" />
            {/* Mirror / Panel Dividers */}
            <line x1={w / 3} y1="1" x2={w / 3} y2={l - 1} stroke="#8C7A6B" strokeWidth="1" />
            <line x1={(w * 2) / 3} y1="1" x2={(w * 2) / 3} y2={l - 1} stroke="#8C7A6B" strokeWidth="1" />
            {/* Clothes Hanger lines */}
            <line x1="4" y1={l / 2} x2={w - 4} y2={l / 2} stroke="#CBD5E1" strokeWidth="0.8" strokeDasharray="3,2" />
          </g>
        );

      case 'study_desk':
        return (
          <g>
            {/* Desk Surface (Warm Wood) */}
            <rect x="1" y="1" width={w - 2} height={l * 0.65} fill="#D8C7B5" stroke="#785B43" strokeWidth="1.2" rx="2" />
            {/* Laptop / Monitor */}
            <rect x={w * 0.35} y={l * 0.14} width={w * 0.3} height={l * 0.3} fill="#0F172A" stroke="#334155" strokeWidth="0.8" rx="1" />
            <rect x={w * 0.38} y={l * 0.17} width={w * 0.24} height={l * 0.2} fill="#38BDF8" rx="0.5" />
            {/* Swivel Chair */}
            <circle cx={w / 2} cy={l * 0.82} r={l * 0.22} fill="#334155" stroke="#0F172A" strokeWidth="1.2" />
            <path d={`M ${w * 0.28},${l * 0.82} A ${l * 0.25} ${l * 0.25} 0 0,0 ${w * 0.72},${l * 0.82}`} fill="none" stroke="#1E293B" strokeWidth="1.5" />
          </g>
        );

      case 'sofa_3seater':
        return (
          <g>
            {/* Sofa Outer Shell */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#EDE8DF" stroke="#4A3F35" strokeWidth="1.5" rx="4" />
            {/* Backrest Cushion */}
            <rect x="3" y="3" width={w - 6} height={l * 0.28} fill="#D6CDC0" stroke="#7A6F62" strokeWidth="1" rx="2" />
            {/* 3 Plush Seat Cushions */}
            <rect x={w * 0.05} y={l * 0.33} width={w * 0.28} height={l * 0.6} fill="#FAF8F5" stroke="#8C8073" strokeWidth="1" rx="2" />
            <rect x={w * 0.36} y={l * 0.33} width={w * 0.28} height={l * 0.6} fill="#FAF8F5" stroke="#8C8073" strokeWidth="1" rx="2" />
            <rect x={w * 0.67} y={l * 0.33} width={w * 0.28} height={l * 0.6} fill="#FAF8F5" stroke="#8C8073" strokeWidth="1" rx="2" />
            {/* Throw Pillows on sides */}
            <rect x={w * 0.06} y={l * 0.35} width={w * 0.12} height={l * 0.25} fill="#D4A373" stroke="#A97142" strokeWidth="0.6" rx="1" transform={`rotate(-15, ${w*0.06}, ${l*0.35})`} />
            <rect x={w * 0.82} y={l * 0.35} width={w * 0.12} height={l * 0.25} fill="#D4A373" stroke="#A97142" strokeWidth="0.6" rx="1" transform={`rotate(15, ${w*0.82}, ${l*0.35})`} />
            {/* Armrests */}
            <rect x="2" y="2" width={w * 0.08} height={l - 4} fill="#C5BCAE" stroke="#7A6F62" strokeWidth="1" rx="1" />
            <rect x={w - w * 0.08 - 2} y="2" width={w * 0.08} height={l - 4} fill="#C5BCAE" stroke="#7A6F62" strokeWidth="1" rx="1" />
          </g>
        );

      case 'sofa_lshape':
        return (
          <g>
            <path
              d={`M 1,1 L ${w - 1},1 L ${w - 1},${l * 0.45} L ${w * 0.45},${l * 0.45} L ${w * 0.45},${l - 1} L 1,${l - 1} Z`}
              fill="#EDE8DF"
              stroke="#4A3F35"
              strokeWidth="1.5"
            />
            {/* L Backrest */}
            <path
              d={`M 3,3 L ${w - 3},3 L ${w - 3},${l * 0.25} L ${w * 0.25},${l * 0.25} L ${w * 0.25},${l - 3} L 3,${l - 3} Z`}
              fill="#D6CDC0"
              stroke="#7A6F62"
              strokeWidth="1"
            />
            {/* Cushions */}
            <rect x={w * 0.28} y={l * 0.28} width={w * 0.32} height={l * 0.15} fill="#FAF8F5" stroke="#8C8073" strokeWidth="0.8" rx="1.5" />
            <rect x={w * 0.63} y={l * 0.28} width={w * 0.32} height={l * 0.15} fill="#FAF8F5" stroke="#8C8073" strokeWidth="0.8" rx="1.5" />
            <rect x={w * 0.28} y={l * 0.48} width={w * 0.15} height={l * 0.46} fill="#FAF8F5" stroke="#8C8073" strokeWidth="0.8" rx="1.5" />
          </g>
        );

      case 'coffee_table':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#C29B7F" stroke="#633F24" strokeWidth="1.2" rx="3" />
            <rect x="3" y="3" width={w - 6} height={l - 6} fill="#D4AF37" opacity="0.1" stroke="#8C6549" strokeWidth="0.6" rx="2" />
            {/* Center Art Book / Tray */}
            <rect x={w * 0.25} y={l * 0.25} width={w * 0.5} height={l * 0.5} fill="#FAF8F5" stroke="#64748B" strokeWidth="0.6" rx="1" />
            <rect x={w * 0.3} y={l * 0.32} width={w * 0.18} height={l * 0.35} fill="#E0582B" rx="0.5" />
            <rect x={w * 0.52} y={l * 0.32} width={w * 0.18} height={l * 0.35} fill="#0284C7" rx="0.5" />
          </g>
        );

      case 'tv_unit':
        return (
          <g>
            {/* Dark Oak Console Table */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#27272A" stroke="#09090B" strokeWidth="1.2" rx="2" />
            {/* TV Screen Display */}
            <rect x={w * 0.1} y={l * 0.3} width={w * 0.8} height={l * 0.4} fill="#020617" stroke="#38BDF8" strokeWidth="0.8" rx="1" />
          </g>
        );

      case 'armchair':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#EDE8DF" stroke="#4A3F35" strokeWidth="1.2" rx="3" />
            <rect x="2" y="2" width={w - 4} height={l * 0.3} fill="#D6CDC0" stroke="#7A6F62" strokeWidth="1" rx="1.5" />
            <rect x={w * 0.15} y={l * 0.35} width={w * 0.7} height={l * 0.55} fill="#FAF8F5" stroke="#8C8073" strokeWidth="1" rx="2" />
          </g>
        );

      case 'dining_6seater':
        return (
          <g>
            {/* Dining Table Surface (Rich Teak / Oak) */}
            <rect x={w * 0.1} y={l * 0.22} width={w * 0.8} height={l * 0.56} fill="#C29B7F" stroke="#633F24" strokeWidth="1.5" rx="3" />
            {/* Center Runner & Vase */}
            <rect x={w * 0.15} y={l * 0.42} width={w * 0.7} height={l * 0.16} fill="#FAF8F5" opacity="0.8" rx="1" />
            <circle cx={w / 2} cy={l / 2} r="3" fill="#16A34A" />
            {/* Top 3 Upholstered Chairs */}
            <rect x={w * 0.14} y="1" width={w * 0.2} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            <rect x={w * 0.4} y="1" width={w * 0.2} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            <rect x={w * 0.66} y="1" width={w * 0.2} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            {/* Bottom 3 Upholstered Chairs */}
            <rect x={w * 0.14} y={l * 0.81} width={w * 0.2} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            <rect x={w * 0.4} y={l * 0.81} width={w * 0.2} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            <rect x={w * 0.66} y={l * 0.81} width={w * 0.2} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
          </g>
        );

      case 'dining_4seater':
        return (
          <g>
            <rect x={w * 0.12} y={l * 0.22} width={w * 0.76} height={l * 0.56} fill="#C29B7F" stroke="#633F24" strokeWidth="1.5" rx="3" />
            <circle cx={w / 2} cy={l / 2} r="2.5" fill="#16A34A" />
            <rect x={w * 0.2} y="1" width={w * 0.26} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            <rect x={w * 0.54} y="1" width={w * 0.26} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            <rect x={w * 0.2} y={l * 0.81} width={w * 0.26} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
            <rect x={w * 0.54} y={l * 0.81} width={w * 0.26} height={l * 0.18} fill="#FAF8F5" stroke="#334155" strokeWidth="1" rx="2" />
          </g>
        );

      case 'kitchen_island':
        return (
          <g>
            {/* Marble Waterfall Island */}
            <rect x="1" y="1" width={w - 2} height={l * 0.75} fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" rx="3" />
            {/* Marble Veining */}
            <path d={`M ${w*0.1},3 Q ${w*0.4},${l*0.4} ${w*0.85},${l*0.2}`} fill="none" stroke="#E2E8F0" strokeWidth="1" />
            {/* 3 Bar Stools */}
            <circle cx={w * 0.22} cy={l * 0.88} r={l * 0.1} fill="#D4A373" stroke="#78350F" strokeWidth="1" />
            <circle cx={w * 0.5} cy={l * 0.88} r={l * 0.1} fill="#D4A373" stroke="#78350F" strokeWidth="1" />
            <circle cx={w * 0.78} cy={l * 0.88} r={l * 0.1} fill="#D4A373" stroke="#78350F" strokeWidth="1" />
          </g>
        );

      case 'kitchen_counter_l':
        return (
          <g>
            <path
              d={`M 1,1 L ${w - 1},1 L ${w - 1},${l * 0.4} L ${w * 0.4},${l * 0.4} L ${w * 0.4},${l - 1} L 1,${l - 1} Z`}
              fill="#FFFFFF"
              stroke="#64748B"
              strokeWidth="1.5"
            />
            {/* Double Stainless Steel Sink Basin */}
            <rect x={w * 0.55} y={l * 0.08} width={w * 0.38} height={l * 0.25} fill="#F1F5F9" stroke="#0284C7" strokeWidth="1" rx="2" />
            <rect x={w * 0.57} y={l * 0.1} width={w * 0.16} height={l * 0.21} fill="#E0F2FE" stroke="#0284C7" strokeWidth="0.8" rx="1" />
            <rect x={w * 0.75} y={l * 0.1} width={w * 0.16} height={l * 0.21} fill="#E0F2FE" stroke="#0284C7" strokeWidth="0.8" rx="1" />
            <circle cx={w * 0.74} cy={l * 0.08} r="2" fill="#0369A1" />
            {/* Gas Hob / Cooktop Burners */}
            <rect x={w * 0.08} y={l * 0.48} width={w * 0.28} height={l * 0.45} fill="#1E293B" stroke="#0F172A" strokeWidth="1" rx="2" />
            <circle cx={w * 0.22} cy={l * 0.58} r={l * 0.08} fill="#DC2626" stroke="#EF4444" strokeWidth="0.8" />
            <circle cx={w * 0.22} cy={l * 0.8} r={l * 0.08} fill="#DC2626" stroke="#EF4444" strokeWidth="0.8" />
          </g>
        );

      case 'refrigerator':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" rx="2" />
            <line x1="2" y1={l * 0.38} x2={w - 2} y2={l * 0.38} stroke="#64748B" strokeWidth="1.2" />
            <rect x={w * 0.82} y={l * 0.1} width="2.5" height={l * 0.22} fill="#0F172A" rx="0.5" />
            <rect x={w * 0.82} y={l * 0.45} width="2.5" height={l * 0.45} fill="#0F172A" rx="0.5" />
          </g>
        );

      case 'toilet_wc':
        return (
          <g>
            {/* Cistern Tank */}
            <rect x="1" y="1" width={w - 2} height={l * 0.35} fill="#F8FAFC" stroke="#334155" strokeWidth="1.2" rx="2" />
            {/* Dual Flush */}
            <circle cx={w / 2} cy={l * 0.18} r="2" fill="#0284C7" />
            {/* Commode Bowl Oval */}
            <ellipse cx={w / 2} cy={l * 0.65} rx={w * 0.38} ry={l * 0.32} fill="#FFFFFF" stroke="#334155" strokeWidth="1.2" />
            <ellipse cx={w / 2} cy={l * 0.68} rx={w * 0.24} ry={l * 0.2} fill="#E2E8F0" stroke="#64748B" strokeWidth="0.6" />
          </g>
        );

      case 'vanity_sink':
        return (
          <g>
            {/* Marble Countertop */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F8FAFC" stroke="#475569" strokeWidth="1.2" rx="2" />
            {/* Basin */}
            <ellipse cx={w / 2} cy={l / 2} rx={w * 0.36} ry={l * 0.3} fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
            {/* Chrome Tap */}
            <circle cx={w / 2} cy={l * 0.22} r="2" fill="#0369A1" />
          </g>
        );

      case 'bathtub':
        return (
          <g>
            {/* Freestanding Bathtub Rim */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" rx={Math.min(w, l) * 0.4} />
            {/* Inside Water Basin */}
            <rect x="4" y="4" width={w - 8} height={l - 8} fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" rx={Math.min(w, l) * 0.35} />
            <circle cx={w * 0.2} cy={l / 2} r="2.5" fill="#0284C7" />
          </g>
        );

      case 'shower_cubicle':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.2" rx="2" />
            {/* Drain */}
            <circle cx={w / 2} cy={l / 2} r="3" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
            {/* Glass door indicator */}
            <line x1="2" y1="2" x2={w - 2} y2={l - 2} stroke="#BAE6FD" strokeWidth="1" strokeDasharray="3,2" />
          </g>
        );

      case 'patio_set':
        return (
          <g>
            {/* Patio Table */}
            <rect x={w * 0.25} y={l * 0.25} width={w * 0.5} height={l * 0.5} fill="#D4A373" stroke="#8C6549" strokeWidth="1.2" rx="2" />
            {/* Outdoor Wicker Chairs */}
            <rect x={w * 0.25} y="1" width={w * 0.5} height={l * 0.2} fill="#C29B7F" stroke="#633F24" strokeWidth="1" rx="2" />
            <rect x={w * 0.25} y={l * 0.79} width={w * 0.5} height={l * 0.2} fill="#C29B7F" stroke="#633F24" strokeWidth="1" rx="2" />
          </g>
        );

      case 'pooja_mandir':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" rx="2" />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.28} fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
            <polygon points={`${w/2},${l*0.25} ${w/2 - 3},${l*0.45} ${w/2 + 3},${l*0.45}`} fill="#EF4444" />
          </g>
        );

      case 'washing_machine':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F1F5F9" stroke="#334155" strokeWidth="1.2" rx="2" />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.35} fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.2" />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.18} fill="#BAE6FD" />
          </g>
        );

      default:
        return (
          <rect x="1" y="1" width={w - 2} height={l - 2} fill="#E2E8F0" stroke="#475569" strokeWidth="1" rx="2" />
        );
    }
  };

  return (
    <svg
      width={w}
      height={l}
      viewBox={`0 0 ${w} ${l}`}
      className="overflow-visible pointer-events-none drop-shadow-xs"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {renderContent()}
    </svg>
  );
};

