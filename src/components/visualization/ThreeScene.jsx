import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Center } from '@react-three/drei';
import * as THREE from 'three';
import { Furniture3D } from './Furniture3D.jsx';
import { WalkthroughController } from './WalkthroughController.jsx';
import { 
  Compass, 
  Sun, 
  Eye, 
  Layers, 
  Move, 
  Maximize2,
  Armchair,
  Footprints
} from 'lucide-react';

const WALL_HEIGHT = 2.8; // 3D units (~9.2 ft)
const WALL_THICKNESS = 0.22;
const DOOR_HEIGHT = 2.1; // ~7 ft standard door opening
const WINDOW_SILL_HEIGHT = 0.9; // ~3 ft window sill
const WINDOW_HEADER_HEIGHT = 2.1; // ~7 ft window header

const ROOM_COLORS = {
  living: '#EAE6DF',
  dining: '#E8E3DC',
  kitchen: '#F2DFD5',
  utility: '#E5DFDA',
  master_bedroom: '#DFE5DA',
  bedroom: '#E2E8DC',
  guest_bedroom: '#E2E8DC',
  pooja: '#FCEFD2',
  bathroom: '#DCE8EC',
  attached_bathroom: '#DCE8EC',
  balcony: '#E3EAD8',
  foyer: '#FAF6F0',
  parking: '#D8DCD5',
  staircase: '#DCD4C8',
};

const SUN_PRESETS = {
  morning: { pos: [35, 25, 20], color: '#FED7AA', intensity: 1.2, ambient: 0.6, sky: '#1E293B' },
  noon: { pos: [5, 45, 5], color: '#FFFFFF', intensity: 1.5, ambient: 0.8, sky: '#0F172A' },
  golden: { pos: [-35, 18, 25], color: '#FDBA74', intensity: 1.4, ambient: 0.5, sky: '#1C1917' },
  dusk: { pos: [-30, 8, -25], color: '#C084FC', intensity: 0.8, ambient: 0.4, sky: '#090D16' },
};

