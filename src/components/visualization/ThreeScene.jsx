import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Center, Grid } from '@react-three/drei';
import * as THREE from 'three';

/**
 * 3D Architectural Scene Component
 * Converts FloorPlan JSON into procedural 3D meshes (slabs, walls, rooms, furniture massing).
 * Strictly adheres to PRD §19 and Spec §Conceptual 3D view.
 */

const WALL_HEIGHT = 2.8; // 3D units (~9.2 ft)
const WALL_THICKNESS = 0.22;

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

// Floor and Room Meshes Component
const BuildingModel = ({ floorPlan, visibleFloorLevel = 'all' }) => {
  const plot = floorPlan?.plot || { width: 30, length: 50 };
  const plotW = Number(plot.width) || 30;
  const plotL = Number(plot.length) || 50;

  // Center plot at (0, 0)
  const offsetX = -plotW / 2;
  const offsetZ = -plotL / 2;

  const floors = floorPlan?.floors || [];

  return (
    <group position={[offsetX, 0, offsetZ]}>
      
      {/* Plot Ground Foundation Slab */}
      <mesh position={[plotW / 2, -0.15, plotL / 2]} receiveShadow>
        <boxGeometry args={[plotW + 4, 0.3, plotL + 4]} />
        <meshStandardMaterial color="#E8E2D8" roughness={0.9} />
      </mesh>

      {/* Front Access Road Strip */}
      <mesh position={[plotW / 2, -0.14, -2.5]} receiveShadow>
        <boxGeometry args={[plotW + 8, 0.28, 4]} />
        <meshStandardMaterial color="#C8C2B8" roughness={0.8} />
      </mesh>

      {/* Render Floors & Rooms */}
      {floors.map((floor) => {
        if (visibleFloorLevel !== 'all' && floor.level !== visibleFloorLevel) {
          return null;
        }

        const floorElevation = floor.level * (WALL_HEIGHT + 0.3);

        return (
          <group key={floor.level} position={[0, floorElevation, 0]}>
            
            {/* Floor Slab */}
            <mesh position={[plotW / 2, 0.05, plotL / 2]} receiveShadow>
              <boxGeometry args={[plotW - 0.5, 0.1, plotL - 0.5]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
            </mesh>

            {/* Individual Room Slabs & 3D Massing */}
            {floor.rooms.map((room) => {
              const roomCenterX = room.x + room.width / 2;
              const roomCenterZ = room.y + room.height / 2;
              const color = ROOM_COLORS[room.type] || '#EAE6DF';

              return (
                <group key={room.id}>
                  
                  {/* Room Floor Tile */}
                  <mesh position={[roomCenterX, 0.11, roomCenterZ]} receiveShadow>
                    <boxGeometry args={[room.width - 0.1, 0.02, room.height - 0.1]} />
                    <meshStandardMaterial color={color} roughness={0.4} />
                  </mesh>

                  {/* Exterior & Perimeter Walls */}
                  {/* North Wall */}
                  <mesh position={[roomCenterX, WALL_HEIGHT / 2, room.y + WALL_THICKNESS / 2]} castShadow receiveShadow>
                    <boxGeometry args={[room.width, WALL_HEIGHT, WALL_THICKNESS]} />
                    <meshStandardMaterial color="#F7F2EB" roughness={0.7} />
                  </mesh>

                  {/* South Wall */}
                  <mesh position={[roomCenterX, WALL_HEIGHT / 2, room.y + room.height - WALL_THICKNESS / 2]} castShadow receiveShadow>
                    <boxGeometry args={[room.width, WALL_HEIGHT, WALL_THICKNESS]} />
                    <meshStandardMaterial color="#F7F2EB" roughness={0.7} />
                  </mesh>

                  {/* West Wall */}
                  <mesh position={[room.x + WALL_THICKNESS / 2, WALL_HEIGHT / 2, roomCenterZ]} castShadow receiveShadow>
                    <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, room.height]} />
                    <meshStandardMaterial color="#F7F2EB" roughness={0.7} />
                  </mesh>

                  {/* East Wall */}
                  <mesh position={[room.x + room.width - WALL_THICKNESS / 2, WALL_HEIGHT / 2, roomCenterZ]} castShadow receiveShadow>
                    <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, room.height]} />
                    <meshStandardMaterial color="#F7F2EB" roughness={0.7} />
                  </mesh>

                  {/* 3D Furniture & Architectural Massing Elements */}
                  {room.type === 'master_bedroom' || room.type === 'bedroom' ? (
                    // Bed Massing
                    <mesh position={[roomCenterX, 0.4, roomCenterZ]} castShadow>
                      <boxGeometry args={[Math.min(6, room.width * 0.6), 0.6, Math.min(6.5, room.height * 0.6)]} />
                      <meshStandardMaterial color="#C08552" roughness={0.8} />
                    </mesh>
                  ) : room.type === 'kitchen' ? (
                    // Kitchen L-Counter Massing
                    <mesh position={[room.x + room.width - 1.2, 0.45, roomCenterZ]} castShadow>
                      <boxGeometry args={[2, 0.85, room.height - 1]} />
                      <meshStandardMaterial color="#A26638" roughness={0.5} />
                    </mesh>
                  ) : room.type === 'parking' ? (
                    // Car Outline Block
                    <mesh position={[roomCenterX, 0.6, roomCenterZ]} castShadow>
                      <boxGeometry args={[6.5, 1.1, 12]} />
                      <meshStandardMaterial color="#889682" roughness={0.4} />
                    </mesh>
                  ) : room.type === 'pooja' ? (
                    // Mandir Pedestal
                    <mesh position={[roomCenterX, 0.5, roomCenterZ]} castShadow>
                      <boxGeometry args={[2.5, 0.9, 2.5]} />
                      <meshStandardMaterial color="#C89B3C" roughness={0.3} />
                    </mesh>
                  ) : null}

                  {/* 3D Floating Room Label */}
                  <Text
                    position={[roomCenterX, WALL_HEIGHT + 0.5, roomCenterZ]}
                    rotation={[-Math.PI / 4, 0, 0]}
                    fontSize={0.8}
                    color="#1E261F"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {room.label}
                  </Text>
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
};

export const ThreeScene = ({
  floorPlan,
  visibleFloorLevel = 'all',
}) => {
  const controlsRef = useRef(null);

  const setCameraPreset = (preset) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    if (preset === 'top') {
      controls.object.position.set(0, 26, 0.1);
    } else if (preset === 'perspective') {
      controls.object.position.set(15, 15, 18);
    } else if (preset === 'front') {
      controls.object.position.set(0, 8, 20);
    } else if (preset === 'iso') {
      controls.object.position.set(-15, 16, 18);
    }
    controls.target.set(0, 2, 0);
    controls.update();
  };

  return (
    <div className="relative w-full h-full min-h-[650px] bg-[#181E29] select-none overflow-hidden">
      
      {/* R3F Canvas Container - Absolute Fill to prevent flex/min-height CSS collapse */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [-20, 20, 24], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#181E29']} />
          {/* Architectural Lighting Setup */}
          <ambientLight intensity={0.7} />
          <hemisphereLight intensity={0.4} color="#FFFBF5" groundColor="#C7BFB5" />
          <directionalLight
            position={[30, 45, 20]}
            intensity={1.3}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={100}
            shadow-camera-left={-35}
            shadow-camera-right={35}
            shadow-camera-top={35}
            shadow-camera-bottom={-35}
          />
          <directionalLight position={[-20, 25, -20]} intensity={0.4} color="#D8E8F5" />

          <Center>
            <BuildingModel floorPlan={floorPlan} visibleFloorLevel={visibleFloorLevel} />
          </Center>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            minDistance={5}
            maxDistance={80}
            maxPolarAngle={Math.PI / 2 - 0.05} // Do not go below ground
            enableDamping
            dampingFactor={0.05}
          />
        </Canvas>
      </div>

      {/* 3D Viewport Controls Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl border border-sand-300 shadow-elevated text-xs font-semibold">
        <button
          onClick={() => setCameraPreset('iso')}
          className="px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg transition-colors"
        >
          Isometric View
        </button>
        <button
          onClick={() => setCameraPreset('perspective')}
          className="px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg transition-colors"
        >
          3D Perspective
        </button>
        <button
          onClick={() => setCameraPreset('top')}
          className="px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg transition-colors"
        >
          Top-Down 3D
        </button>
        <button
          onClick={() => setCameraPreset('front')}
          className="px-2.5 py-1 bg-sand-100 hover:bg-sand-200 text-ink rounded-lg transition-colors"
        >
          Front Facade
        </button>
      </div>
    </div>
  );
};
