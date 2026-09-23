import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Furniture3D } from './Furniture3D.jsx';
import { WalkthroughController } from './WalkthroughController.jsx';
import {
  Compass,
  Sun,
  Moon,
  Eye,
  Layers,
  Maximize2,
  Armchair,
  Footprints,
  Camera,
  RotateCw,
  Sparkles,
  Sliders,
  X,
  Navigation,
  Grid3X3,
  CheckCircle2,
  Tv,
  Utensils,
  BedDouble,
  Bath,
  TreePine
} from 'lucide-react';

const FULL_WALL_HEIGHT = 2.4; // Clean architectural height (~8 ft)
const WALL_THICKNESS = 0.22;
const DOOR_HEIGHT = 1.9;
const DOOR_WIDTH = 0.85;
const WINDOW_SILL_HEIGHT = 0.8;
const WINDOW_HEADER_HEIGHT = 1.9;

// Curated Architectural Room Materials & Colors
const ROOM_METADATA = {
  living: {
    color: '#EFE8DC',
    name: 'Living Room',
    typeTag: 'Social Zone',
    icon: '🛋️',
  },
  dining: {
    color: '#ECE3D4',
    name: 'Dining Hall',
    typeTag: 'Dining Zone',
    icon: '🍽️',
  },
  kitchen: {
    color: '#E8ECF2',
    name: 'Kitchen & Utility',
    typeTag: 'Kitchen / Wet',
    icon: '🍳',
  },
  utility: {
    color: '#E2E7ED',
    name: 'Utility / Wash',
    typeTag: 'Service Zone',
    icon: '🧺',
  },
  master_bedroom: {
    color: '#E5DCce',
    name: 'Master Bedroom',
    typeTag: 'Master Suite',
    icon: '🛏️',
  },
  bedroom: {
    color: '#EAE1D5',
    name: 'Bedroom',
    typeTag: 'Private Zone',
    icon: '🛏️',
  },
  guest_bedroom: {
    color: '#EAE1D5',
    name: 'Guest Bedroom',
    typeTag: 'Private Zone',
    icon: '🛏️',
  },
  pooja: {
    color: '#FEF3C7',
    name: 'Pooja Room',
    typeTag: 'Sacred Zone',
    icon: '🪔',
  },
  bathroom: {
    color: '#DCE5ED',
    name: 'Bathroom',
    typeTag: 'Sanitary Zone',
    icon: '🚿',
  },
  attached_bathroom: {
    color: '#DCE5ED',
    name: 'En-Suite Bath',
    typeTag: 'Sanitary Zone',
    icon: '🚿',
  },
  balcony: {
    color: '#A27B5C',
    name: 'Balcony Terrace',
    typeTag: 'Outdoor Deck',
    icon: '🌿',
  },
  foyer: {
    color: '#F7F3EB',
    name: 'Entrance Verandah',
    typeTag: 'Circulation',
    icon: '🚪',
  },
  parking: {
    color: '#64748B',
    name: 'Covered Parking',
    typeTag: 'Vehicle Bay',
    icon: '🚗',
  },
  staircase: {
    color: '#D5CCC1',
    name: 'Staircase',
    typeTag: 'Vertical Access',
    icon: '🪜',
  },
};

const getRoomMeta = (type) => {
  return ROOM_METADATA[type] || {
    color: '#EAE6DF',
    name: 'Interior Space',
    typeTag: 'Living Area',
    icon: '🏠',
  };
};

const ATMOSPHERES = {
  daylight: {
    label: 'Daylight',
    pos: [25, 35, 20],
    sunColor: '#FFFDF0',
    intensity: 1.3,
    ambient: 0.75,
    sky: '#0F172A',
    groundColor: '#334155',
  },
  golden: {
    label: 'Golden Hour',
    pos: [-30, 16, 22],
    sunColor: '#FDBA74',
    intensity: 1.4,
    ambient: 0.6,
    sky: '#1C1917',
    groundColor: '#292524',
  },
  night: {
    label: 'Twilight & Lights',
    pos: [-20, 15, -20],
    sunColor: '#93C5FD',
    intensity: 0.5,
    ambient: 0.35,
    sky: '#030712',
    groundColor: '#0F172A',
    isNight: true,
  },
  clay: {
    label: 'Studio Clay',
    pos: [20, 35, 20],
    sunColor: '#FFFFFF',
    intensity: 1.2,
    ambient: 0.9,
    sky: '#1E293B',
    groundColor: '#334155',
    clayMode: true,
  },
};

