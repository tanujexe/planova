/**
 * 2D Architectural CAD Vector Symbols for Furniture
 * Provides clean top-down architectural graphics with cushions, pillows, sanitary fixtures, and cooktops.
 */

import React from 'react';

export const CadFurnitureSymbol = ({ type, widthPx, lengthPx, rotation = 0 }) => {
  const w = widthPx;
  const l = lengthPx;

  const renderContent = () => {
    switch (type) {
      case 'bed_king':
      case 'bed_queen':
      case 'bed_single':
        const isSingle = type === 'bed_single';
        return (
          <g>
            {/* Bed Mattress Base */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F8FAFC" stroke="#334155" strokeWidth="1.2" rx="2" />
            {/* Bed Headboard */}
            <rect x="1" y="1" width={w - 2} height={l * 0.18} fill="#475569" stroke="#1E293B" strokeWidth="1" rx="1" />
            {/* Pillows */}
            {isSingle ? (
              <rect x={w * 0.2} y={l * 0.22} width={w * 0.6} height={l * 0.22} fill="#E2E8F0" stroke="#64748B" strokeWidth="1" rx="1.5" />
            ) : (
              <>
                <rect x={w * 0.08} y={l * 0.22} width={w * 0.38} height={l * 0.22} fill="#E2E8F0" stroke="#64748B" strokeWidth="1" rx="1.5" />
                <rect x={w * 0.54} y={l * 0.22} width={w * 0.38} height={l * 0.22} fill="#E2E8F0" stroke="#64748B" strokeWidth="1" rx="1.5" />
              </>
            )}
            {/* Duvet / Blanket line */}
            <line x1="1" y1={l * 0.5} x2={w - 1} y2={l * 0.5} stroke="#94A3B8" strokeWidth="1" strokeDasharray="2,2" />
          </g>
        );

      case 'nightstand':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#E2E8F0" stroke="#475569" strokeWidth="1.2" rx="1" />
            {/* Table Lamp Circle */}
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.28} fill="#FEF08A" stroke="#CA8A04" strokeWidth="0.8" />
          </g>
        );

      case 'wardrobe':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" />
            {/* Sliding / Hinged door panels */}
            <line x1={w / 3} y1="1" x2={w / 3} y2={l - 1} stroke="#64748B" strokeWidth="1" />
            <line x1={(w * 2) / 3} y1="1" x2={(w * 2) / 3} y2={l - 1} stroke="#64748B" strokeWidth="1" />
            {/* Diagonal closet cross-hatch */}
            <line x1="2" y1="2" x2={w - 2} y2={l - 2} stroke="#CBD5E1" strokeWidth="0.8" />
          </g>
        );

      case 'study_desk':
        return (
          <g>
            {/* Desk Surface */}
            <rect x="1" y="1" width={w - 2} height={l * 0.65} fill="#F8FAFC" stroke="#334155" strokeWidth="1.2" rx="1" />
            {/* Laptop outline */}
            <rect x={w * 0.35} y={l * 0.15} width={w * 0.3} height={l * 0.3} fill="#CBD5E1" stroke="#475569" strokeWidth="0.8" rx="0.5" />
            {/* Chair */}
            <circle cx={w / 2} cy={l * 0.85} r={l * 0.22} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" />
            <path d={`M ${w * 0.3},${l * 0.85} A ${l * 0.25} ${l * 0.25} 0 0,0 ${w * 0.7},${l * 0.85}`} fill="none" stroke="#1E293B" strokeWidth="1.2" />
          </g>
        );

      case 'sofa_3seater':
        return (
          <g>
            {/* Sofa Outer Box */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.5" rx="3" />
            {/* Backrest */}
            <rect x="2" y="2" width={w - 4} height={l * 0.28} fill="#CBD5E1" stroke="#475569" strokeWidth="1" rx="1.5" />
            {/* 3 Seat Cushions */}
            <rect x={w * 0.04} y={l * 0.32} width={w * 0.28} height={l * 0.62} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="1.5" />
            <rect x={w * 0.36} y={l * 0.32} width={w * 0.28} height={l * 0.62} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="1.5" />
            <rect x={w * 0.68} y={l * 0.32} width={w * 0.28} height={l * 0.62} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="1.5" />
            {/* Armrests */}
            <rect x="1" y="1" width={w * 0.08} height={l - 2} fill="#94A3B8" stroke="#334155" strokeWidth="1" rx="1" />
            <rect x={w - w * 0.08 - 1} y="1" width={w * 0.08} height={l - 2} fill="#94A3B8" stroke="#334155" strokeWidth="1" rx="1" />
          </g>
        );

      case 'sofa_lshape':
        return (
          <g>
            <path
              d={`M 1,1 L ${w - 1},1 L ${w - 1},${l * 0.45} L ${w * 0.45},${l * 0.45} L ${w * 0.45},${l - 1} L 1,${l - 1} Z`}
              fill="#F1F5F9"
              stroke="#1E293B"
              strokeWidth="1.5"
            />
            {/* L Backrest */}
            <path
              d={`M 2,2 L ${w - 2},2 L ${w - 2},${l * 0.25} L ${w * 0.25},${l * 0.25} L ${w * 0.25},${l - 2} L 2,${l - 2} Z`}
              fill="#CBD5E1"
              stroke="#475569"
              strokeWidth="1"
            />
          </g>
        );

      case 'coffee_table':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#FEF3C7" stroke="#78350F" strokeWidth="1.2" rx="3" />
            <rect x="4" y="4" width={w - 8} height={l - 8} fill="none" stroke="#D97706" strokeWidth="0.8" rx="1.5" />
          </g>
        );

      case 'tv_unit':
        return (
          <g>
            {/* Console Table */}
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.2" rx="1" />
            {/* TV Screen Glass */}
            <rect x={w * 0.15} y={l * 0.35} width={w * 0.7} height={l * 0.3} fill="#0F172A" stroke="#0284C7" strokeWidth="1" rx="0.5" />
          </g>
        );

      case 'armchair':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F1F5F9" stroke="#1E293B" strokeWidth="1.2" rx="3" />
            <rect x="2" y="2" width={w - 4} height={l * 0.3} fill="#CBD5E1" stroke="#475569" strokeWidth="1" rx="1.5" />
            <rect x={w * 0.15} y={l * 0.35} width={w * 0.7} height={l * 0.55} fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" rx="1.5" />
          </g>
        );

      case 'dining_6seater':
        return (
          <g>
            {/* Central Dining Table */}
            <rect x={w * 0.1} y={l * 0.22} width={w * 0.8} height={l * 0.56} fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" rx="2" />
            {/* Top 3 Chairs */}
            <rect x={w * 0.15} y="1" width={w * 0.2} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            <rect x={w * 0.4} y="1" width={w * 0.2} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            <rect x={w * 0.65} y="1" width={w * 0.2} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            {/* Bottom 3 Chairs */}
            <rect x={w * 0.15} y={l * 0.81} width={w * 0.2} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            <rect x={w * 0.4} y={l * 0.81} width={w * 0.2} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            <rect x={w * 0.65} y={l * 0.81} width={w * 0.2} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
          </g>
        );

      case 'dining_4seater':
        return (
          <g>
            <rect x={w * 0.12} y={l * 0.22} width={w * 0.76} height={l * 0.56} fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" rx="2" />
            <rect x={w * 0.2} y="1" width={w * 0.26} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            <rect x={w * 0.54} y="1" width={w * 0.26} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            <rect x={w * 0.2} y={l * 0.81} width={w * 0.26} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
            <rect x={w * 0.54} y={l * 0.81} width={w * 0.26} height={l * 0.18} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1" rx="1" />
          </g>
        );

      case 'kitchen_counter_l':
        return (
          <g>
            <path
              d={`M 1,1 L ${w - 1},1 L ${w - 1},${l * 0.4} L ${w * 0.4},${l * 0.4} L ${w * 0.4},${l - 1} L 1,${l - 1} Z`}
              fill="#F8FAFC"
              stroke="#334155"
              strokeWidth="1.5"
            />
            {/* Sink Basin */}
            <rect x={w * 0.55} y={l * 0.08} width={w * 0.35} height={l * 0.25} fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" rx="2" />
            <circle cx={w * 0.72} cy={l * 0.2} r="2" fill="#0369A1" />
            {/* Gas Burner Circles */}
            <circle cx={w * 0.18} cy={l * 0.55} r={l * 0.12} fill="#FEE2E2" stroke="#DC2626" strokeWidth="1" />
            <circle cx={w * 0.18} cy={l * 0.8} r={l * 0.12} fill="#FEE2E2" stroke="#DC2626" strokeWidth="1" />
          </g>
        );

      case 'refrigerator':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#E2E8F0" stroke="#1E293B" strokeWidth="1.5" rx="1" />
            <line x1="2" y1={l * 0.35} x2={w - 2} y2={l * 0.35} stroke="#475569" strokeWidth="1.2" />
            <rect x={w * 0.8} y={l * 0.1} width="2" height={l * 0.2} fill="#0F172A" />
            <rect x={w * 0.8} y={l * 0.45} width="2" height={l * 0.4} fill="#0F172A" />
          </g>
        );

      case 'toilet_wc':
        return (
          <g>
            {/* Cistern Tank */}
            <rect x="1" y="1" width={w - 2} height={l * 0.35} fill="#F1F5F9" stroke="#0F172A" strokeWidth="1.2" rx="1" />
            {/* Commode Bowl Oval */}
            <ellipse cx={w / 2} cy={l * 0.65} rx={w * 0.38} ry={l * 0.32} fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
          </g>
        );

      case 'vanity_sink':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F8FAFC" stroke="#334155" strokeWidth="1.2" rx="2" />
            <ellipse cx={w / 2} cy={l / 2} rx={w * 0.35} ry={l * 0.3} fill="#E0F2FE" stroke="#0284C7" strokeWidth="1" />
            <circle cx={w / 2} cy={l * 0.25} r="2" fill="#64748B" />
          </g>
        );

      case 'shower_cubicle':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F0F9FF" stroke="#0284C7" strokeWidth="1.2" />
            {/* Drain circle */}
            <circle cx={w / 2} cy={l / 2} r="3" fill="#38BDF8" stroke="#0369A1" strokeWidth="1" />
            {/* Glass door indicator */}
            <line x1="1" y1="1" x2={w - 1} y2={l - 1} stroke="#BAE6FD" strokeWidth="0.8" strokeDasharray="3,2" />
          </g>
        );

      case 'pooja_mandir':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" rx="2" />
            {/* Diya / Alter Symbol */}
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.28} fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
            <polygon points={`${w/2},${l*0.25} ${w/2 - 3},${l*0.45} ${w/2 + 3},${l*0.45}`} fill="#EF4444" />
          </g>
        );

      case 'washing_machine':
        return (
          <g>
            <rect x="1" y="1" width={w - 2} height={l - 2} fill="#F1F5F9" stroke="#334155" strokeWidth="1.2" rx="1" />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.35} fill="#E2E8F0" stroke="#0284C7" strokeWidth="1.2" />
            <circle cx={w / 2} cy={l / 2} r={Math.min(w, l) * 0.18} fill="#BAE6FD" />
          </g>
        );

      default:
        return (
          <rect x="1" y="1" width={w - 2} height={l - 2} fill="#E2E8F0" stroke="#475569" strokeWidth="1" rx="1" />
        );
    }
  };

  return (
    <svg
      width={w}
      height={l}
      viewBox={`0 0 ${w} ${l}`}
      className="overflow-visible pointer-events-none"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
      }}
    >
      {renderContent()}
    </svg>
  );
};
