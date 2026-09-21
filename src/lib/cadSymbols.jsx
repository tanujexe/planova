/**
 * Architectural CAD Symbols & Dimension Vector Library
 * Provides standardized 2D CAD symbols conforming to architectural drafting conventions:
 * - Single hinged doors with 90° clearance arcs and jambs
 * - Double / French doors
 * - Sliding and pocket doors
 * - Framed multi-pane windows with wall sills
 * - Architectural dimension chains with 45° tick marks
 */

import React from 'react';

/**
 * Renders an architectural CAD door with 90° swing arc and door leaf
 */
export const CadDoorSymbol = ({ 
  wallSide = 'top', 
  widthPx = 42, 
  swingDirection = 'inward', // 'inward' | 'outward'
  flip = false,
  doorType = 'single', // 'single' | 'double' | 'sliding'
}) => {
  if (doorType === 'sliding') {
    return (
      <svg
        width={widthPx}
        height="12"
        viewBox={`0 0 ${widthPx} 12`}
        className="overflow-visible pointer-events-none"
      >
        {/* Sliding door track */}
        <line x1="0" y1="6" x2={widthPx} y2="6" stroke="#4B5563" strokeWidth="1.5" />
        {/* Sliding panels */}
        <rect x="0" y="2" width={widthPx * 0.55} height="3" fill="#9CA3AF" stroke="#1F2937" strokeWidth="1" rx="0.5" />
        <rect x={widthPx * 0.45} y="7" width={widthPx * 0.55} height="3" fill="#D1D5DB" stroke="#1F2937" strokeWidth="1" rx="0.5" />
      </svg>
    );
  }

  if (doorType === 'double') {
    const halfWidth = widthPx / 2;
    return (
      <svg
        width={widthPx}
        height={halfWidth}
        viewBox={`0 0 ${widthPx} ${halfWidth}`}
        className="overflow-visible pointer-events-none"
      >
        {/* Left leaf & arc */}
        <path
          d={`M 0,0 A ${halfWidth} ${halfWidth} 0 0,1 ${halfWidth},${halfWidth}`}
          fill="none"
          stroke="#C08552"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <line x1="0" y1="0" x2="0" y2={halfWidth} stroke="#8C4B1E" strokeWidth="2.5" />
        
        {/* Right leaf & arc */}
        <path
          d={`M ${widthPx},0 A ${halfWidth} ${halfWidth} 0 0,0 ${halfWidth},${halfWidth}`}
          fill="none"
          stroke="#C08552"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <line x1={widthPx} y1="0" x2={widthPx} y2={halfWidth} stroke="#8C4B1E" strokeWidth="2.5" />
      </svg>
    );
  }

  // Default Standard Single Hinged Door
  // Rotate / translate swing arc based on wallSide
  let transform = '';

  if (wallSide === 'bottom') {
    transform = `scale(1, -1) translate(0, -${widthPx})`;
  } else if (wallSide === 'left') {
    transform = `rotate(-90) translate(-${widthPx}, 0)`;
  } else if (wallSide === 'right') {
    transform = `rotate(90) translate(0, -${widthPx})`;
  }

  return (
    <svg
      width={widthPx}
      height={widthPx}
      viewBox={`0 0 ${widthPx} ${widthPx}`}
      className="overflow-visible pointer-events-none"
      style={{ transform }}
    >
      {/* Wall Cutout Gap Jambs */}
      <rect x="-2" y="-2" width="4" height="4" fill="#374151" />
      <rect x={widthPx - 2} y="-2" width="4" height="4" fill="#374151" />

      {/* 90-degree Clearance Swing Arc */}
      <path
        d={`M ${widthPx},0 A ${widthPx} ${widthPx} 0 0,1 0,${widthPx}`}
        fill="rgba(192, 133, 82, 0.08)"
        stroke="#C08552"
        strokeWidth="1.2"
        strokeDasharray="3,2"
      />

      {/* Door Leaf (Thick open panel) */}
      <line
        x1="0"
        y1="0"
        x2="0"
        y2={widthPx}
        stroke="#8C4B1E"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Hinge Pin Dot */}
      <circle cx="0" cy="0" r="2" fill="#374151" />
    </svg>
  );
};

