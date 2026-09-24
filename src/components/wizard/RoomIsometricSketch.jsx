import React from 'react';

/**
 * Architectural Hand-Drafted Isometric Sketch Component
 * Precisely recreates the drafted ink sketches with corner overshoots,
 * tinted floor plinths, and architectural details matching the reference images.
 */
export const RoomIsometricSketch = ({ roomType = 'primary_bedroom', size = 'M' }) => {
  const scaleMultiplier = size === 'S' ? 0.93 : size === 'L' ? 1.07 : 1.0;

  // ===========================================================================
  // 1. PRIMARY BATHROOM (Image 1)
  // Enclosed Water Closet with open door & toilet, glass sliding shower,
  // vanity with double sinks & mirrors, back window, sky-blue floor plinth.
  // ===========================================================================
  if (roomType === 'primary_bathroom') {
    return (
      <svg
        viewBox="0 0 540 460"
        className="w-full max-w-[340px] sm:max-w-[370px] h-auto select-none mx-auto drop-shadow-sm transition-transform duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform={`translate(${270 * (1 - scaleMultiplier)}, ${230 * (1 - scaleMultiplier)}) scale(${scaleMultiplier})`}
        >
          {/* Floor Plinth (Sky Blue) */}
          <polygon
            points="280,185 450,285 300,375 140,270"
            fill="#BEE3F8"
            stroke="#181818"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Foundation Slab */}
          <polygon
            points="140,270 300,375 300,385 140,280"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          <polygon
            points="300,375 450,285 450,295 300,385"
            fill="#F4EFEA"
            stroke="#181818"
            strokeWidth="1.6"
          />
          {/* Foundation Ticks */}
          <line x1="132" y1="275" x2="148" y2="267" stroke="#181818" strokeWidth="1.4" />
          <line x1="292" y1="387" x2="308" y2="380" stroke="#181818" strokeWidth="1.4" />
          <line x1="442" y1="297" x2="458" y2="289" stroke="#181818" strokeWidth="1.4" />

          {/* Back Right Wall */}
          <polygon
            points="280,35 450,135 450,285 280,185"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Right Wall Window */}
          <polygon
            points="390,140 418,157 418,225 390,208"
            fill="#1E1E1E"
            stroke="#181818"
            strokeWidth="1.6"
          />
          <polygon
            points="393,144 415,157 415,221 393,205"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.2"
          />
          <line x1="393" y1="178" x2="415" y2="191" stroke="#181818" strokeWidth="1.4" />
          <line x1="404" y1="150" x2="404" y2="213" stroke="#181818" strokeWidth="1.4" />

          {/* Shower Sliding Glass Enclosure (Middle) */}
          {/* Shower Track on top */}
          <line x1="278" y1="125" x2="358" y2="172" stroke="#181818" strokeWidth="3" />
          <circle cx="295" cy="135" r="2.5" fill="#181818" />
          <circle cx="340" cy="161" r="2.5" fill="#181818" />
          {/* Left Glass Door */}
          <polygon
            points="278,135 320,160 320,240 278,215"
            fill="#F0F9FF"
            stroke="#181818"
            strokeWidth="1.4"
            opacity="0.75"
          />
          <line x1="284" y1="170" x2="284" y2="190" stroke="#181818" strokeWidth="2" />
          {/* Right Glass Door */}
          <polygon
            points="318,158 358,182 358,262 318,238"
            fill="#E0F2FE"
            stroke="#181818"
            strokeWidth="1.4"
            opacity="0.75"
          />
          <line x1="352" y1="195" x2="352" y2="215" stroke="#181818" strokeWidth="2" />
          {/* Shower Wall Fixture */}
          <rect x="330" y="160" width="8" height="12" fill="#718096" />

          {/* ENCLOSED WATER CLOSET (Left Side) */}
          {/* Back Wall of W.C. */}
          <polygon
            points="140,115 230,62 230,215 140,270"
            fill="#F8F8F7"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Dividing Partition Wall between WC and Shower */}
          <polygon
            points="230,62 278,90 278,245 230,215"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Top Wall Thickness of WC */}
          <polygon
            points="136,110 226,58 230,62 140,115"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.4"
          />
          <polygon
            points="226,58 274,86 278,90 230,62"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.4"
          />
          {/* Front WC Wall with Door Frame */}
          <polygon
            points="230,215 244,223 244,105 230,97"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          <polygon
            points="206,201 206,83 230,97 230,215"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          <polygon
            points="184,188 184,70 206,83 206,201"
            fill="#EFEFEF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          {/* Open Door Leaf Swung Inward */}
          <polygon
            points="156,170 178,160 178,242 156,252"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          <circle cx="160" cy="214" r="1.5" fill="#181818" />

          {/* Commode / Toilet inside W.C. */}
          {/* Tank */}
          <polygon
            points="198,172 210,165 210,185 198,192"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.4"
          />
          {/* Bowl */}
          <ellipse cx="204" cy="198" rx="8" ry="5" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <path d="M 197 198 Q 204 212 211 198" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />

          {/* DOUBLE VANITY UNIT (Foreground Right) */}
          {/* Vanity Base Cabinet */}
          <polygon
            points="350,230 445,175 445,235 350,290"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          <polygon
            points="335,238 350,230 350,290 335,298"
            fill="#EDE9E2"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Vanity Countertop (Black Quartz / Slate) */}
          <polygon
            points="330,235 448,166 454,170 336,242"
            fill="#1E1E1E"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Sinks on Countertop */}
          <polygon
            points="360,215 390,198 396,202 366,219"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.2"
          />
          <polygon
            points="405,189 435,172 441,176 411,193"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.2"
          />

          {/* Two Vanity Mirrors with Black Trim & Sconces */}
          {/* Left Mirror */}
          <polygon
            points="375,170 398,157 398,205 375,218"
            fill="#EBF8FF"
            stroke="#181818"
            strokeWidth="1.5"
          />
          <rect x="382" y="160" width="10" height="4" fill="#181818" />
          {/* Right Mirror */}
          <polygon
            points="412,148 435,135 435,183 412,196"
            fill="#EBF8FF"
            stroke="#181818"
            strokeWidth="1.5"
          />
          <rect x="419" y="138" width="10" height="4" fill="#181818" />

          {/* Architectural Ticks & Line Overshoots */}
          <line x1="280" y1="25" x2="280" y2="45" stroke="#181818" strokeWidth="1.5" />
          <line x1="440" y1="140" x2="458" y2="130" stroke="#181818" strokeWidth="1.5" />
          <line x1="130" y1="120" x2="148" y2="110" stroke="#181818" strokeWidth="1.5" />
          <line x1="292" y1="378" x2="306" y2="371" stroke="#181818" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  // ===========================================================================
  // 2. BEDROOMS (Image 2)
  // Double window on left wall, clean right wall with diagonal sunlight beam,
  // bed with headboard, two pillows, rug, two nightstands, bench, peach floor.
  // ===========================================================================
  if (
    roomType === 'primary_bedroom' ||
    roomType === 'bedroom' ||
    roomType === 'guest_bedroom'
  ) {
    return (
      <svg
        viewBox="0 0 540 440"
        className="w-full max-w-[340px] sm:max-w-[370px] h-auto select-none mx-auto drop-shadow-sm transition-transform duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform={`translate(${270 * (1 - scaleMultiplier)}, ${220 * (1 - scaleMultiplier)}) scale(${scaleMultiplier})`}
        >
          {/* Sunlight shadow cast on the right wall from left window */}
          <polygon
            points="310,65 328,75 352,225 310,210"
            fill="#EAE7E1"
            opacity="0.85"
          />

          {/* Left Wall Inner Face */}
          <polygon
            points="142,122 288,38 288,198 142,282"
            fill="#F8F8F7"
            stroke="#181818"
            strokeWidth="1.8"
          />

          {/* Right Wall Inner Face */}
          <polygon
            points="288,38 458,136 458,296 288,198"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />

          {/* Back Corner Vertical Line */}
          <line x1="288" y1="34" x2="288" y2="202" stroke="#181818" strokeWidth="2" />

          {/* Wall Top Thickness Strips */}
          <polygon points="136,118 288,30 288,38 142,122" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <polygon points="288,30 464,132 458,136 288,38" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          {/* Wall Cuts */}
          <polygon points="136,118 142,122 142,282 136,278" fill="#F0EFEA" stroke="#181818" strokeWidth="1.5" />
          <polygon points="458,136 464,132 464,292 458,296" fill="#EAE7E1" stroke="#181818" strokeWidth="1.5" />

          {/* Tinted Floor Plinth (Peach / Coral) */}
          <polygon
            points="288,198 458,296 304,386 142,282"
            fill="#FDD6CB"
            stroke="#181818"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Foundation Slab */}
          <polygon points="142,282 304,386 304,394 142,290" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <polygon points="304,386 458,296 458,304 304,394" fill="#F4EFEA" stroke="#181818" strokeWidth="1.6" />
          {/* Foundation Ticks */}
          <line x1="134" y1="287" x2="148" y2="279" stroke="#181818" strokeWidth="1.4" />
          <line x1="298" y1="397" x2="310" y2="391" stroke="#181818" strokeWidth="1.4" />
          <line x1="452" y1="307" x2="464" y2="300" stroke="#181818" strokeWidth="1.4" />

          {/* LEFT WALL: Large Double Window with Mullions */}
          <polygon points="182,143 248,105 248,198 182,236" fill="#1E1E1E" stroke="#181818" strokeWidth="1.8" />
          {/* Left Sash */}
          <polygon points="186,147 212,132 212,216 186,231" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <line x1="186" y1="189" x2="212" y2="174" stroke="#181818" strokeWidth="1.4" />
          <line x1="199" y1="140" x2="199" y2="223" stroke="#181818" strokeWidth="1.4" />
          {/* Right Sash */}
          <polygon points="218,128 244,113 244,197 218,212" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <line x1="218" y1="170" x2="244" y2="155" stroke="#181818" strokeWidth="1.4" />
          <line x1="231" y1="120" x2="231" y2="204" stroke="#181818" strokeWidth="1.4" />
          {/* Window Sill */}
          <polygon points="178,237 252,195 252,200 178,242" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />

          {/* Area Rug Under Bed */}
          <polygon
            points="288,272 386,215 434,242 336,300"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Far Nightstand (Left of Bed) */}
          <polygon points="315,214 336,226 324,233 303,221" fill="#FFFFFF" stroke="#181818" strokeWidth="1.5" />
          <polygon points="303,221 324,233 324,246 303,234" fill="#FFFFFF" stroke="#181818" strokeWidth="1.5" />
          <polygon points="324,233 336,226 336,239 324,246" fill="#EDE9E2" stroke="#181818" strokeWidth="1.5" />

          {/* Bed Headboard */}
          <polygon points="352,220 424,261 424,220 352,179" fill="#FFFFFF" stroke="#181818" strokeWidth="2" />
          <polygon points="349,218 352,220 352,179 349,177" fill="#E8E4DB" stroke="#181818" strokeWidth="1.4" />

          {/* Mattress & Duvet */}
          <polygon points="352,223 420,263 350,303 282,263" fill="#FFFFFF" stroke="#181818" strokeWidth="2" />
          <polygon points="282,263 352,223 352,237 282,277" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <polygon points="282,263 350,303 350,317 282,277" fill="#FFFFFF" stroke="#181818" strokeWidth="2" />

          {/* Bed Frame Legs */}
          <line x1="285" y1="277" x2="285" y2="285" stroke="#181818" strokeWidth="2.5" />
          <line x1="346" y1="317" x2="346" y2="325" stroke="#181818" strokeWidth="2.5" />
          {/* Under-Bed Shadow */}
          <polygon points="286,277 350,317 360,311 296,271" fill="#181818" opacity="0.12" />

          {/* Pillows */}
          <polygon points="358,217 384,231 376,241 350,227" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <polygon points="388,234 414,248 406,258 380,244" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />

          {/* Near Nightstand (Foreground Right) */}
          <polygon points="414,272 436,285 422,293 400,280" fill="#FFFFFF" stroke="#181818" strokeWidth="1.5" />
          <polygon points="400,280 422,293 422,306 400,293" fill="#FFFFFF" stroke="#181818" strokeWidth="1.5" />
          <polygon points="422,293 436,285 436,298 422,306" fill="#EDE9E2" stroke="#181818" strokeWidth="1.5" />

          {/* Foot-of-Bed Bench / Credenza */}
          <polygon points="246,292 302,324 288,332 232,300" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <polygon points="232,300 288,332 288,354 232,322" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <polygon points="288,332 302,324 302,346 288,354" fill="#EDE9E2" stroke="#181818" strokeWidth="1.6" />

          {/* Corner Ticks */}
          <line x1="288" y1="22" x2="288" y2="44" stroke="#181818" strokeWidth="1.5" />
          <line x1="280" y1="34" x2="296" y2="26" stroke="#181818" strokeWidth="1.5" />
          <line x1="130" y1="122" x2="148" y2="114" stroke="#181818" strokeWidth="1.4" />
          <line x1="452" y1="140" x2="470" y2="132" stroke="#181818" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  // ===========================================================================
  // 3. SECONDARY / STANDARD BATHROOM (Image 3)
  // Double vanity with 2 mirrors & 3-bulb light bars, dividing partition wall,
  // bathtub/shower alcove, and toilet against right back wall.
  // ===========================================================================
  if (roomType === 'bathroom' || roomType === 'attached_bathroom') {
    return (
      <svg
        viewBox="0 0 540 460"
        className="w-full max-w-[340px] sm:max-w-[370px] h-auto select-none mx-auto drop-shadow-sm transition-transform duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform={`translate(${270 * (1 - scaleMultiplier)}, ${230 * (1 - scaleMultiplier)}) scale(${scaleMultiplier})`}
        >
          {/* Sky-Blue Floor Plinth */}
          <polygon
            points="280,185 450,285 300,375 140,270"
            fill="#C2E5FC"
            stroke="#181818"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Foundation Slab */}
          <polygon points="140,270 300,375 300,385 140,280" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <polygon points="300,375 450,285 450,295 300,385" fill="#F4EFEA" stroke="#181818" strokeWidth="1.6" />
          {/* Foundation Ticks */}
          <line x1="132" y1="275" x2="148" y2="267" stroke="#181818" strokeWidth="1.4" />
          <line x1="292" y1="387" x2="308" y2="380" stroke="#181818" strokeWidth="1.4" />
          <line x1="442" y1="297" x2="458" y2="289" stroke="#181818" strokeWidth="1.4" />

          {/* Left Wall Face */}
          <polygon points="140,115 280,35 280,185 140,270" fill="#F8F8F7" stroke="#181818" strokeWidth="1.8" />
          {/* Right Wall Face */}
          <polygon points="280,35 450,135 450,285 280,185" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <line x1="280" y1="30" x2="280" y2="190" stroke="#181818" strokeWidth="2" />

          {/* Top Wall Thickness */}
          <polygon points="135,110 275,30 280,35 140,115" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <polygon points="275,30 455,130 450,135 280,35" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />

          {/* DOUBLE VANITY (Along Left Wall) */}
          {/* Vanity Countertop */}
          <polygon
            points="152,228 248,172 264,181 168,237"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Vanity Base Cabinet Doors (4 Doors) */}
          <polygon
            points="168,237 264,181 264,228 168,284"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Cabinet Door Dividers */}
          <line x1="192" y1="223" x2="192" y2="270" stroke="#181818" strokeWidth="1.2" />
          <line x1="216" y1="209" x2="216" y2="256" stroke="#181818" strokeWidth="1.2" />
          <line x1="240" y1="195" x2="240" y2="242" stroke="#181818" strokeWidth="1.2" />
          {/* Door Pull Handles */}
          <rect x="187" y="228" width="3" height="6" fill="#181818" />
          <rect x="194" y="224" width="3" height="6" fill="#181818" />
          <rect x="235" y="200" width="3" height="6" fill="#181818" />
          <rect x="242" y="196" width="3" height="6" fill="#181818" />

          {/* Undermount Sinks & Faucets */}
          {/* Left Sink */}
          <ellipse cx="192" cy="216" rx="14" ry="7" fill="#E2E8F0" stroke="#181818" strokeWidth="1.4" />
          <line x1="192" y1="208" x2="192" y2="213" stroke="#181818" strokeWidth="2.5" />
          {/* Right Sink */}
          <ellipse cx="236" cy="190" rx="14" ry="7" fill="#E2E8F0" stroke="#181818" strokeWidth="1.4" />
          <line x1="236" y1="182" x2="236" y2="187" stroke="#181818" strokeWidth="2.5" />

          {/* Two Large Vanity Mirrors with Rounded Corners */}
          {/* Left Mirror */}
          <rect
            x="170"
            y="130"
            width="28"
            height="46"
            rx="4"
            transform="skewY(-17)"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          {/* Left Light Bar with 3 Sconces */}
          <g transform="skewY(-17)">
            <line x1="168" y1="120" x2="200" y2="120" stroke="#181818" strokeWidth="2" />
            <circle cx="172" cy="124" r="3" fill="#181818" />
            <circle cx="184" cy="124" r="3" fill="#181818" />
            <circle cx="196" cy="124" r="3" fill="#181818" />
          </g>

          {/* Right Mirror */}
          <rect
            x="214"
            y="143"
            width="28"
            height="46"
            rx="4"
            transform="skewY(-17)"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          {/* Right Light Bar with 3 Sconces */}
          <g transform="skewY(-17)">
            <line x1="212" y1="133" x2="244" y2="133" stroke="#181818" strokeWidth="2" />
            <circle cx="216" cy="137" r="3" fill="#181818" />
            <circle cx="228" cy="137" r="3" fill="#181818" />
            <circle cx="240" cy="137" r="3" fill="#181818" />
          </g>

          {/* DIVIDING PARTITION WALL (Between Vanity & Tub) */}
          <polygon
            points="272,90 292,102 292,254 272,242"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          <polygon
            points="268,88 272,90 272,242 268,240"
            fill="#EDE9E2"
            stroke="#181818"
            strokeWidth="1.4"
          />
          {/* Towel Hook on Partition */}
          <circle cx="270" cy="180" r="3" fill="none" stroke="#181818" strokeWidth="1.5" />

          {/* BATHTUB & SHOWER ALCOVE (Middle) */}
          {/* Tub Front Apron */}
          <polygon
            points="292,242 368,198 368,235 292,279"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Tub Rim / Top Surface */}
          <polygon
            points="285,200 365,155 378,162 298,207"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Tub Inner Basin Contour */}
          <polygon
            points="295,205 358,168 368,174 305,211"
            fill="#EBF8FF"
            stroke="#181818"
            strokeWidth="1.4"
          />
          {/* Shower Wall Fixtures on Back Wall */}
          {/* Shower Head with Arm */}
          <line x1="334" y1="120" x2="340" y2="128" stroke="#181818" strokeWidth="2.5" />
          <polygon points="338,128 344,126 342,132" fill="#181818" />
          {/* Mixing Valve Knob */}
          <circle cx="346" cy="150" r="3.5" fill="#181818" />
          {/* Tub Spout */}
          <line x1="346" y1="165" x2="350" y2="167" stroke="#181818" strokeWidth="3" />

          {/* TOILET (Right Back Corner) */}
          {/* Toilet Tank */}
          <polygon
            points="382,185 404,198 404,222 382,209"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.6"
          />
          {/* Tank Lid */}
          <polygon
            points="380,184 402,197 406,195 384,182"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.4"
          />
          {/* Toilet Bowl & Seat */}
          <ellipse cx="376" cy="225" rx="10" ry="6" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <path d="M 368 225 Q 376 244 384 225" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />

          {/* Architectural Corner Overshoots */}
          <line x1="280" y1="22" x2="280" y2="44" stroke="#181818" strokeWidth="1.5" />
          <line x1="130" y1="122" x2="148" y2="114" stroke="#181818" strokeWidth="1.4" />
          <line x1="442" y1="142" x2="458" y2="134" stroke="#181818" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  // ===========================================================================
  // 4. KITCHEN & DINING (Image 4)
  // Refrigerator with top cabinet, upper wall cabinets, range hood, gas stove,
  // base counters, and foreground island with sink and 4 bar stools!
  // ===========================================================================
  if (
    roomType === 'kitchen' ||
    roomType === 'dining' ||
    roomType === 'breakfast_nook' ||
    roomType === 'pantry'
  ) {
    return (
      <svg
        viewBox="0 0 540 460"
        className="w-full max-w-[340px] sm:max-w-[370px] h-auto select-none mx-auto drop-shadow-sm transition-transform duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform={`translate(${270 * (1 - scaleMultiplier)}, ${230 * (1 - scaleMultiplier)}) scale(${scaleMultiplier})`}
        >
          {/* Warm Golden/Wheat Floor Plinth */}
          <polygon
            points="245,150 455,270 305,360 95,240"
            fill="#FEE6A2"
            stroke="#181818"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          {/* Foundation Slab */}
          <polygon points="95,240 305,360 305,370 95,250" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <polygon points="305,360 455,270 455,280 305,370" fill="#F4EFEA" stroke="#181818" strokeWidth="1.6" />
          {/* Foundation Ticks */}
          <line x1="88" y1="245" x2="102" y2="237" stroke="#181818" strokeWidth="1.4" />
          <line x1="298" y1="372" x2="312" y2="365" stroke="#181818" strokeWidth="1.4" />
          <line x1="448" y1="282" x2="462" y2="275" stroke="#181818" strokeWidth="1.4" />

          {/* Single Back Wall Running Along Right Diagonal Axis */}
          <polygon
            points="245,30 455,150 455,270 245,150"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />
          {/* Wall Corner Ticks */}
          <line x1="238" y1="34" x2="252" y2="26" stroke="#181818" strokeWidth="1.5" />
          <line x1="448" y1="154" x2="462" y2="146" stroke="#181818" strokeWidth="1.5" />
          <line x1="455" y1="140" x2="455" y2="280" stroke="#181818" strokeWidth="1.8" />

          {/* ================= BACK COUNTER & APPLIANCES ================= */}

          {/* 1. REFRIGERATOR & UPPER CABINET (Leftmost) */}
          {/* Cabinet Above Refrigerator */}
          <polygon points="230,55 272,79 272,108 230,84" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <polygon points="230,55 244,47 286,71 272,79" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          {/* Refrigerator Body */}
          <polygon points="230,88 272,112 272,204 230,180" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          {/* Refrigerator Double French Doors & Handles */}
          <line x1="251" y1="100" x2="251" y2="164" stroke="#181818" strokeWidth="1.4" />
          <line x1="248" y1="110" x2="248" y2="148" stroke="#181818" strokeWidth="2.5" />
          <line x1="254" y1="113" x2="254" y2="151" stroke="#181818" strokeWidth="2.5" />
          {/* Bottom Freezer Drawer */}
          <line x1="230" y1="168" x2="272" y2="192" stroke="#181818" strokeWidth="1.6" />
          <line x1="244" y1="178" x2="258" y2="186" stroke="#181818" strokeWidth="2.5" />

          {/* 2. BASE COUNTERS & UPPER CABINETS */}
          {/* Base Counter left of stove */}
          <polygon points="274,152 322,179 322,226 274,199" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <polygon points="274,152 284,146 332,173 322,179" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          {/* Upper Wall Cabinet 1 */}
          <polygon points="278,75 328,104 328,154 278,125" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <polygon points="278,75 290,68 340,97 328,104" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />

          {/* 3. STAINLESS STEEL RANGE HOOD & DUCT */}
          <polygon points="340,105 356,114 356,140 340,131" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          {/* Hood Flare */}
          <polygon points="328,142 368,165 368,172 328,149" fill="#EDE9E2" stroke="#181818" strokeWidth="1.8" />

          {/* 4. PROFESSIONAL GAS RANGE & OVEN */}
          {/* Cooktop with Burner Grates */}
          <polygon points="322,179 360,201 350,207 312,185" fill="#1E1E1E" stroke="#181818" strokeWidth="1.8" />
          <ellipse cx="328" cy="192" rx="4" ry="2.5" fill="#4A5568" />
          <ellipse cx="344" cy="201" rx="4" ry="2.5" fill="#4A5568" />
          {/* Front Oven Face */}
          <polygon points="312,185 350,207 350,244 312,222" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          {/* Control Knobs Panel */}
          <line x1="312" y1="194" x2="350" y2="216" stroke="#181818" strokeWidth="1.2" />
          <circle cx="320" cy="194" r="1.5" fill="#181818" />
          <circle cx="328" cy="198" r="1.5" fill="#181818" />
          <circle cx="336" cy="203" r="1.5" fill="#181818" />
          <circle cx="344" cy="207" r="1.5" fill="#181818" />
          {/* Oven Window & Handle */}
          <polygon points="318,206 344,221 344,236 318,221" fill="#4A5568" stroke="#181818" strokeWidth="1.2" />
          <line x1="318" y1="202" x2="344" y2="217" stroke="#181818" strokeWidth="2.5" />

          {/* 5. BASE COUNTER RIGHT OF STOVE & UPPER CABINET 2 */}
          <polygon points="350,207 410,242 410,268 350,233" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <polygon points="350,207 360,201 420,236 410,242" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          {/* Upper Wall Cabinet 2 */}
          <polygon points="370,128 422,158 422,208 370,178" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <polygon points="370,128 382,121 434,151 422,158" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />

          {/* ================= FOREGROUND KITCHEN ISLAND ================= */}
          {/* Island Countertop */}
          <polygon
            points="170,220 318,305 272,332 124,247"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Undermount Island Sink & Faucet */}
          <polygon
            points="208,248 260,278 248,285 196,255"
            fill="#E2E8F0"
            stroke="#181818"
            strokeWidth="1.5"
          />
          <line x1="216" y1="245" x2="216" y2="252" stroke="#181818" strokeWidth="3" />

          {/* Island Base Apron */}
          <polygon
            points="272,332 318,305 318,348 272,375"
            fill="#EDE9E2"
            stroke="#181818"
            strokeWidth="1.8"
          />
          <polygon
            points="124,247 272,332 272,375 124,290"
            fill="#FFFFFF"
            stroke="#181818"
            strokeWidth="1.8"
          />

          {/* 4 ROUND INDUSTRIAL BAR STOOLS (In Front of Island) */}
          {[
            { cx: 146, cy: 284 },
            { cx: 174, cy: 300 },
            { cx: 202, cy: 316 },
            { cx: 230, cy: 332 },
          ].map((stool, idx) => (
            <g key={idx}>
              {/* Stool Seat */}
              <ellipse
                cx={stool.cx}
                cy={stool.cy}
                rx="9"
                ry="5"
                fill="#1E1E1E"
                stroke="#181818"
                strokeWidth="1.4"
              />
              {/* 4 Legs */}
              <line x1={stool.cx - 6} y1={stool.cy + 2} x2={stool.cx - 8} y2={stool.cy + 30} stroke="#181818" strokeWidth="1.8" />
              <line x1={stool.cx - 2} y1={stool.cy + 4} x2={stool.cx - 3} y2={stool.cy + 32} stroke="#181818" strokeWidth="1.8" />
              <line x1={stool.cx + 2} y1={stool.cy + 4} x2={stool.cx + 3} y2={stool.cy + 32} stroke="#181818" strokeWidth="1.8" />
              <line x1={stool.cx + 6} y1={stool.cy + 2} x2={stool.cx + 8} y2={stool.cy + 30} stroke="#181818" strokeWidth="1.8" />
              {/* Circular Footrest Ring */}
              <ellipse
                cx={stool.cx}
                cy={stool.cy + 20}
                rx="6"
                ry="3"
                fill="none"
                stroke="#181818"
                strokeWidth="1.4"
              />
            </g>
          ))}

          {/* Architectural Overshoots */}
          <line x1="162" y1="225" x2="178" y2="216" stroke="#181818" strokeWidth="1.4" />
          <line x1="310" y1="310" x2="326" y2="301" stroke="#181818" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  // ===========================================================================
  // 5. WALK-IN CLOSETS (Primary Closet, Bed Closet)
  // Matching ink style with custom wardrobe shelves, hanging rod & hangers.
  // ===========================================================================
  if (roomType === 'primary_closet' || roomType === 'bed_closet') {
    return (
      <svg
        viewBox="0 0 540 440"
        className="w-full max-w-[340px] sm:max-w-[370px] h-auto select-none mx-auto drop-shadow-sm transition-transform duration-300"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform={`translate(${270 * (1 - scaleMultiplier)}, ${220 * (1 - scaleMultiplier)}) scale(${scaleMultiplier})`}
        >
          {/* Walls */}
          <polygon points="142,122 288,38 288,198 142,282" fill="#F8F8F7" stroke="#181818" strokeWidth="1.8" />
          <polygon points="288,38 458,136 458,296 288,198" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
          <line x1="288" y1="34" x2="288" y2="202" stroke="#181818" strokeWidth="2" />

          {/* Wall Top & Cuts */}
          <polygon points="136,118 288,30 288,38 142,122" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <polygon points="288,30 464,132 458,136 288,38" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
          <polygon points="136,118 142,122 142,282 136,278" fill="#F0EFEA" stroke="#181818" strokeWidth="1.5" />
          <polygon points="458,136 464,132 464,292 458,296" fill="#EAE7E1" stroke="#181818" strokeWidth="1.5" />

          {/* Warm Sand Floor Plinth */}
          <polygon points="288,198 458,296 304,386 142,282" fill="#FDEBD2" stroke="#181818" strokeWidth="2" />
          <polygon points="142,282 304,386 304,394 142,290" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <polygon points="304,386 458,296 458,304 304,394" fill="#F4EFEA" stroke="#181818" strokeWidth="1.6" />

          {/* Closet Organization System (Right Wall) */}
          <polygon points="296,128 424,202 400,216 272,142" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <polygon points="296,168 424,242 400,256 272,182" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
          <line x1="288" y1="152" x2="414" y2="225" stroke="#181818" strokeWidth="3" />
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((t, idx) => {
            const hx = 288 + (414 - 288) * t;
            const hy = 152 + (225 - 152) * t;
            return (
              <path
                key={idx}
                d={`M ${hx} ${hy} L ${hx - 8} ${hy + 16} L ${hx + 8} ${hy + 25} Z`}
                fill="#FFFFFF"
                stroke="#181818"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Architectural Ticks */}
          <line x1="288" y1="22" x2="288" y2="44" stroke="#181818" strokeWidth="1.5" />
          <line x1="298" y1="388" x2="310" y2="384" stroke="#181818" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }

  // ===========================================================================
  // 6. LIVING & OTHER SPACES
  // ===========================================================================
  return (
    <svg
      viewBox="0 0 540 440"
      className="w-full max-w-[340px] sm:max-w-[370px] h-auto select-none mx-auto drop-shadow-sm transition-transform duration-300"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform={`translate(${270 * (1 - scaleMultiplier)}, ${220 * (1 - scaleMultiplier)}) scale(${scaleMultiplier})`}
      >
        {/* Walls */}
        <polygon points="142,122 288,38 288,198 142,282" fill="#F8F8F7" stroke="#181818" strokeWidth="1.8" />
        <polygon points="288,38 458,136 458,296 288,198" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
        <line x1="288" y1="34" x2="288" y2="202" stroke="#181818" strokeWidth="2" />

        {/* Wall Top & Cuts */}
        <polygon points="136,118 288,30 288,38 142,122" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
        <polygon points="288,30 464,132 458,136 288,38" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
        <polygon points="136,118 142,122 142,282 136,278" fill="#F0EFEA" stroke="#181818" strokeWidth="1.5" />
        <polygon points="458,136 464,132 464,292 458,296" fill="#EAE7E1" stroke="#181818" strokeWidth="1.5" />

        {/* Warm Amber / Cream Floor Plinth */}
        <polygon points="288,198 458,296 304,386 142,282" fill="#FEF3C7" stroke="#181818" strokeWidth="2" />
        <polygon points="142,282 304,386 304,394 142,290" fill="#FFFFFF" stroke="#181818" strokeWidth="1.6" />
        <polygon points="304,386 458,296 458,304 304,394" fill="#F4EFEA" stroke="#181818" strokeWidth="1.6" />

        {/* Left Wall Window */}
        <polygon points="182,143 248,105 248,198 182,236" fill="#1E1E1E" stroke="#181818" strokeWidth="1.8" />
        <polygon points="186,147 244,113 244,195 186,229" fill="#FFFFFF" stroke="#181818" strokeWidth="1.4" />
        <line x1="215" y1="130" x2="215" y2="212" stroke="#181818" strokeWidth="1.4" />

        {/* Sectional Sofa */}
        <polygon points="320,230 420,288 385,308 285,250" fill="#FFFFFF" stroke="#181818" strokeWidth="2" />
        <polygon points="285,250 385,308 385,326 285,268" fill="#EDE9E2" stroke="#181818" strokeWidth="1.8" />
        <polygon points="320,230 420,288 420,270 320,212" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />

        {/* Coffee Table */}
        <polygon points="248,272 302,303 286,312 232,281" fill="#FFFFFF" stroke="#181818" strokeWidth="1.8" />
        <line x1="234" y1="281" x2="234" y2="292" stroke="#181818" strokeWidth="2" />
        <line x1="284" y1="312" x2="284" y2="323" stroke="#181818" strokeWidth="2" />

        {/* Architectural Ticks */}
        <line x1="288" y1="22" x2="288" y2="44" stroke="#181818" strokeWidth="1.5" />
        <line x1="298" y1="388" x2="310" y2="384" stroke="#181818" strokeWidth="1.4" />
      </g>
    </svg>
  );
};