// Clean Compact Wooden Staircase
const CleanStaircase = ({ width, length, height }) => {
  const steps = 8;
  const stepH = height / steps;
  const stepL = (length - 0.4) / steps;
  const stairW = width - 0.4;

  return (
    <group position={[0.2, 0.1, 0.2]}>
      {Array.from({ length: steps }).map((_, i) => (
        <mesh key={i} position={[stairW / 2, i * stepH + stepH / 2, i * stepL + stepL / 2]} castShadow receiveShadow>
          <boxGeometry args={[stairW, stepH, stepL]} />
          <meshStandardMaterial color="#854D0E" roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// Architectural Wall Segment with Clean Openings
const CleanWallSegment = ({
  x,
  y,
  z,
  length,
  height,
  thickness,
  isVertical = false,
  openings = [],
  clayMode = false,
  isBalconyRail = false
}) => {
  const wallColor = clayMode ? '#F8FAFC' : '#FAF8F5';

  // Balcony Glass Railing
  if (isBalconyRail) {
    const railW = isVertical ? thickness : length;
    const railL = isVertical ? length : thickness;
    return (
      <group position={[x, 0.45, z]}>
        {/* Glass Guard */}
        <mesh>
          <boxGeometry args={[isVertical ? 0.02 : railW - 0.1, 0.9, isVertical ? railL - 0.1 : 0.02]} />
          <meshStandardMaterial color="#0284C7" transparent opacity={0.3} roughness={0.05} />
        </mesh>
        {/* Teak Wood Top Rail */}
        <mesh position={[0, 0.46, 0]} castShadow>
          <boxGeometry args={[isVertical ? 0.06 : railW, 0.04, isVertical ? railL : 0.06]} />
          <meshStandardMaterial color="#78350F" roughness={0.4} />
        </mesh>
      </group>
    );
  }

  // Solid Wall (No openings)
  if (!openings || openings.length === 0) {
    const args = isVertical ? [thickness, height, length] : [length, height, thickness];
    return (
      <mesh position={[x, y, z]} castShadow receiveShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={wallColor} roughness={0.65} />
      </mesh>
    );
  }

  const op = openings[0];
  const isDoor = op.type === 'door';
  const opWidth = Math.min(op.width || 3.0, length * 0.7);

  // Lintel above opening
  const lintelHeight = height - DOOR_HEIGHT;
  const lintelY = (height - lintelHeight / 2);
  const lintelArgs = isVertical ? [thickness, lintelHeight, length] : [length, lintelHeight, thickness];

  // Sill below window
  const sillArgs = isVertical ? [thickness, WINDOW_SILL_HEIGHT, length] : [length, WINDOW_SILL_HEIGHT, thickness];

  return (
    <group position={[x, 0, z]}>
      {/* Lintel Header */}
      <mesh position={[0, lintelY, 0]} castShadow receiveShadow>
        <boxGeometry args={lintelArgs} />
        <meshStandardMaterial color={wallColor} roughness={0.65} />
      </mesh>

      {/* For Windows: Wall Sill below */}
      {!isDoor && (
        <mesh position={[0, WINDOW_SILL_HEIGHT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={sillArgs} />
          <meshStandardMaterial color={wallColor} roughness={0.65} />
        </mesh>
      )}

      {/* Window Frame & Glass Pane */}
      {!isDoor && (
        <group position={[0, WINDOW_SILL_HEIGHT + (WINDOW_HEADER_HEIGHT - WINDOW_SILL_HEIGHT) / 2, 0]}>
          {/* Black Window Frame */}
          <mesh castShadow>
            <boxGeometry
              args={[
                isVertical ? thickness + 0.02 : opWidth,
                WINDOW_HEADER_HEIGHT - WINDOW_SILL_HEIGHT,
                isVertical ? opWidth : thickness + 0.02
              ]}
            />
            <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Reflective Glass Pane */}
          <mesh>
            <boxGeometry
              args={[
                isVertical ? 0.02 : opWidth - 0.08,
                WINDOW_HEADER_HEIGHT - WINDOW_SILL_HEIGHT - 0.08,
                isVertical ? opWidth - 0.08 : 0.02
              ]}
            />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.3} roughness={0.05} />
          </mesh>
        </group>
      )}

      {/* Door Leaf Angled Open */}
      {isDoor && (
        <group position={[0, DOOR_HEIGHT / 2, 0]} rotation={[0, isVertical ? 0.5 : -0.5, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry
              args={[
                isVertical ? 0.04 : opWidth - 0.04,
                DOOR_HEIGHT - 0.04,
                isVertical ? opWidth - 0.04 : 0.04
              ]}
            />
            <meshStandardMaterial color="#5C3A21" roughness={0.4} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// 3D Architectural Building Model
const BuildingModel = ({
  floorPlan,
  visibleFloorLevel = 0,
  showFurniture = true,
  showLabels = true,
  wallHeightScale = 1.0,
  explodedGap = 0,
  isNight = false,
  clayMode = false,
  selectedRoomId = null,
  hoveredRoomId = null,
  onRoomSelect = null,
  onRoomHover = null,
}) => {
  const plot = floorPlan?.plot || { width: 30, length: 50 };
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;

  const currentWallHeight = FULL_WALL_HEIGHT * wallHeightScale;
  const floors = floorPlan?.floors || [];

  return (
    <group position={[-plotW / 2, 0, -plotL / 2]}>
      {/* Surrounding Manicured Lawn Podium */}
      <mesh position={[plotW / 2, -0.15, plotL / 2]} receiveShadow>
        <boxGeometry args={[plotW + 12, 0.3, plotL + 12]} />
        <meshStandardMaterial color={clayMode ? '#E2E8F0' : '#4D7C0F'} roughness={0.9} />
      </mesh>

      {/* Concrete Kerb Border */}
      <mesh position={[plotW / 2, -0.02, plotL / 2]} receiveShadow>
        <boxGeometry args={[plotW + 2.5, 0.08, plotL + 2.5]} />
        <meshStandardMaterial color="#CBD5E1" roughness={0.6} />
      </mesh>

      {/* Paved Front Access Road */}
      <mesh position={[plotW / 2, -0.01, -2.5]} receiveShadow>
        <boxGeometry args={[plotW + 14, 0.08, 5]} />
        <meshStandardMaterial color={clayMode ? '#94A3B8' : '#334155'} roughness={0.8} />
      </mesh>

      {/* Floors */}
      {floors.map((floor) => {
        // Floor isolation
        if (visibleFloorLevel !== 'all' && floor.level !== visibleFloorLevel) {
          return null;
        }

        const baseElevation = floor.level * (FULL_WALL_HEIGHT + 0.3);
        const floorElevation = baseElevation + (floor.level * explodedGap);
        const openings = floor.openings || [];

        // Aggregate furniture on this floor
        const floorFurniture = [
          ...(floor.furniture || []),
          ...floor.rooms.flatMap(r => (r.furniture || []).map(f => ({ ...f, roomId: f.roomId || r.id })))
        ];
        const uniqueFurniture = Array.from(new Map(floorFurniture.map(f => [f.id, f])).values());

        return (
          <group key={floor.level} position={[0, floorElevation, 0]}>
            {/* Structural Floor Plinth Slab */}
            <mesh position={[plotW / 2, 0.04, plotL / 2]} receiveShadow>
              <boxGeometry args={[plotW - 0.2, 0.08, plotL - 0.2]} />
              <meshStandardMaterial color={clayMode ? '#FFFFFF' : '#FFFFFF'} roughness={0.5} />
            </mesh>

            {/* Rooms Floor Finishes & Walls */}
            {floor.rooms.map((room) => {
              const roomCenterX = room.x + room.width / 2;
              const roomCenterZ = room.y + room.height / 2;
              const meta = getRoomMeta(room.type);
              const isSelected = selectedRoomId === room.id;
              const isHovered = hoveredRoomId === room.id;

              const floorColor = clayMode
                ? (isSelected ? '#FDE047' : isHovered ? '#FEF08A' : '#F1F5F9')
                : (isSelected ? '#FBBF24' : isHovered ? '#FEF08A' : meta.color);

              const roomOpenings = openings.filter(op => op.wallRoomId === room.id);
              const isBalcony = room.type === 'balcony';

              return (
                <group key={room.id}>
                  {/* Room Floor Finish */}
                  <mesh
                    position={[roomCenterX, 0.09, roomCenterZ]}
                    receiveShadow
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRoomSelect) onRoomSelect(room, floor.level, [roomCenterX, floorElevation, roomCenterZ]);
                    }}
                    onPointerOver={(e) => {
                      e.stopPropagation();
                      if (onRoomHover) onRoomHover(room.id);
                    }}
                    onPointerOut={(e) => {
                      e.stopPropagation();
                      if (onRoomHover) onRoomHover(null);
                    }}
                  >
                    <boxGeometry args={[room.width - 0.04, 0.02, room.height - 0.04]} />
                    <meshStandardMaterial
                      color={floorColor}
                      roughness={0.4}
                      emissive={isSelected ? '#F59E0B' : isHovered ? '#FBBF24' : '#000000'}
                      emissiveIntensity={isSelected ? 0.3 : isHovered ? 0.15 : 0}
                    />
                  </mesh>

                  {/* Ceiling Point Light for Night Mode */}
                  {isNight && (
                    <pointLight
                      position={[roomCenterX, currentWallHeight * 0.8, roomCenterZ]}
                      color="#FEF08A"
                      intensity={1.0}
                      distance={room.width * 1.5}
                    />
                  )}

                  {/* Clean Staircase Steps inside Staircase Room */}
                  {room.type === 'staircase' && (
                    <group position={[room.x, 0, room.y]}>
                      <CleanStaircase width={room.width} length={room.height} height={FULL_WALL_HEIGHT} />
                    </group>
                  )}

                  {/* 4 Boundary Walls with Openings */}
                  {/* North Wall */}
                  <CleanWallSegment
                    x={roomCenterX}
                    y={currentWallHeight / 2}
                    z={room.y + WALL_THICKNESS / 2}
                    length={room.width}
                    height={currentWallHeight}
                    thickness={WALL_THICKNESS}
                    openings={roomOpenings.filter(o => o.wallSide === 'top')}
                    clayMode={clayMode}
                    isBalconyRail={isBalcony && room.y <= 2.5}
                  />

                  {/* South Wall */}
                  <CleanWallSegment
                    x={roomCenterX}
                    y={currentWallHeight / 2}
                    z={room.y + room.height - WALL_THICKNESS / 2}
                    length={room.width}
                    height={currentWallHeight}
                    thickness={WALL_THICKNESS}
                    openings={roomOpenings.filter(o => o.wallSide === 'bottom')}
                    clayMode={clayMode}
                    isBalconyRail={false}
                  />

                  {/* West Wall */}
                  <CleanWallSegment
                    x={room.x + WALL_THICKNESS / 2}
                    y={currentWallHeight / 2}
                    z={roomCenterZ}
                    length={room.height}
                    height={currentWallHeight}
                    thickness={WALL_THICKNESS}
                    openings={roomOpenings.filter(o => o.wallSide === 'left')}
                    isVertical
                    clayMode={clayMode}
                    isBalconyRail={isBalcony && room.x <= 2.5}
                  />

                  {/* East Wall */}
                  <CleanWallSegment
                    x={room.x + room.width - WALL_THICKNESS / 2}
                    y={currentWallHeight / 2}
                    z={roomCenterZ}
                    length={room.height}
                    height={currentWallHeight}
                    thickness={WALL_THICKNESS}
                    openings={roomOpenings.filter(o => o.wallSide === 'right')}
                    isVertical
                    clayMode={clayMode}
                    isBalconyRail={false}
                  />

                  {/* Sleek Minimalist 3D Room Pill Badge */}
                  {showLabels && (
                    <Html
                      position={[roomCenterX, currentWallHeight + 0.35, roomCenterZ]}
                      center
                      distanceFactor={28}
                      zIndexRange={[100, 0]}
                    >
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onRoomSelect) onRoomSelect(room, floor.level, [roomCenterX, floorElevation, roomCenterZ]);
                        }}
                        style={{ whiteSpace: 'nowrap' }}
                        className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-tight shadow-md transition-all duration-150 select-none ${isSelected
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-white scale-105 font-bold shadow-amber-500/50'
                            : isHovered
                              ? 'bg-slate-900 text-amber-300 scale-105 ring-1 ring-amber-400'
                              : 'bg-slate-950/85 backdrop-blur-md text-slate-200 border border-slate-700/80 hover:bg-slate-900'
                          }`}
                      >
                        <span className="text-[12px]">{meta.icon}</span>
                        <span>{room.label}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {Math.round(room.width * room.height)} sqft
                        </span>
                      </div>
                    </Html>
                  )}
                </group>
              );
            })}

            {/* 3D Staged Furniture */}
            {showFurniture && uniqueFurniture.map((furn) => (
              <Furniture3D key={furn.id} item={furn} isNight={isNight} />
            ))}
          </group>
        );
      })}
    </group>
  );
};

// Auto Turntable Controller
const TurntableController = ({ active = false, speed = 0.5 }) => {
  const { camera } = useThree();
  useFrame((_, delta) => {
    if (!active) return;
    const angle = delta * speed * 0.5;
    const x = camera.position.x * Math.cos(angle) + camera.position.z * Math.sin(angle);
    const z = -camera.position.x * Math.sin(angle) + camera.position.z * Math.cos(angle);
    camera.position.x = x;
    camera.position.z = z;
    camera.lookAt(0, 1.5, 0);
  });
  return null;
};

export const ThreeScene = ({
  floorPlan,
  visibleFloorLevel = 0,
  onError = null,
}) => {
  const controlsRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Active Floor Selection: Default to Ground Floor (0) so user sees clean single floor by default
  const [activeFloor, setActiveFloor] = useState(
    visibleFloorLevel !== undefined ? visibleFloorLevel : 0
  );

  useEffect(() => {
    if (visibleFloorLevel !== undefined) {
      setActiveFloor(visibleFloorLevel);
    }
  }, [visibleFloorLevel]);

  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit' | 'walkthrough'
  const [atmosphere, setAtmosphere] = useState('daylight'); // 'daylight' | 'golden' | 'night' | 'clay'
  const [showFurniture, setShowFurniture] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [wallHeightPreset, setWallHeightPreset] = useState('full'); // 'full' | 'dollhouse' | 'low'
  const [explodedGap, setExplodedGap] = useState(3.0); // 3.0m default exploded separation for multi-floor
  const [isTurntable, setIsTurntable] = useState(false);

  // Interactive Room Selection & Inspector Card
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [walkthroughTarget, setWalkthroughTarget] = useState(null);
  const [snapshotToast, setSnapshotToast] = useState(false);

  const currentAtmo = ATMOSPHERES[atmosphere] || ATMOSPHERES.daylight;
  const isNight = atmosphere === 'night';
  const clayMode = atmosphere === 'clay';

  const wallHeightScale = wallHeightPreset === 'full' ? 1.0 : wallHeightPreset === 'dollhouse' ? 0.45 : 0.15;

  const setCameraPreset = (preset) => {
    if (!controlsRef.current || cameraMode === 'walkthrough') return;
    const controls = controlsRef.current;
    setIsTurntable(false);

    if (preset === 'top') {
      controls.object.position.set(0, 32, 0.1);
    } else if (preset === 'perspective') {
      controls.object.position.set(16, 16, 20);
    } else if (preset === 'front') {
      controls.object.position.set(0, 8, 26);
    } else if (preset === 'iso') {
      controls.object.position.set(-18, 18, 22);
    }
    controls.target.set(0, 1.5, 0);
    controls.update();
  };

  const handleRoomSelect = (room, floorLevel, centerCoords) => {
    setSelectedRoom({ ...room, floorLevel });
    if (controlsRef.current && cameraMode === 'orbit') {
      const [cx, cy, cz] = centerCoords;
      controlsRef.current.target.set(cx - (floorPlan?.plot?.width || 30) / 2, cy + 1, cz - (floorPlan?.plot?.length || 50) / 2);
      controlsRef.current.update();
    }
  };

  const teleportToRoom = (room) => {
    const plotW = Number(floorPlan?.plot?.width) || 30;
    const plotL = Number(floorPlan?.plot?.length) || 50;
    const roomCenterX = room.x + room.width / 2 - plotW / 2;
    const roomCenterZ = room.y + room.height / 2 - plotL / 2;
    const floorElevation = (room.floor || 0) * (FULL_WALL_HEIGHT + 0.3);

    setCameraMode('walkthrough');
    setWalkthroughTarget([roomCenterX, floorElevation + 1.5, roomCenterZ]);
  };

  const takeSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = image;
    a.download = `planova-3d-model-${Date.now()}.png`;
    a.click();
    setSnapshotToast(true);
    setTimeout(() => setSnapshotToast(false), 2500);
  };

  const floors = floorPlan?.floors || [];

  return (
    <div
      ref={canvasContainerRef}
      className="relative w-full h-full min-h-[650px] bg-[#090D16] select-none overflow-hidden"
    >

      {/* 3D Canvas Viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [-18, 18, 22], fov: 42 }}
          gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
          style={{ width: '100%', height: '100%' }}
          onPointerMissed={() => setSelectedRoom(null)}
        >
          <color attach="background" args={[currentAtmo.sky]} />

          {/* Dynamic Lighting Setup */}
          <ambientLight intensity={currentAtmo.ambient} />
          <hemisphereLight
            intensity={0.4}
            color="#FFFDF5"
            groundColor={currentAtmo.groundColor}
          />
          <directionalLight
            position={currentAtmo.pos}
            intensity={currentAtmo.intensity}
            color={currentAtmo.sunColor}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
            shadow-camera-far={100}
            shadow-camera-left={-35}
            shadow-camera-right={35}
            shadow-camera-top={35}
            shadow-camera-bottom={-35}
          />

          <Center>
            <BuildingModel
              floorPlan={floorPlan}
              visibleFloorLevel={activeFloor}
              showFurniture={showFurniture}
              showLabels={showLabels}
              wallHeightScale={wallHeightScale}
              explodedGap={activeFloor === 'all' ? explodedGap : 0}
              isNight={isNight}
              clayMode={clayMode}
              selectedRoomId={selectedRoom?.id}
              hoveredRoomId={hoveredRoomId}
              onRoomSelect={handleRoomSelect}
              onRoomHover={setHoveredRoomId}
            />
          </Center>

          {/* Turntable Auto Rotation */}
          <TurntableController active={isTurntable && cameraMode === 'orbit'} />

          {/* Camera Controller Switcher */}
          {cameraMode === 'orbit' ? (
            <OrbitControls
              ref={controlsRef}
              makeDefault
              minDistance={3}
              maxDistance={85}
              maxPolarAngle={Math.PI / 2 - 0.02}
              enableDamping
              dampingFactor={0.06}
            />
          ) : (
            <WalkthroughController
              active={cameraMode === 'walkthrough'}
              targetPosition={walkthroughTarget}
              onTargetReached={() => setWalkthroughTarget(null)}
            />
          )}
        </Canvas>
      </div>

      {/* Top Floating Viewport Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EAE6DF] shadow-elevated text-xs font-semibold text-neutral-900">

        {/* Floor Level Selector */}
        <div className="flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-xl border border-[#EAE6DF]">
          <button
            onClick={() => setActiveFloor(0)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeFloor === 0
                ? 'bg-neutral-950 text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
              }`}
          >
            Ground (G)
          </button>
          {floors.length > 1 && (
            <button
              onClick={() => setActiveFloor(1)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeFloor === 1
                  ? 'bg-neutral-950 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                }`}
            >
              First (L1)
            </button>
          )}
          {floors.length > 1 && (
            <button
              onClick={() => setActiveFloor('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeFloor === 'all'
                  ? 'bg-neutral-950 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                }`}
              title="Exploded 3D Stack (All Floors)"
            >
              All Floors (3D Stack)
            </button>
          )}
        </div>

        <div className="h-4 w-px bg-[#E5E0D8] hidden sm:block" />

        {/* Camera Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-xl border border-[#EAE6DF]">
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${cameraMode === 'orbit'
                ? 'bg-neutral-950 text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
              }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>3D Orbit</span>
          </button>
          <button
            onClick={() => setCameraMode('walkthrough')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${cameraMode === 'walkthrough'
                ? 'bg-neutral-950 text-white shadow-xs font-bold'
                : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
              }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span>1st-Person Walk</span>
          </button>
        </div>

        <div className="h-4 w-px bg-[#E5E0D8] hidden sm:block" />

        {/* Orbit Presets */}
        {cameraMode === 'orbit' && (
          <div className="hidden lg:flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-xl border border-[#EAE6DF]">
            <button
              onClick={() => setCameraPreset('iso')}
              className="px-2.5 py-1 hover:bg-white text-neutral-700 hover:text-neutral-950 rounded-lg transition-colors text-[11px] font-medium"
            >
              Isometric
            </button>
            <button
              onClick={() => setCameraPreset('perspective')}
              className="px-2.5 py-1 hover:bg-white text-neutral-700 hover:text-neutral-950 rounded-lg transition-colors text-[11px] font-medium"
            >
              3D Angle
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className="px-2.5 py-1 hover:bg-white text-neutral-700 hover:text-neutral-950 rounded-lg transition-colors text-[11px] font-medium"
            >
              Top-Down
            </button>
            <button
              onClick={() => setIsTurntable(!isTurntable)}
              className={`p-1.5 rounded-lg transition-colors ${isTurntable ? 'bg-neutral-950 text-white shadow-xs font-bold' : 'hover:bg-white text-neutral-600 hover:text-neutral-950'
                }`}
              title="Auto-Rotate Turntable"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="h-4 w-px bg-[#E5E0D8]" />

        {/* Atmosphere Selector */}
        <div className="flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-xl border border-[#EAE6DF]">
          <Sun className="w-3.5 h-3.5 text-neutral-600 ml-1.5" />
          {Object.entries(ATMOSPHERES).map(([key, atmo]) => (
            <button
              key={key}
              onClick={() => setAtmosphere(key)}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors ${atmosphere === key
                  ? 'bg-neutral-950 text-white shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
                }`}
            >
              {atmo.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-[#E5E0D8] hidden xl:block" />

        {/* Wall Height Cutaway Mode */}
        <div className="hidden xl:flex items-center gap-1 bg-[#F5F2EC] p-1 rounded-xl border border-[#EAE6DF] text-[11px]">
          <button
            onClick={() => setWallHeightPreset('full')}
            className={`px-2 py-1 rounded-md transition-colors ${wallHeightPreset === 'full' ? 'bg-neutral-950 text-white font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
              }`}
          >
            Full Walls
          </button>
          <button
            onClick={() => setWallHeightPreset('dollhouse')}
            className={`px-2 py-1 rounded-md transition-colors ${wallHeightPreset === 'dollhouse' ? 'bg-neutral-950 text-white font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
              }`}
          >
            Dollhouse Cut (4ft)
          </button>
          <button
            onClick={() => setWallHeightPreset('low')}
            className={`px-2 py-1 rounded-md transition-colors ${wallHeightPreset === 'low' ? 'bg-neutral-950 text-white font-bold shadow-xs' : 'text-neutral-600 hover:text-neutral-950 hover:bg-white/60'
              }`}
          >
            Plan Footprint
          </button>
        </div>

        <div className="h-4 w-px bg-[#E5E0D8]" />

        {/* Quick Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowFurniture(!showFurniture)}
            className={`p-2 rounded-xl border transition-colors ${showFurniture
                ? 'bg-neutral-950 text-white shadow-xs border-neutral-950'
                : 'bg-white hover:bg-[#F5F2EC] text-neutral-700 border-[#DDD8CE]'
              }`}
            title="Toggle 3D Furniture"
          >
            <Armchair className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`p-2 rounded-xl border transition-colors ${showLabels
                ? 'bg-neutral-950 text-white shadow-xs border-neutral-950'
                : 'bg-white hover:bg-[#F5F2EC] text-neutral-700 border-[#DDD8CE]'
              }`}
            title="Toggle 3D Room Badges"
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={takeSnapshot}
            className="p-2 rounded-xl bg-white hover:bg-[#F5F2EC] text-neutral-700 border border-[#DDD8CE] transition-colors shadow-xs"
            title="Download High-Res 3D Snapshot"
          >
            <Camera className="w-3.5 h-3.5 text-neutral-800" />
          </button>
        </div>
      </div>

      {/* Exploded View Slider (When 'all' floors selected) */}
      {activeFloor === 'all' && floors.length > 1 && (
        <div className="absolute top-20 right-4 z-20 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-[#EAE6DF] shadow-elevated flex items-center gap-3 text-xs text-neutral-800">
          <Layers className="w-4 h-4 text-neutral-700" />
          <span className="font-semibold text-[11px]">Exploded Stack Gap:</span>
          <input
            type="range"
            min="1.5"
            max="6.0"
            step="0.5"
            value={explodedGap}
            onChange={(e) => setExplodedGap(parseFloat(e.target.value))}
            className="w-24 accent-neutral-950 cursor-pointer h-1.5 bg-[#EAE6DF] rounded-lg"
          />
          <span className="font-mono text-neutral-900 font-bold text-[11px] min-w-[2.5rem]">
            +{explodedGap.toFixed(1)}m
          </span>
        </div>
      )}

      {/* Floating Selected Room Details Card */}
      {selectedRoom && (
        <div className="absolute bottom-6 right-6 z-20 w-80 bg-white/98 backdrop-blur-xl border border-[#EAE6DF] rounded-3xl p-5 shadow-2xl text-neutral-900 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-500 block mb-0.5">
                {getRoomMeta(selectedRoom.type).typeTag}
              </span>
              <h3 className="text-base font-bold text-neutral-950 flex items-center gap-2">
                <span>{getRoomMeta(selectedRoom.type).icon}</span>
                <span>{selectedRoom.label}</span>
              </h3>
            </div>
            <button
              onClick={() => setSelectedRoom(null)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full bg-[#F5F2EC] hover:bg-[#EAE6DF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 my-3.5 bg-[#FAF8F5] p-3 rounded-2xl border border-[#EAE6DF]">
            <div>
              <span className="text-[10px] text-neutral-500 block">Dimensions</span>
              <span className="text-xs font-mono font-bold text-neutral-900">
                {selectedRoom.width} ft × {selectedRoom.height} ft
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">Carpet Area</span>
              <span className="text-xs font-mono font-bold text-neutral-900">
                {Math.round(selectedRoom.width * selectedRoom.height)} sq.ft
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => teleportToRoom(selectedRoom)}
              className="flex-1 py-2.5 px-3 bg-neutral-950 hover:bg-neutral-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk Into Room</span>
            </button>
          </div>
        </div>
      )}

      {/* Walkthrough Navigation Overlay & Controls HUD */}
      {cameraMode === 'walkthrough' && (
        <div className="absolute bottom-6 left-6 z-20 bg-white/95 backdrop-blur-md text-neutral-900 p-4 rounded-3xl border border-[#EAE6DF] shadow-elevated flex items-center gap-5 text-xs animate-in fade-in slide-in-from-bottom-2">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-bold text-emerald-600 text-xs">1st-Person Walkthrough Active</span>
            </div>
            <span className="text-neutral-700 text-[11px] block">Use <strong>W, A, S, D</strong> or <strong>Arrow Keys</strong> to move.</span>
            <span className="text-neutral-500 text-[10px] block">Hold <strong>Shift</strong> to sprint | Click & drag mouse to look around.</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-bold text-center">
            <span />
            <span className="bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#EAE6DF] shadow-xs text-neutral-900">W</span>
            <span />
            <span className="bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#EAE6DF] shadow-xs text-neutral-900">A</span>
            <span className="bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#EAE6DF] shadow-xs text-neutral-900">S</span>
            <span className="bg-[#FAF8F5] px-2.5 py-1.5 rounded-lg border border-[#EAE6DF] shadow-xs text-neutral-900">D</span>
          </div>
        </div>
      )}

      {/* Snapshot Toast Notification */}
      {snapshotToast && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-neutral-950 text-white px-4 py-2 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-2xl border border-neutral-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>3D Snapshot Saved & Downloaded!</span>
        </div>
      )}
    </div>
  );
};