// 3D Architectural Model with Cutouts & Furniture
const BuildingModel = ({ 
  floorPlan, 
  visibleFloorLevel = 'all',
  showFurniture = true,
  showLabels = true,
}) => {
  const plot = floorPlan?.plot || { width: 30, length: 50 };
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;

  const offsetX = -plotW / 2;
  const offsetZ = -plotL / 2;
  const floors = floorPlan?.floors || [];

  return (
    <group position={[offsetX, 0, offsetZ]}>
      {/* Foundation Ground Slab */}
      <mesh position={[plotW / 2, -0.15, plotL / 2]} receiveShadow>
        <boxGeometry args={[plotW + 6, 0.3, plotL + 6]} />
        <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
      </mesh>

      {/* Front Access Road Strip */}
      <mesh position={[plotW / 2, -0.14, -3]} receiveShadow>
        <boxGeometry args={[plotW + 10, 0.28, 5]} />
        <meshStandardMaterial color="#64748B" roughness={0.8} />
      </mesh>

      {/* Floors */}
      {floors.map((floor) => {
        if (visibleFloorLevel !== 'all' && floor.level !== visibleFloorLevel) {
          return null;
        }

        const floorElevation = floor.level * (WALL_HEIGHT + 0.3);
        const openings = floor.openings || [];

        // Aggregate furniture on floor
        const floorFurniture = [
          ...(floor.furniture || []),
          ...floor.rooms.flatMap(r => (r.furniture || []).map(f => ({ ...f, roomId: f.roomId || r.id })))
        ];
        const uniqueFurniture = Array.from(new Map(floorFurniture.map(f => [f.id, f])).values());

        return (
          <group key={floor.level} position={[0, floorElevation, 0]}>
            {/* Floor Slab Base */}
            <mesh position={[plotW / 2, 0.05, plotL / 2]} receiveShadow>
              <boxGeometry args={[plotW - 0.2, 0.1, plotL - 0.2]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
            </mesh>

            {/* Rooms Floor Meshes & Walls */}
            {floor.rooms.map((room) => {
              const roomCenterX = room.x + room.width / 2;
              const roomCenterZ = room.y + room.height / 2;
              const color = ROOM_COLORS[room.type] || '#EAE6DF';

              // Find openings attached to this room
              const roomOpenings = openings.filter(op => op.wallRoomId === room.id);

              return (
                <group key={room.id}>
                  {/* Room Floor Finish */}
                  <mesh position={[roomCenterX, 0.11, roomCenterZ]} receiveShadow>
                    <boxGeometry args={[room.width - 0.1, 0.02, room.height - 0.1]} />
                    <meshStandardMaterial color={color} roughness={0.4} />
                  </mesh>

                  {/* 4 Boundary Walls with Openings / Cutouts */}
                  {/* North Wall */}
                  <WallSegment
                    x={roomCenterX}
                    y={WALL_HEIGHT / 2}
                    z={room.y + WALL_THICKNESS / 2}
                    width={room.width}
                    height={WALL_HEIGHT}
                    thickness={WALL_THICKNESS}
                    openings={roomOpenings.filter(o => o.wallSide === 'top')}
                  />

                  {/* South Wall */}
                  <WallSegment
                    x={roomCenterX}
                    y={WALL_HEIGHT / 2}
                    z={room.y + room.height - WALL_THICKNESS / 2}
                    width={room.width}
                    height={WALL_HEIGHT}
                    thickness={WALL_THICKNESS}
                    openings={roomOpenings.filter(o => o.wallSide === 'bottom')}
                  />

                  {/* West Wall */}
                  <WallSegment
                    x={room.x + WALL_THICKNESS / 2}
                    y={WALL_HEIGHT / 2}
                    z={roomCenterZ}
                    width={WALL_THICKNESS}
                    height={WALL_HEIGHT}
                    thickness={room.height}
                    openings={roomOpenings.filter(o => o.wallSide === 'left')}
                    isVertical
                  />

                  {/* East Wall */}
                  <WallSegment
                    x={room.x + room.width - WALL_THICKNESS / 2}
                    y={WALL_HEIGHT / 2}
                    z={roomCenterZ}
                    width={WALL_THICKNESS}
                    height={WALL_HEIGHT}
                    thickness={room.height}
                    openings={roomOpenings.filter(o => o.wallSide === 'right')}
                    isVertical
                  />

                  {/* 3D Floating Room Label */}
                  {showLabels && (
                    <Text
                      position={[roomCenterX, WALL_HEIGHT + 0.5, roomCenterZ]}
                      rotation={[-Math.PI / 4, 0, 0]}
                      fontSize={0.7}
                      color="#0F172A"
                      anchorX="center"
                      anchorY="middle"
                    >
                      {room.label}
                    </Text>
                  )}
                </group>
              );
            })}

            {/* 3D Staged Furniture */}
            {showFurniture && uniqueFurniture.map((furn) => (
              <Furniture3D key={furn.id} item={furn} />
            ))}
          </group>
        );
      })}
    </group>
  );
};

// Procedural Wall Segment with Door Lintel and Window Glazing Openings
const WallSegment = ({ x, y, z, width, height, thickness, openings = [], isVertical = false }) => {
  if (!openings || openings.length === 0) {
    return (
      <mesh position={[x, y, z]} castShadow receiveShadow>
        <boxGeometry args={[width, height, thickness]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
      </mesh>
    );
  }

  const op = openings[0];
  const isDoor = op.type === 'door';

  return (
    <group position={[x, y, z]}>
      {/* Base Wall with Lintel Header over opening */}
      <mesh position={[0, (height - (height - DOOR_HEIGHT)) / 2 + (height - DOOR_HEIGHT) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height - DOOR_HEIGHT, thickness]} />
        <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
      </mesh>

      {/* For Windows: Lower Sill Wall below opening */}
      {!isDoor && (
        <mesh position={[0, -height / 2 + WINDOW_SILL_HEIGHT / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width, WINDOW_SILL_HEIGHT, thickness]} />
          <meshStandardMaterial color="#F8FAFC" roughness={0.7} />
        </mesh>
      )}

      {/* For Windows: Glass Pane inside opening */}
      {!isDoor && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[isVertical ? thickness * 0.4 : width * 0.7, WINDOW_HEADER_HEIGHT - WINDOW_SILL_HEIGHT, isVertical ? width * 0.7 : thickness * 0.4]} />
          <meshStandardMaterial color="#38BDF8" transparent opacity={0.35} roughness={0.1} />
        </mesh>
      )}
    </group>
  );
};

