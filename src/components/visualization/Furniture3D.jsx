/**
 * 3D Procedural Architectural Furniture Meshes
 * Converted to clean Three.js / R3F meshes matching the architectural furniture catalog.
 */

import React from 'react';
import * as THREE from 'three';

export const Furniture3D = ({ item }) => {
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
        return (
          <group>
            {/* Bed Wooden Frame Base */}
            <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.4, length]} />
              <meshStandardMaterial color="#4A3728" roughness={0.7} />
            </mesh>
            {/* Mattress */}
            <mesh position={[0, 0.45, 0.05]} castShadow receiveShadow>
              <boxGeometry args={[width - 0.2, 0.35, length - 0.2]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.9} />
            </mesh>
            {/* Headboard */}
            <mesh position={[0, 0.75, -length / 2 + 0.1]} castShadow receiveShadow>
              <boxGeometry args={[width, 1.1, 0.2]} />
              <meshStandardMaterial color="#362518" roughness={0.6} />
            </mesh>
            {/* Pillows */}
            {isSingle ? (
              <mesh position={[0, 0.65, -length / 2 + 0.6]} castShadow>
                <boxGeometry args={[width * 0.6, 0.15, 0.8]} />
                <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
              </mesh>
            ) : (
              <>
                <mesh position={[-width * 0.25, 0.65, -length / 2 + 0.6]} castShadow>
                  <boxGeometry args={[width * 0.38, 0.15, 0.8]} />
                  <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
                </mesh>
                <mesh position={[width * 0.25, 0.65, -length / 2 + 0.6]} castShadow>
                  <boxGeometry args={[width * 0.38, 0.15, 0.8]} />
                  <meshStandardMaterial color="#E2E8F0" roughness={0.8} />
                </mesh>
              </>
            )}
            {/* Blanket / Throw */}
            <mesh position={[0, 0.52, length * 0.15]} receiveShadow>
              <boxGeometry args={[width - 0.18, 0.24, length * 0.65]} />
              <meshStandardMaterial color="#C08552" roughness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'nightstand': {
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.6, length]} />
              <meshStandardMaterial color="#5C4033" roughness={0.7} />
            </mesh>
            {/* Lamp base & shade */}
            <mesh position={[0, 0.7, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.25, 0.3, 12]} />
              <meshStandardMaterial color="#FEF08A" roughness={0.3} emissive="#FEF08A" emissiveIntensity={0.2} />
            </mesh>
          </group>
        );
      }

      case 'sofa_3seater': {
        return (
          <group>
            {/* Seat Base */}
            <mesh position={[0, 0.3, 0.1]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.45, length * 0.75]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.65, -length / 2 + 0.2]} castShadow>
              <boxGeometry args={[width, 0.75, 0.4]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
            {/* Left Armrest */}
            <mesh position={[-width / 2 + 0.2, 0.5, 0]} castShadow>
              <boxGeometry args={[0.4, 0.6, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
            {/* Right Armrest */}
            <mesh position={[width / 2 - 0.2, 0.5, 0]} castShadow>
              <boxGeometry args={[0.4, 0.6, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'sofa_lshape': {
        return (
          <group>
            {/* Main Long Section */}
            <mesh position={[0, 0.3, -length * 0.2]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.45, length * 0.5]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Chaise Return Section */}
            <mesh position={[-width * 0.35, 0.3, length * 0.2]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.3, 0.45, length * 0.5]} />
              <meshStandardMaterial color="#334155" roughness={0.8} />
            </mesh>
            {/* Backrest */}
            <mesh position={[0, 0.65, -length / 2 + 0.2]} castShadow>
              <boxGeometry args={[width, 0.75, 0.4]} />
              <meshStandardMaterial color="#1E293B" roughness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'coffee_table': {
        return (
          <group>
            {/* Table Top */}
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.08, length]} />
              <meshStandardMaterial color="#92400E" roughness={0.5} />
            </mesh>
            {/* Table Legs */}
            <mesh position={[-width / 2 + 0.2, 0.2, -length / 2 + 0.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.38, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[width / 2 - 0.2, 0.2, -length / 2 + 0.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.38, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[-width / 2 + 0.2, 0.2, length / 2 - 0.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.38, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[width / 2 - 0.2, 0.2, length / 2 - 0.2]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.38, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          </group>
        );
      }

      case 'dining_6seater':
      case 'dining_4seater': {
        return (
          <group>
            {/* Dining Table Top */}
            <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
              <boxGeometry args={[width * 0.8, 0.08, length * 0.6]} />
              <meshStandardMaterial color="#B45309" roughness={0.4} />
            </mesh>
            {/* Dining Table Legs */}
            <mesh position={[-width * 0.35, 0.37, -length * 0.25]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[width * 0.35, 0.37, -length * 0.25]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[-width * 0.35, 0.37, length * 0.25]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            <mesh position={[width * 0.35, 0.37, length * 0.25]} castShadow>
              <cylinderGeometry args={[0.06, 0.06, 0.72, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
            {/* Chairs */}
            <mesh position={[-width * 0.2, 0.45, -length * 0.4]} castShadow>
              <boxGeometry args={[0.5, 0.45, 0.4]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[width * 0.2, 0.45, -length * 0.4]} castShadow>
              <boxGeometry args={[0.5, 0.45, 0.4]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[-width * 0.2, 0.45, length * 0.4]} castShadow>
              <boxGeometry args={[0.5, 0.45, 0.4]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[width * 0.2, 0.45, length * 0.4]} castShadow>
              <boxGeometry args={[0.5, 0.45, 0.4]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
          </group>
        );
      }

      case 'kitchen_counter_l': {
        return (
          <group>
            {/* Counter Base Cabinet */}
            <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.85, length]} />
              <meshStandardMaterial color="#334155" roughness={0.6} />
            </mesh>
            {/* Countertop Granite Slab */}
            <mesh position={[0, 0.86, 0]} castShadow receiveShadow>
              <boxGeometry args={[width + 0.1, 0.06, length + 0.1]} />
              <meshStandardMaterial color="#0F172A" roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Sink Basin Hole */}
            <mesh position={[width * 0.2, 0.88, 0]} castShadow>
              <boxGeometry args={[width * 0.35, 0.04, length * 0.45]} />
              <meshStandardMaterial color="#E0F2FE" metalness={0.7} roughness={0.2} />
            </mesh>
          </group>
        );
      }

      case 'refrigerator': {
        return (
          <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, 1.8, length]} />
            <meshStandardMaterial color="#94A3B8" metalness={0.6} roughness={0.3} />
          </mesh>
        );
      }

      case 'wardrobe': {
        return (
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[width, 2.2, length]} />
            <meshStandardMaterial color="#475569" roughness={0.7} />
          </mesh>
        );
      }

      case 'tv_unit': {
        return (
          <group>
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.55, length]} />
              <meshStandardMaterial color="#1E293B" roughness={0.5} />
            </mesh>
            {/* Flat TV Screen */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[width * 0.7, 0.7, 0.08]} />
              <meshStandardMaterial color="#020617" roughness={0.1} metalness={0.8} />
            </mesh>
          </group>
        );
      }

      case 'toilet_wc': {
        return (
          <group>
            {/* Tank */}
            <mesh position={[0, 0.5, -length * 0.3]} castShadow>
              <boxGeometry args={[width * 0.8, 0.7, length * 0.35]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
            {/* Bowl */}
            <mesh position={[0, 0.25, length * 0.15]} castShadow>
              <cylinderGeometry args={[width * 0.35, width * 0.25, 0.45, 16]} />
              <meshStandardMaterial color="#FFFFFF" roughness={0.2} />
            </mesh>
          </group>
        );
      }

      case 'vanity_sink': {
        return (
          <group>
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.85, length]} />
              <meshStandardMaterial color="#F8FAFC" roughness={0.3} />
            </mesh>
            <mesh position={[0, 1.3, -length / 2 + 0.05]} castShadow>
              <boxGeometry args={[width * 0.8, 0.8, 0.04]} />
              <meshStandardMaterial color="#E2E8F0" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        );
      }

      case 'shower_cubicle': {
        return (
          <mesh position={[0, 1.0, 0]}>
            <boxGeometry args={[width, 2.0, length]} />
            <meshStandardMaterial color="#38BDF8" transparent opacity={0.3} roughness={0.1} />
          </mesh>
        );
      }

      case 'pooja_mandir': {
        return (
          <group>
            <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
              <boxGeometry args={[width, 0.8, length]} />
              <meshStandardMaterial color="#B45309" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.95, 0]} castShadow>
              <coneGeometry args={[width * 0.35, 0.45, 4]} />
              <meshStandardMaterial color="#F59E0B" roughness={0.3} />
            </mesh>
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