/**
 * Renders an architectural CAD framed window with sill and glazing lines
 */
export const CadWindowSymbol = ({
  widthPx = 56,
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  isDoublePane = true,
}) => {
  if (orientation === 'vertical') {
    return (
      <svg
        width="10"
        height={widthPx}
        viewBox={`0 0 10 ${widthPx}`}
        className="overflow-visible pointer-events-none"
      >
        {/* Exterior & Interior Sill lines */}
        <line x1="0" y1="0" x2="10" y2="0" stroke="#1E293B" strokeWidth="1.5" />
        <line x1="0" y1={widthPx} x2="10" y2={widthPx} stroke="#1E293B" strokeWidth="1.5" />

        {/* Outer Frame */}
        <rect x="1.5" y="0" width="7" height={widthPx} fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" />

        {/* Central Glazing Glass Lines */}
        <line x1="3.5" y1="0" x2="3.5" y2={widthPx} stroke="#38BDF8" strokeWidth="1.2" />
        <line x1="6.5" y1="0" x2="6.5" y2={widthPx} stroke="#38BDF8" strokeWidth="1.2" />

        {/* Window Center Mullion */}
        {isDoublePane && (
          <line x1="1.5" y1={widthPx / 2} x2="8.5" y2={widthPx / 2} stroke="#0284C7" strokeWidth="1.5" />
        )}
      </svg>
    );
  }

  return (
    <svg
      width={widthPx}
      height="10"
      viewBox={`0 0 ${widthPx} 10`}
      className="overflow-visible pointer-events-none"
    >
      {/* Wall Jamb Cut Lines */}
      <line x1="0" y1="0" x2="0" y2="10" stroke="#1E293B" strokeWidth="1.5" />
      <line x1={widthPx} y1="0" x2={widthPx} y2="10" stroke="#1E293B" strokeWidth="1.5" />

      {/* Window Frame Box */}
      <rect x="0" y="1.5" width={widthPx} height="7" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1" />

      {/* Central Glazing Glass Lines */}
      <line x1="0" y1="3.5" x2={widthPx} y2="3.5" stroke="#38BDF8" strokeWidth="1.2" />
      <line x1="0" y1="6.5" x2={widthPx} y2="6.5" stroke="#38BDF8" strokeWidth="1.2" />

      {/* Window Center Mullion */}
      {isDoublePane && (
        <line x1={widthPx / 2} y1="1.5" x2={widthPx / 2} y2="8.5" stroke="#0284C7" strokeWidth="1.5" />
      )}
    </svg>
  );
};

/**
 * Renders an Architectural Dimension Line with 45° CAD slash ticks and centered text
 */
export const CadDimensionString = ({
  x1,
  y1,
  x2,
  y2,
  label,
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  tickSize = 5,
}) => {
  const isHoriz = orientation === 'horizontal';
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  return (
    <g className="pointer-events-none select-none">
      {/* Main Dimension Line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#64748B"
        strokeWidth="1"
      />

      {/* 45° Architectural Slash Tick at Start */}
      <line
        x1={x1 - tickSize}
        y1={y1 + tickSize}
        x2={x1 + tickSize}
        y2={y1 - tickSize}
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* 45° Architectural Slash Tick at End */}
      <line
        x1={x2 - tickSize}
        y1={y2 + tickSize}
        x2={x2 + tickSize}
        y2={y2 - tickSize}
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* Dimension Label Text Pill */}
      <rect
        x={isHoriz ? midX - 22 : midX - 20}
        y={isHoriz ? midY - 8 : midY - 7}
        width={isHoriz ? 44 : 40}
        height="14"
        fill="#FFFFFF"
        rx="3"
        stroke="#CBD5E1"
        strokeWidth="0.8"
      />
      <text
        x={midX}
        y={midY + 3}
        textAnchor="middle"
        fill="#0F172A"
        fontSize="9"
        fontWeight="600"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
      >
        {label}
      </text>
    </g>
  );
};