export const ThreeScene = ({
  floorPlan,
  visibleFloorLevel = 'all',
}) => {
  const controlsRef = useRef(null);
  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit' | 'walkthrough'
  const [sunTime, setSunTime] = useState('noon'); // 'morning' | 'noon' | 'golden' | 'dusk'
  const [showFurniture, setShowFurniture] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  const sun = SUN_PRESETS[sunTime] || SUN_PRESETS.noon;

  const setCameraPreset = (preset) => {
    if (!controlsRef.current || cameraMode === 'walkthrough') return;
    const controls = controlsRef.current;

    if (preset === 'top') {
      controls.object.position.set(0, 26, 0.1);
    } else if (preset === 'perspective') {
      controls.object.position.set(16, 16, 18);
    } else if (preset === 'front') {
      controls.object.position.set(0, 8, 22);
    } else if (preset === 'iso') {
      controls.object.position.set(-16, 16, 18);
    }
    controls.target.set(0, 2, 0);
    controls.update();
  };

  return (
    <div className="relative w-full h-full min-h-[650px] bg-[#0F172A] select-none overflow-hidden">
      
      {/* 3D Canvas Viewport */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [-18, 18, 22], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={[sun.sky]} />

          {/* Dynamic Sunlight & Ambient Setup */}
          <ambientLight intensity={sun.ambient} />
          <hemisphereLight intensity={0.4} color="#FFFBF5" groundColor="#64748B" />
          <directionalLight
            position={sun.pos}
            intensity={sun.intensity}
            color={sun.color}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={100}
            shadow-camera-left={-35}
            shadow-camera-right={35}
            shadow-camera-top={35}
            shadow-camera-bottom={-35}
          />

          <Center>
            <BuildingModel 
              floorPlan={floorPlan} 
              visibleFloorLevel={visibleFloorLevel}
              showFurniture={showFurniture}
              showLabels={showLabels}
            />
          </Center>

          {/* Camera Controller Switcher */}
          {cameraMode === 'orbit' ? (
            <OrbitControls
              ref={controlsRef}
              makeDefault
              minDistance={4}
              maxDistance={85}
              maxPolarAngle={Math.PI / 2 - 0.05}
              enableDamping
              dampingFactor={0.05}
            />
          ) : (
            <WalkthroughController active={cameraMode === 'walkthrough'} />
          )}
        </Canvas>
      </div>

      {/* Top Floating Viewport Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur px-3.5 py-2 rounded-2xl border border-sand-300 shadow-elevated text-xs font-semibold">
        {/* Camera Mode Toggle */}
        <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl">
          <button
            onClick={() => setCameraMode('orbit')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              cameraMode === 'orbit' ? 'bg-slate-900 text-white shadow-sm' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Orbit View</span>
          </button>
          <button
            onClick={() => setCameraMode('walkthrough')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              cameraMode === 'walkthrough' ? 'bg-sage-600 text-white shadow-sm animate-pulse' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Footprints className="w-3.5 h-3.5 text-amber-300" />
            <span>1st-Person Walkthrough</span>
          </button>
        </div>

        <div className="h-4 w-px bg-sand-300 hidden sm:block" />

        {/* Orbit Presets (Shown only in orbit mode) */}
        {cameraMode === 'orbit' && (
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCameraPreset('iso')}
              className="px-2 py-1 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg transition-colors"
            >
              Isometric
            </button>
            <button
              onClick={() => setCameraPreset('perspective')}
              className="px-2 py-1 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg transition-colors"
            >
              3D Angle
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className="px-2 py-1 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg transition-colors"
            >
              Top-Down
            </button>
          </div>
        )}

        <div className="h-4 w-px bg-sand-300" />

        {/* Time of Day / Sunlight Selector */}
        <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl">
          <Sun className="w-3.5 h-3.5 text-amber-500 ml-1" />
          {['morning', 'noon', 'golden', 'dusk'].map((time) => (
            <button
              key={time}
              onClick={() => setSunTime(time)}
              className={`px-2 py-0.5 rounded-md text-[11px] capitalize transition-colors ${
                sunTime === time ? 'bg-white text-ink shadow-2xs font-bold' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-sand-300" />

        {/* Furniture & Label Toggles */}
        <button
          onClick={() => setShowFurniture(!showFurniture)}
          className={`p-1.5 rounded-lg border transition-colors ${
            showFurniture ? 'bg-sage-100 text-sage-800 border-sage-300' : 'bg-sand-100 text-ink-muted border-sand-200'
          }`}
          title="Toggle 3D Furniture"
        >
          <Armchair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Walkthrough Controls Help Card (Shown during walkthrough) */}
      {cameraMode === 'walkthrough' && (
        <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur text-white p-3.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-4 text-xs animate-in fade-in slide-in-from-bottom-2">
          <div>
            <span className="font-bold block text-amber-400 mb-1">🎮 Walkthrough Controls</span>
            <span className="text-slate-300 text-[11px] block">Use <strong>W, A, S, D</strong> or <strong>Arrow Keys</strong> to walk.</span>
            <span className="text-slate-400 text-[10px] block">Click & drag mouse to look around room.</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-[10px] font-mono font-bold text-center">
            <span />
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">W</span>
            <span />
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">A</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">S</span>
            <span className="bg-slate-800 px-2 py-1 rounded border border-slate-600">D</span>
          </div>
        </div>
      )}
    </div>
  );
};
