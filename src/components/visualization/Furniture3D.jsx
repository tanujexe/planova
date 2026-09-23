/**
 * 3D High-Fidelity Procedural Architectural Furniture Meshes
 * Converted to rich, realistic Three.js / R3F architectural models
 * with detailed geometry, cushions, hardware, plants, and warm lighting accents.
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

// Procedural Canvas Texture Generators for Materials
export const createWoodTexture = (baseColor = '#8B5A2B', grainColor = '#5C3A21') => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = grainColor;
  for (let i = 0; i < 256; i += 12) {
    ctx.globalAlpha = 0.12;
    ctx.fillRect(0, i, 256, 3);
    ctx.fillRect(0, i + 6, 256, 1);
  }
  ctx.globalAlpha = 1.0;
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

export const createTileTexture = (baseColor = '#F1F5F9', lineColor = '#CBD5E1', size = 32) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 2;
  for (let x = 0; x <= 256; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(256, y || 256);
    ctx.stroke();
  }
  for (let y = 0; y <= 256; y += size) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

export const Furniture3D = ({ item, isNight = false }) => {
  const { type, x, y, width, length, height = 2.5, rotation = 0 } = item;
  
  // Center position of furniture in room/floor coordinates
  const posX = x + width / 2;
  const posZ = y + length / 2;
  const rotRad = (rotation * Math.PI) / 180;

  const renderMesh = () => {
    switch (type) {
      case 'bed_king':
      case 'bed_queen':
      case 'bed_single': {
        const isSingle = type === 'bed_single';
        const frameW = width;
        const frameL = length;
        return (
          <group>
            {/* Wooden Platform Bed Frame */}
            <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
              <boxGeometry args={[frameW, 0.35, frameL]} />
              <meshStandardMaterial color="#3D2817" roughness={0.6} />
            </mesh>
            {/* Bed Recessed Plinth Base */}
            <mesh position={[0, 0.04, 0]} castShadow>
              <boxGeometry args={[frameW * 0.92, 0.08, frameL * 0.92]} />
              <meshStandardMaterial color="#1A110B" roughness={0.9} />
            </mesh>

            {/* Premium Mattress */}
            <mesh position={[0, 0.45, 0.05]} castShadow receiveShadow>
              <boxGeometry args={[frameW - 0.22, 0.32, frameL - 0.22]} />
              <meshStandardMaterial color="#FDFEFE" roughness={0.8} />
            </mesh>

            {/* Upholstered / Wood Headboard */}
            <mesh position={[0, 0.85, -frameL / 2 + 0.1]} castShadow receiveShadow>
              <boxGeometry args={[frameW + 0.1, 1.25, 0.18]} />
              <meshStandardMaterial color="#2B1D12" roughness={0.5} />
            </mesh>
            {/* Headboard Cushioned Inset Panel */}
            <mesh position={[0, 0.9, -frameL / 2 + 0.18]} castShadow>
              <boxGeometry args={[frameW - 0.2, 0.95, 0.08]} />
              <meshStandardMaterial color="#4A5568" roughness={0.85} />
            </mesh>

            {/* Pillows */}
            {isSingle ? (
              <group position={[0, 0.65, -frameL / 2 + 0.65]}>
                <mesh castShadow rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[frameW * 0.65, 0.16, 0.75]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
                </mesh>
                <mesh position={[0, 0.08, 0.2]} castShadow rotation={[0.3, 0, 0]}>
                  <boxGeometry args={[frameW * 0.45, 0.12, 0.5]} />
                  <meshStandardMaterial color="#94A3B8" roughness={0.8} />
                </mesh>
              </group>
            ) : (
              <group position={[0, 0.65, -frameL / 2 + 0.65]}>
                {/* Main Sleeping Pillows */}
                <mesh position={[-frameW * 0.25, 0, 0]} castShadow rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[frameW * 0.4, 0.16, 0.75]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
                </mesh>
                <mesh position={[frameW * 0.25, 0, 0]} castShadow rotation={[0.2, 0, 0]}>
                  <boxGeometry args={[frameW * 0.4, 0.16, 0.75]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.7} />
                </mesh>
                {/* Accent Throw Pillows */}
                <mesh position={[-frameW * 0.22, 0.1, 0.2]} castShadow rotation={[0.35, 0, 0]}>
                  <boxGeometry args={[frameW * 0.3, 0.12, 0.5]} />
                  <meshStandardMaterial color="#C2410C" roughness={0.8} />
                </mesh>
                <mesh position={[frameW * 0.22, 0.1, 0.2]} castShadow rotation={[0.35, 0, 0]}>
                  <boxGeometry args={[frameW * 0.3, 0.12, 0.5]} />
                  <meshStandardMaterial color="#0F766E" roughness={0.8} />
                </mesh>
              </group>
            )}

            {/* Cozy Layered Blanket / Duvet */}
            <mesh position={[0, 0.52, frameL * 0.12]} receiveShadow castShadow>
              <boxGeometry args={[frameW - 0.18, 0.22, frameL * 0.68]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.9} />
            </mesh>
            {/* End-of-Bed Throw Runner */}
            <mesh position={[0, 0.55, frameL * 0.32]} receiveShadow castShadow>
              <boxGeometry args={[frameW - 0.14, 0.18, frameL * 0.24]} />
              <meshStandardMaterial color="#854D0E" roughness={0.85} />
            </mesh>
          </group>
        );
      }

      case 'nightstand': {
        return (
          <group>
            {/* Nightstand Body with Drawer */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.6, length]} />
              <meshStandardMaterial color="#2B1D12" roughness={0.6} />
            </mesh>
            {/* Drawer Line and Metallic Handle */}
            <mesh position={[0, 0.32, length / 2 + 0.02]} castShadow>
              <boxGeometry args={[width * 0.4, 0.04, 0.03]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Table Lamp Base */}
            <mesh position={[0, 0.64, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.16, 0.1, 16]} />
              <meshStandardMaterial color="#1E293B" metalness={0.6} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.74, 0]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Lamp Shade with Glowing Core */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.28, 0.25, 16]} />
              <meshStandardMaterial 
                color="#FEF08A" 
                emissive="#FDE047" 
                emissiveIntensity={isNight ? 0.9 : 0.25} 
                roughness={0.3} 
              />
            </mesh>
            {isNight && (
              <pointLight position={[0, 0.95, 0]} color="#FDE047" intensity={0.8} distance={3.5} />
            )}
          </group>
        );
      }

      case 'sofa_3seater': {
        return (
          <group>
            {/* Sofa Base & Wooden Plinth Legs */}
            <mesh position={[0, 0.1, 0]} castShadow>
              <boxGeometry args={[width * 0.96, 0.18, length * 0.9]} />
              <meshStandardMaterial color="#1E1E1E" roughness={0.7} />
            </mesh>
            {/* 3 Main Cushions */}
            {[-width * 0.3, 0, width * 0.3].map((cx, idx) => (
              <mesh key={idx} position={[cx, 0.32, 0.08]} castShadow receiveShadow>
                <boxGeometry args={[width * 0.28, 0.26, length * 0.68]} />
                <meshStandardMaterial color="#334155" roughness={0.85} />
              </mesh>
            ))}
            {/* Backrest Structure */}
            <mesh position={[0, 0.68, -length / 2 + 0.18]} castShadow>
              <boxGeometry args={[width, 0.75, 0.36]} />
              <meshStandardMaterial color="#1E293B" roughness={0.85} />
            </mesh>
            {/* Backrest Plush Cushions */}
            {[-width * 0.3, 0, width * 0.3].map((cx, idx) => (
              <mesh key={idx} position={[cx, 0.64, -length / 2 + 0.32]} castShadow rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[width * 0.28, 0.44, 0.18]} />
                <meshStandardMaterial color="#334155" roughness={0.85} />
              </mesh>
            ))}
            {/* Left & Right Armrests */}
            <mesh position={[-width / 2 + 0.15, 0.48, 0]} castShadow>
              <boxGeometry args={[0.3, 0.58, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.85} />
            </mesh>
            <mesh position={[width / 2 - 0.15, 0.48, 0]} castShadow>
              <boxGeometry args={[0.3, 0.58, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.85} />
            </mesh>
            {/* Vibrant Throw Cushions */}
            <mesh position={[-width / 2 + 0.38, 0.48, -0.05]} castShadow rotation={[0, 0.4, -0.2]}>
              <boxGeometry args={[0.42, 0.42, 0.15]} />
              <meshStandardMaterial color="#D97706" roughness={0.8} />
            </mesh>
            <mesh position={[width / 2 - 0.38, 0.48, -0.05]} castShadow rotation={[0, -0.4, 0.2]}>
              <boxGeometry args={[0.42, 0.42, 0.15]} />
              <meshStandardMaterial color="#059669" roughness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'sofa_lshape': {
        return (
          <group>
            {/* Main Long Base */}
            <mesh position={[0, 0.1, -length * 0.18]} castShadow>
              <boxGeometry args={[width * 0.96, 0.18, length * 0.48]} />
              <meshStandardMaterial color="#1E1E1E" roughness={0.7} />
            </mesh>
            {/* Main Cushions */}
            <mesh position={[0, 0.32, -length * 0.14]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.9, 0.26, length * 0.42]} />
              <meshStandardMaterial color="#334155" roughness={0.85} />
            </mesh>
            {/* Chaise Lounge Section */}
            <mesh position={[-width * 0.32, 0.32, length * 0.22]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.34, 0.26, length * 0.48]} />
              <meshStandardMaterial color="#334155" roughness={0.85} />
            </mesh>
            {/* Backrest Long Section */}
            <mesh position={[0, 0.68, -length / 2 + 0.18]} castShadow>
              <boxGeometry args={[width, 0.75, 0.36]} />
              <meshStandardMaterial color="#1E293B" roughness={0.85} />
            </mesh>
            {/* Side Armrest */}
            <mesh position={[width / 2 - 0.15, 0.48, -length * 0.18]} castShadow>
              <boxGeometry args={[0.3, 0.58, length * 0.55]} />
              <meshStandardMaterial color="#1E293B" roughness={0.85} />
            </mesh>
            {/* Throw Pillows */}
            <mesh position={[width * 0.25, 0.48, -length * 0.24]} castShadow rotation={[0, -0.3, 0.1]}>
              <boxGeometry args={[0.45, 0.45, 0.16]} />
              <meshStandardMaterial color="#E11D48" roughness={0.8} />
            </mesh>
            <mesh position={[-width * 0.28, 0.48, -length * 0.24]} castShadow rotation={[0, 0.3, -0.1]}>
              <boxGeometry args={[0.45, 0.45, 0.16]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'armchair': {
        return (
          <group>
            {/* Modern Accent Armchair */}
            <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.8, 0.24, length * 0.75]} />
              <meshStandardMaterial color="#0F766E" roughness={0.8} />
            </mesh>
            {/* Curved / Angled Backrest */}
            <mesh position={[0, 0.64, -length * 0.3]} castShadow rotation={[-0.15, 0, 0]}>
              <boxGeometry args={[width * 0.8, 0.58, 0.22]} />
              <meshStandardMaterial color="#115E59" roughness={0.8} />
            </mesh>
            {/* Armrests */}
            <mesh position={[-width * 0.38, 0.46, 0]} castShadow>
              <boxGeometry args={[0.16, 0.4, length * 0.7]} />
              <meshStandardMaterial color="#134E4A" roughness={0.8} />
            </mesh>
            <mesh position={[width * 0.38, 0.46, 0]} castShadow>
              <boxGeometry args={[0.16, 0.4, length * 0.7]} />
              <meshStandardMaterial color="#134E4A" roughness={0.8} />
            </mesh>
            {/* Tapered Brass Legs */}
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
              <mesh key={i} position={[sx * (width * 0.35), 0.1, sz * (length * 0.32)]} castShadow>
                <cylinderGeometry args={[0.025, 0.015, 0.2, 8]} />
                <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        );
      }

      case 'coffee_table': {
        return (
          <group>
            {/* Marble or Walnut Tabletop */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.06, length]} />
              <meshStandardMaterial color="#78350F" roughness={0.4} />
            </mesh>
            {/* Lower Shelf */}
            <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.88, 0.04, length * 0.85]} />
              <meshStandardMaterial color="#451A03" roughness={0.6} />
            </mesh>
            {/* Black Metallic Frame Legs */}
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
              <mesh key={i} position={[sx * (width / 2 - 0.1), 0.22, sz * (length / 2 - 0.1)]} castShadow>
                <boxGeometry args={[0.05, 0.42, 0.05]} />
                <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
              </mesh>
            ))}
            {/* Tabletop Decor: Magazines & Coffee Cup */}
            <mesh position={[-width * 0.18, 0.46, -length * 0.1]} castShadow>
              <boxGeometry args={[0.4, 0.03, 0.3]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.6} />
            </mesh>
            <mesh position={[width * 0.15, 0.48, 0.05]} castShadow>
              <cylinderGeometry args={[0.06, 0.05, 0.09, 12]} />
              <meshStandardMaterial color="#E2E8F0" roughness={0.2} />
            </mesh>
          </group>
        );
      }

      case 'dining_6seater':
      case 'dining_4seater': {
        const is6 = type === 'dining_6seater';
        return (
          <group>
            {/* Dining Table Top */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.82, 0.08, length * 0.65]} />
              <meshStandardMaterial color="#9A3412" roughness={0.4} />
            </mesh>
            {/* Heavy Table Legs */}
            {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz], i) => (
              <mesh key={i} position={[sx * (width * 0.35), 0.36, sz * (length * 0.26)]} castShadow>
                <boxGeometry args={[0.08, 0.72, 0.08]} />
                <meshStandardMaterial color="#1E293B" metalness={0.5} roughness={0.4} />
              </mesh>
            ))}
            {/* Centerpiece Vase & Flower */}
            <mesh position={[0, 0.86, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.12, 0.22, 16]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.1} />
            </mesh>
            <mesh position={[0, 1.02, 0]} castShadow>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#10B981" roughness={0.8} />
            </mesh>

            {/* Dining Chairs */}
            {(is6 
              ? [-width * 0.26, 0, width * 0.26] 
              : [-width * 0.2, width * 0.2]
            ).flatMap((cx, idx) => [
              // Top row chair
              <group key={`t-${idx}`} position={[cx, 0, -length * 0.44]}>
                <mesh position={[0, 0.44, 0]} castShadow>
                  <boxGeometry args={[0.42, 0.06, 0.42]} />
                  <meshStandardMaterial color="#334155" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.72, -0.18]} castShadow rotation={[0.08, 0, 0]}>
                  <boxGeometry args={[0.4, 0.5, 0.05]} />
                  <meshStandardMaterial color="#1E293B" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.22, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
                  <meshStandardMaterial color="#0F172A" />
                </mesh>
              </group>,
              // Bottom row chair
              <group key={`b-${idx}`} position={[cx, 0, length * 0.44]}>
                <mesh position={[0, 0.44, 0]} castShadow>
                  <boxGeometry args={[0.42, 0.06, 0.42]} />
                  <meshStandardMaterial color="#334155" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.72, 0.18]} castShadow rotation={[-0.08, 0, 0]}>
                  <boxGeometry args={[0.4, 0.5, 0.05]} />
                  <meshStandardMaterial color="#1E293B" roughness={0.8} />
                </mesh>
                <mesh position={[0, 0.22, 0]} castShadow>
                  <cylinderGeometry args={[0.03, 0.03, 0.44, 8]} />
                  <meshStandardMaterial color="#0F172A" />
                </mesh>
              </group>
            ])}
          </group>
        );
      }

      case 'kitchen_counter_l': {
        return (
          <group>
            {/* Shaker Base Cabinets */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.84, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.6} />
            </mesh>
            {/* Cabinet Handles */}
            <mesh position={[0, 0.55, length / 2 + 0.02]} castShadow>
              <boxGeometry args={[width * 0.6, 0.03, 0.02]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Polished Black Granite / Quartz Countertop */}
            <mesh position={[0, 0.86, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.08, 0.06, length + 0.08]} />
              <meshStandardMaterial color="#090D16" roughness={0.2} metalness={0.2} />
            </mesh>
            {/* Stainless Steel Drop-in Sink Basin */}
            <mesh position={[width * 0.22, 0.88, 0]} castShadow>
              <boxGeometry args={[width * 0.32, 0.04, length * 0.48]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.85} roughness={0.2} />
            </mesh>
            {/* Chrome High-Arch Faucet */}
            <group position={[width * 0.22, 0.95, -length * 0.18]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.02, 0.03, 0.2, 12]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.15, 0.06]} rotation={[0.6, 0, 0]} castShadow>
                <cylinderGeometry args={[0.018, 0.018, 0.16, 12]} />
                <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
              </mesh>
            </group>
          </group>
        );
      }

      case 'gas_hob': {
        return (
          <group>
            {/* Tempered Glass Cooktop Plate */}
            <mesh position={[0, 0.03, 0]} castShadow>
              <boxGeometry args={[width, 0.05, length]} />
              <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.7} />
            </mesh>
            {/* 3 Burners */}
            {[-width * 0.25, 0, width * 0.25].map((bx, idx) => (
              <group key={idx} position={[bx, 0.07, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.15, 0.18, 0.03, 16]} />
                  <meshStandardMaterial color="#1E293B" metalness={0.9} roughness={0.3} />
                </mesh>
                <mesh position={[0, 0.02, 0]} castShadow>
                  <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
                  <meshStandardMaterial color="#D97706" metalness={0.9} roughness={0.4} />
                </mesh>
              </group>
            ))}
          </group>
        );
      }

      case 'refrigerator': {
        return (
          <group>
            {/* Double Door Stainless Steel Fridge */}
            <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 1.8, length]} />
              <meshStandardMaterial color="#64748B" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Door Split Line & Vertical Long Handles */}
            <mesh position={[0, 0.9, length / 2 + 0.01]} castShadow>
              <boxGeometry args={[0.02, 1.76, 0.01]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[-0.08, 0.9, length / 2 + 0.04]} castShadow>
              <boxGeometry args={[0.03, 0.7, 0.03]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
            </mesh>
            <mesh position={[0.08, 0.9, length / 2 + 0.04]} castShadow>
              <boxGeometry args={[0.03, 0.7, 0.03]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        );
      }

      case 'washing_machine': {
        return (
          <group>
            {/* Main Chassis */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.85, length]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.4} />
            </mesh>
            {/* Front Porch Circular Glass Porthole */}
            <mesh position={[0, 0.42, length / 2 + 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[width * 0.32, width * 0.32, 0.04, 24]} />
              <meshStandardMaterial color="#1E293B" roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.42, length / 2 + 0.03]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[width * 0.22, width * 0.22, 0.02, 24]} />
              <meshStandardMaterial color="#0284C7" transparent opacity={0.6} roughness={0.1} />
            </mesh>
            {/* Top Control Dial */}
            <mesh position={[width * 0.25, 0.76, length / 2 + 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'wardrobe': {
        return (
          <group>
            {/* Floor-to-Ceiling Built-in Wardrobe */}
            <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 2.3, length]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
            {/* Vertical Door Grooves & Handles */}
            <mesh position={[0, 1.15, length / 2 + 0.01]}>
              <boxGeometry args={[0.02, 2.25, 0.01]} />
              <meshStandardMaterial color="#0F172A" />
            </mesh>
            <mesh position={[-0.06, 1.15, length / 2 + 0.03]} castShadow>
              <boxGeometry args={[0.025, 0.6, 0.02]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.06, 1.15, length / 2 + 0.03]} castShadow>
              <boxGeometry args={[0.025, 0.6, 0.02]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        );
      }

      case 'study_desk': {
        return (
          <group>
            {/* Desk Top */}
            <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.06, length]} />
              <meshStandardMaterial color="#78350F" roughness={0.4} />
            </mesh>
            {/* Metal Leg Frames */}
            <mesh position={[-width / 2 + 0.08, 0.36, 0]} castShadow>
              <boxGeometry args={[0.06, 0.72, length * 0.9]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
            <mesh position={[width / 2 - 0.08, 0.36, 0]} castShadow>
              <boxGeometry args={[0.06, 0.72, length * 0.9]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} />
            </mesh>
            {/* Laptop on Desk */}
            <mesh position={[0, 0.76, 0]} castShadow>
              <boxGeometry args={[0.36, 0.02, 0.26]} />
              <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.88, -0.12]} rotation={[-0.3, 0, 0]} castShadow>
              <boxGeometry args={[0.36, 0.24, 0.02]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Ergonomic Office Chair */}
            <group position={[0, 0, length * 0.45]}>
              <mesh position={[0, 0.44, 0]} castShadow>
                <boxGeometry args={[0.44, 0.08, 0.42]} />
                <meshStandardMaterial color="#1E293B" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.75, 0.18]} castShadow rotation={[-0.1, 0, 0]}>
                <boxGeometry args={[0.42, 0.54, 0.06]} />
                <meshStandardMaterial color="#0F172A" roughness={0.8} />
              </mesh>
              <mesh position={[0, 0.22, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 0.44, 12]} />
                <meshStandardMaterial color="#64748B" metalness={0.9} />
              </mesh>
            </group>
          </group>
        );
      }

      case 'tv_unit': {
        return (
          <group>
            {/* Low-Profile Media Credenza */}
            <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.48, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            {/* Slatted Wood Accents */}
            <mesh position={[0, 0.24, length / 2 + 0.02]} castShadow>
              <boxGeometry args={[width * 0.9, 0.38, 0.02]} />
              <meshStandardMaterial color="#92400E" roughness={0.5} />
            </mesh>
            {/* Ultra-Slim OLED TV Display */}
            <mesh position={[0, 0.95, 0]} castShadow>
              <boxGeometry args={[width * 0.78, 0.82, 0.06]} />
              <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.85} />
            </mesh>
            {/* Soundbar */}
            <mesh position={[0, 0.52, 0]} castShadow>
              <boxGeometry args={[width * 0.55, 0.08, 0.12]} />
              <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.7} />
            </mesh>
          </group>
        );
      }

      case 'toilet_wc': {
        return (
          <group>
            {/* Wall-Hung Cistern Enclosure */}
            <mesh position={[0, 0.58, -length * 0.28]} castShadow>
              <boxGeometry args={[width * 0.85, 0.85, length * 0.32]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
            </mesh>
            {/* Chrome Dual-Flush Plate */}
            <mesh position={[0, 0.85, -length * 0.12]} castShadow>
              <boxGeometry args={[0.22, 0.14, 0.02]} />
              <meshStandardMaterial color="#CBD5E1" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Ceramic Commode Pan */}
            <mesh position={[0, 0.3, length * 0.12]} castShadow>
              <cylinderGeometry args={[width * 0.36, width * 0.26, 0.48, 24]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
            </mesh>
            {/* Seat & Lid */}
            <mesh position={[0, 0.55, length * 0.12]} castShadow>
              <boxGeometry args={[width * 0.68, 0.05, length * 0.55]} />
              <meshStandardMaterial color="#F1F5F9" roughness={0.2} />
            </mesh>
          </group>
        );
      }

      case 'vanity_sink': {
        return (
          <group>
            {/* Floating Vanity Cabinet */}
            <mesh position={[0, 0.46, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.68, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.6} />
            </mesh>
            {/* White Porcelain Vessel Basin */}
            <mesh position={[0, 0.86, 0]} castShadow>
              <cylinderGeometry args={[width * 0.32, width * 0.24, 0.18, 24]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.15} />
            </mesh>
            {/* Chrome Tall Vessel Tap */}
            <mesh position={[0, 1.02, -length * 0.24]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.28, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Illuminated Vanity Mirror */}
            <mesh position={[0, 1.45, -length / 2 + 0.03]} castShadow>
              <boxGeometry args={[width * 0.8, 0.75, 0.03]} />
              <meshStandardMaterial 
                color="#E2E8F0" 
                emissive="#F8FAFC" 
                emissiveIntensity={isNight ? 0.4 : 0.1} 
                metalness={0.95} 
                roughness={0.05} 
              />
            </mesh>
            {/* Mirror Frame */}
            <mesh position={[0, 1.45, -length / 2 + 0.015]} castShadow>
              <boxGeometry args={[width * 0.84, 0.79, 0.02]} />
              <meshStandardMaterial color="#0F172A" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        );
      }

      case 'shower_cubicle': {
        return (
          <group>
            {/* Shower Floor Pan */}
            <mesh position={[0, 0.04, 0]} receiveShadow>
              <boxGeometry args={[width, 0.08, length]} />
              <meshStandardMaterial color="#0F172A" roughness={0.8} />
            </mesh>
            {/* Frameless Tempered Glass Enclosures */}
            <mesh position={[0, 1.1, 0]}>
              <boxGeometry args={[width, 2.1, length]} />
              <meshStandardMaterial color="#38BDF8" transparent opacity={0.25} roughness={0.05} />
            </mesh>
            {/* Chrome Rainfall Showerhead Column */}
            <mesh position={[0, 1.4, -length / 2 + 0.08]} castShadow>
              <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
            </mesh>
            <mesh position={[0, 2.15, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.04, 16]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
            </mesh>
          </group>
        );
      }

      case 'pooja_mandir': {
        return (
          <group>
            {/* Carved Teakwood Cabinet Shrine */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.84, length]} />
              <meshStandardMaterial color="#78350F" roughness={0.4} />
            </mesh>
            {/* Tiered Temple Shikhara Gopuram */}
            <mesh position={[0, 1.05, 0]} castShadow>
              <coneGeometry args={[width * 0.38, 0.55, 4]} />
              <meshStandardMaterial color="#D97706" metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Brass Kalash Finial */}
            <mesh position={[0, 1.42, 0]} castShadow>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#FBBF24" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Warm Glowing Diya Lamp */}
            <mesh position={[0, 0.88, 0]} castShadow>
              <cylinderGeometry args={[0.08, 0.04, 0.06, 12]} />
              <meshStandardMaterial 
                color="#F59E0B" 
                emissive="#FBBF24" 
                emissiveIntensity={isNight ? 1.0 : 0.4} 
              />
            </mesh>
            {isNight && (
              <pointLight position={[0, 0.95, 0]} color="#FBBF24" intensity={1.2} distance={4} />
            )}
          </group>
        );
      }

      case 'shoe_rack': {
        return (
          <group>
            {/* Foyer Entry Shoe Cabinet */}
            <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.64, length]} />
              <meshStandardMaterial color="#451A03" roughness={0.5} />
            </mesh>
            {/* Decorative Top Planter or Key Dish */}
            <mesh position={[0, 0.68, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.08, 0.1, 16]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.2} />
            </mesh>
          </group>
        );
      }

      case 'rug_area':
      case 'rug_bedroom': {
        return (
          <group>
            {/* Soft Woven Fabric Area Rug */}
            <mesh position={[0, 0.015, 0]} receiveShadow>
              <boxGeometry args={[width, 0.03, length]} />
              <meshStandardMaterial 
                color={type === 'rug_area' ? '#DDD6C6' : '#C7BAA7'} 
                roughness={0.95} 
              />
            </mesh>
            {/* Rug subtle border */}
            <mesh position={[0, 0.02, 0]} receiveShadow>
              <boxGeometry args={[width * 0.9, 0.02, length * 0.9]} />
              <meshStandardMaterial 
                color={type === 'rug_area' ? '#EDE8DE' : '#DBD3C5'} 
                roughness={0.9} 
              />
            </mesh>
          </group>
        );
      }

      case 'plant_pot': {
        return (
          <group>
            {/* Ceramic Pot */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.35, width * 0.25, 0.6, 20]} />
              <meshStandardMaterial color="#78350F" roughness={0.7} />
            </mesh>
            {/* Soil */}
            <mesh position={[0, 0.58, 0]}>
              <cylinderGeometry args={[width * 0.33, width * 0.33, 0.05, 16]} />
              <meshStandardMaterial color="#271810" roughness={0.9} />
            </mesh>
            {/* Lush Foliage Stem & Leaves */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <sphereGeometry args={[width * 0.48, 16, 16]} />
              <meshStandardMaterial color="#2E7D32" roughness={0.8} />
            </mesh>
            <mesh position={[0.1, 1.15, -0.05]} castShadow>
              <sphereGeometry args={[width * 0.35, 12, 12]} />
              <meshStandardMaterial color="#388E3C" roughness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'bathtub': {
        return (
          <group>
            {/* Freestanding Bathtub Body */}
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.8, length]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.15} />
            </mesh>
            {/* Tub Water Surface */}
            <mesh position={[0, 0.68, 0]}>
              <boxGeometry args={[width - 0.3, 0.05, length - 0.3]} />
              <meshStandardMaterial color="#38BDF8" transparent opacity={0.6} roughness={0.1} />
            </mesh>
            {/* Chrome Tap */}
            <mesh position={[0, 0.88, -length / 2 + 0.15]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} roughness={0.1} />
            </mesh>
          </group>
        );
      }

      case 'kitchen_island': {
        return (
          <group>
            {/* Base Cabinet */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.9, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            {/* Quartz Countertop with Overhang */}
            <mesh position={[0, 0.93, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.2, 0.08, length + 0.2]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.05} />
            </mesh>
            {/* Sink Basin */}
            <mesh position={[-width * 0.2, 0.92, 0]}>
              <boxGeometry args={[1.2, 0.05, 1.2]} />
              <meshStandardMaterial color="#64748B" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Chrome Island Faucet */}
            <mesh position={[-width * 0.2, 1.15, -0.4]} castShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.95} />
            </mesh>
          </group>
        );
      }

      case 'patio_set': {
        return (
          <group>
            {/* Outdoor Patio Table */}
            <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[width * 0.28, width * 0.28, 0.05, 20]} />
              <meshStandardMaterial color="#78350F" roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.15, 0.36, 12]} />
              <meshStandardMaterial color="#1E293B" metalness={0.8} />
            </mesh>
            {/* Outdoor Chairs */}
            {[-1, 1].map((dir, idx) => (
              <group key={idx} position={[dir * width * 0.35, 0, 0]}>
                <mesh position={[0, 0.25, 0]} castShadow>
                  <boxGeometry args={[0.8, 0.06, 0.8]} />
                  <meshStandardMaterial color="#94A3B8" roughness={0.7} />
                </mesh>
                <mesh position={[dir * 0.35, 0.55, 0]} castShadow>
                  <boxGeometry args={[0.06, 0.55, 0.8]} />
                  <meshStandardMaterial color="#64748B" roughness={0.7} />
                </mesh>
              </group>
            ))}
          </group>
        );
      }

      case 'car_sedan':
      case 'car_suv': {
        const isSuv = type === 'car_suv';
        const carH = isSuv ? 1.6 : 1.35;
        return (
          <group>
            {/* Main Car Chassis / Body */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.5, length]} />
              <meshStandardMaterial 
                color={isSuv ? '#475569' : '#FFFFFF'} 
                metalness={0.85} 
                roughness={0.2} 
              />
            </mesh>
            {/* Cabin / Roof */}
            <mesh position={[0, 0.45 + carH * 0.4, -0.1]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.85, carH * 0.55, length * 0.55]} />
              <meshStandardMaterial 
                color={isSuv ? '#334155' : '#F1F5F9'} 
                metalness={0.8} 
                roughness={0.25} 
              />
            </mesh>
            {/* Tinted Windshield & Windows */}
            <mesh position={[0, 0.45 + carH * 0.38, -length * 0.28]} rotation={[-0.45, 0, 0]}>
              <boxGeometry args={[width * 0.82, carH * 0.4, 0.05]} />
              <meshStandardMaterial color="#0F172A" metalness={0.9} roughness={0.1} />
            </mesh>
            {/* Headlights */}
            <mesh position={[-width * 0.32, 0.45, -length / 2]} castShadow>
              <boxGeometry args={[0.4, 0.15, 0.05]} />
              <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[width * 0.32, 0.45, -length / 2]} castShadow>
              <boxGeometry args={[0.4, 0.15, 0.05]} />
              <meshStandardMaterial color="#FEF08A" emissive="#FEF08A" emissiveIntensity={0.6} />
            </mesh>
            {/* Taillights */}
            <mesh position={[-width * 0.32, 0.45, length / 2]}>
              <boxGeometry args={[0.4, 0.12, 0.05]} />
              <meshStandardMaterial color="#DC2626" emissive="#EF4444" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[width * 0.32, 0.45, length / 2]}>
              <boxGeometry args={[0.4, 0.12, 0.05]} />
              <meshStandardMaterial color="#DC2626" emissive="#EF4444" emissiveIntensity={0.5} />
            </mesh>
            {/* Wheels & Tires */}
            {[-1, 1].map((sideX) =>
              [-length * 0.3, length * 0.3].map((posZ, wIdx) => (
                <mesh 
                  key={`${sideX}-${wIdx}`} 
                  position={[sideX * (width / 2), 0.22, posZ]} 
                  rotation={[0, 0, Math.PI / 2]} 
                  castShadow
                >
                  <cylinderGeometry args={[0.26, 0.26, 0.22, 16]} />
                  <meshStandardMaterial color="#0F172A" roughness={0.9} />
                </mesh>
              ))
            )}
          </group>
        );
      }

      default:
        return (
          <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, 0.6, length]} />
            <meshStandardMaterial color="#94A3B8" roughness={0.7} />
          </mesh>
        );
    }
  };

  return (
    <group position={[posX, 0.1, posZ]} rotation={[0, rotRad, 0]}>
      {renderMesh()}
    </group>
  );
};
