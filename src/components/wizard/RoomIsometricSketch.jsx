import React from 'react';

export const RoomIsometricSketch = ({ roomType = 'bed_closet', size = 'M' }) => {
  // Dimension multiplier based on S / M / L
  const scaleMultiplier = size === 'S' ? 0.9 : size === 'L' ? 1.1 : 1.0;

  // Custom Isometric Wireframe Sketches with Tinted Floor Plinth
  if (roomType === 'bed_closet' || roomType === 'primary_closet') {
    return (
      <svg
        viewBox="0 0 400 320"
        className="w-full max-w-[280px] h-auto select-none mx-auto drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`translate(200, 180) scale(${scaleMultiplier})`}>
          {/* Tinted Floor Slab (Isometric Diamond) */}
          <polygon
            points="0,40 -80,-5 0,-50 80,-5"
            fill="#FBE7D7"
            stroke="#1E1E1E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Wall Corner Back Lines */}
          <line x1="0" y1="-50" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="-80" y1="-5" x2="-80" y2="-125" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="80" y1="-5" x2="80" y2="-125" stroke="#1E1E1E" strokeWidth="1.5" />

          {/* Top Wall Extents */}
          <line x1="-80" y1="-125" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="0" y1="-170" x2="80" y2="-125" stroke="#1E1E1E" strokeWidth="1.5" />

          {/* Closet Hanging Rod & Shelf */}
          <g stroke="#1E1E1E" strokeWidth="1.5" fill="none">
            {/* Upper Shelf */}
            <polygon points="0,-120 -60,-85 -20,-62 40,-97" fill="#F5E4D5" stroke="#1E1E1E" strokeWidth="1.2" />
            {/* Hanging Bar */}
            <line x1="-50" y1="-75" x2="0" y2="-105" stroke="#1E1E1E" strokeWidth="2.5" />
            <line x1="0" y1="-105" x2="35" y2="-85" stroke="#1E1E1E" strokeWidth="2.5" />
          </g>

          {/* Architectural hand-sketched corner ticks */}
          <line x1="-85" y1="-7" x2="-75" y2="-3" stroke="#1E1E1E" strokeWidth="1" />
          <line x1="75" y1="-7" x2="85" y2="-3" stroke="#1E1E1E" strokeWidth="1" />
          <line x1="-5" y1="42" x2="5" y2="38" stroke="#1E1E1E" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  if (roomType === 'primary_bedroom' || roomType === 'bedroom' || roomType === 'guest_bedroom') {
    return (
      <svg
        viewBox="0 0 400 320"
        className="w-full max-w-[280px] h-auto select-none mx-auto drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`translate(200, 180) scale(${scaleMultiplier})`}>
          {/* Floor Slab (Isometric Diamond) */}
          <polygon
            points="0,50 -100,-10 0,-70 100,-10"
            fill="#FEE8E1"
            stroke="#1E1E1E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Walls */}
          <line x1="0" y1="-70" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="-100" y1="-10" x2="-100" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="100" y1="-10" x2="100" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="-100" y1="-110" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="0" y1="-170" x2="100" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />

          {/* Bed Base & Mattress */}
          <polygon points="-20,-20 30,-50 70,-25 20,5" fill="#FAF4EF" stroke="#1E1E1E" strokeWidth="1.5" />
          {/* Headboard */}
          <polygon points="25,-55 35,-60 75,-35 65,-30" fill="#D4A373" stroke="#1E1E1E" strokeWidth="1.2" />
          {/* Pillows */}
          <polygon points="15,-38 30,-47 45,-38 30,-29" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="1" />
          <polygon points="35,-26 50,-35 65,-26 50,-17" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="1" />
          {/* Bedside Table */}
          <polygon points="65,-40 80,-50 90,-44 75,-34" fill="#E8D8C8" stroke="#1E1E1E" strokeWidth="1" />
        </g>
      </svg>
    );
  }

  if (roomType === 'primary_bathroom' || roomType === 'bathroom' || roomType === 'attached_bathroom') {
    return (
      <svg
        viewBox="0 0 400 320"
        className="w-full max-w-[280px] h-auto select-none mx-auto drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`translate(200, 180) scale(${scaleMultiplier})`}>
          {/* Floor Slab */}
          <polygon
            points="0,45 -85,-5 0,-55 85,-5"
            fill="#E0F2FE"
            stroke="#1E1E1E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Walls */}
          <line x1="0" y1="-55" x2="0" y2="-160" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="-85" y1="-5" x2="-85" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="85" y1="-5" x2="85" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="-85" y1="-110" x2="0" y2="-160" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="0" y1="-160" x2="85" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />

          {/* Vanity Counter */}
          <polygon points="-40,-15 0,-40 25,-25 -15,0" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="1.2" />
          {/* Mirror on wall */}
          <polygon points="-30,-70 -5,-85 -5,-45 -30,-30" fill="#BAE6FD" stroke="#1E1E1E" strokeWidth="1" />
          {/* Shower glass partition */}
          <line x1="45" y1="-10" x2="45" y2="-90" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="45" y1="-10" x2="75" y2="8" stroke="#0284C7" strokeWidth="1.5" />
        </g>
      </svg>
    );
  }

  if (roomType === 'kitchen' || roomType === 'pantry') {
    return (
      <svg
        viewBox="0 0 400 320"
        className="w-full max-w-[280px] h-auto select-none mx-auto drop-shadow-xs"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform={`translate(200, 180) scale(${scaleMultiplier})`}>
          {/* Floor Slab */}
          <polygon
            points="0,50 -95,-10 0,-70 95,-10"
            fill="#FFEDD5"
            stroke="#1E1E1E"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Walls */}
          <line x1="0" y1="-70" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="-95" y1="-10" x2="-95" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="95" y1="-10" x2="95" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="-95" y1="-110" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
          <line x1="0" y1="-170" x2="95" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />

          {/* L-shaped Granite Kitchen Counter */}
          <polygon points="-75,-5 -15,-40 0,-30 -60,5" fill="#D4A373" stroke="#1E1E1E" strokeWidth="1.5" />
          <polygon points="-15,-40 60,5 75,-5 0,-50" fill="#D4A373" stroke="#1E1E1E" strokeWidth="1.5" />
          {/* Gas Hob / Burners */}
          <circle cx="25" cy="-12" r="4" fill="#333333" />
          <circle cx="40" cy="-3" r="4" fill="#333333" />
        </g>
      </svg>
    );
  }

  // Default Living / Hallway / Pooja / Parking
  return (
    <svg
      viewBox="0 0 400 320"
      className="w-full max-w-[280px] h-auto select-none mx-auto drop-shadow-xs"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform={`translate(200, 180) scale(${scaleMultiplier})`}>
        {/* Floor Slab */}
        <polygon
          points="0,50 -95,-10 0,-70 95,-10"
          fill="#FEF3C7"
          stroke="#1E1E1E"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Walls */}
        <line x1="0" y1="-70" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
        <line x1="-95" y1="-10" x2="-95" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
        <line x1="95" y1="-10" x2="95" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />
        <line x1="-95" y1="-110" x2="0" y2="-170" stroke="#1E1E1E" strokeWidth="1.5" />
        <line x1="0" y1="-170" x2="95" y2="-110" stroke="#1E1E1E" strokeWidth="1.5" />

        {/* Living Sofa Seating */}
        <polygon points="-40,-10 10,-40 30,-28 -20,2" fill="#E8D8C8" stroke="#1E1E1E" strokeWidth="1.2" />
        <polygon points="-10,-5 20,-23 45,-8 15,10" fill="#FFFFFF" stroke="#1E1E1E" strokeWidth="1.2" />
      </g>
    </svg>
  );
};
