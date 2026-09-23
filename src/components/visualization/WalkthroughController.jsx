import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const WalkthroughController = ({ 
  active = true, 
  eyeHeight = 1.6, 
  moveSpeed = 6.0,
  targetPosition = null,
  onTargetReached = null
}) => {
  const { camera, gl } = useThree();
  const keys = useRef({ forward: false, backward: false, left: false, right: false, sprint: false });
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));

  useEffect(() => {
    if (!active) return;

    // Set initial walkthrough camera position if too high
    if (camera.position.y > 3.5 || camera.position.y < 0.5) {
      camera.position.set(0, eyeHeight, 6);
      camera.lookAt(0, eyeHeight, 0);
    }

    const handleKeyDown = (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) keys.current.forward = true;
      if (['KeyS', 'ArrowDown'].includes(e.code)) keys.current.backward = true;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) keys.current.left = true;
      if (['KeyD', 'ArrowRight'].includes(e.code)) keys.current.right = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.sprint = true;
    };

    const handleKeyUp = (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) keys.current.forward = false;
      if (['KeyS', 'ArrowDown'].includes(e.code)) keys.current.backward = false;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) keys.current.left = false;
      if (['KeyD', 'ArrowRight'].includes(e.code)) keys.current.right = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.current.sprint = false;
    };

    const handleMouseDown = (e) => {
      isDragging.current = true;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      previousMouse.current = { x: e.clientX, y: e.clientY };

      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= deltaX * 0.0032;
      euler.current.x -= deltaY * 0.0032;
      euler.current.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, euler.current.x));
      camera.quaternion.setFromEuler(euler.current);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    gl.domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [active, camera, eyeHeight, gl]);

  // Smooth Teleport when targetPosition changes
  useEffect(() => {
    if (active && targetPosition) {
      camera.position.set(targetPosition[0], targetPosition[1] || eyeHeight, targetPosition[2]);
      if (onTargetReached) onTargetReached();
    }
  }, [active, targetPosition, camera, eyeHeight, onTargetReached]);

  useFrame((_, delta) => {
    if (!active) return;

    const baseSpeed = keys.current.sprint ? moveSpeed * 1.8 : moveSpeed;
    const actualSpeed = baseSpeed * delta;
    const moveVector = new THREE.Vector3();

    if (keys.current.forward) moveVector.z -= actualSpeed;
    if (keys.current.backward) moveVector.z += actualSpeed;
    if (keys.current.left) moveVector.x -= actualSpeed;
    if (keys.current.right) moveVector.x += actualSpeed;

    // Move in local horizontal plane
    moveVector.applyEuler(new THREE.Euler(0, camera.rotation.y, 0));
    camera.position.add(moveVector);
    camera.position.y = eyeHeight; // Maintain steady walking eye level
  });

  return null;
};
