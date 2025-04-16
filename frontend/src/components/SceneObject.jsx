import React, { forwardRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SceneObject = forwardRef(({ 
  position, 
  rotation, 
  scale, 
  type = 'sphere',
  radius = 1,
  size = 1,
  width = 2,
  height = 2,
  tube = 0.3,
  radialSegments = 32,
  tubularSegments = 32,
  capSegments = 16,
  texture, 
  material,
  onSelect, 
  isSelected, 
  id 
}, ref) => {
  const [hovered, setHovered] = useState(false);

  const getGeometry = () => {
    switch (type) {
      case 'sphere':
        return <sphereGeometry args={[radius, radialSegments, radialSegments]} />;
      case 'cube':
        return <boxGeometry args={[size, size, size]} />;
      case 'plane':
        return <planeGeometry args={[width, height]} />;
      case 'torus':
        return <torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />;
      case 'cylinder':
        return <cylinderGeometry args={[radius, radius, height, radialSegments]} />;
      case 'cone':
        return <coneGeometry args={[radius, height, radialSegments]} />;
      case 'capsule':
        return <capsuleGeometry args={[radius, height, radialSegments, capSegments]} />;
      default:
        return <sphereGeometry args={[radius, radialSegments, radialSegments]} />;
    }
  };

  const getMaterial = () => {
    const materialProps = {
      color: material?.color || '#ffffff',
      metalness: material?.metalness || 0.5,
      roughness: material?.roughness || 0.5,
      wireframe: material?.wireframe || false,
      map: texture || null
    };

    switch (material?.type) {
      case 'MeshPhongMaterial':
        return <meshPhongMaterial {...materialProps} />;
      case 'MeshBasicMaterial':
        return <meshBasicMaterial {...materialProps} />;
      case 'MeshLambertMaterial':
        return <meshLambertMaterial {...materialProps} />;
      default:
        return <meshStandardMaterial {...materialProps} />;
    }
  };

  return (
    <mesh
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => { e.stopPropagation(); onSelect(id); }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {getGeometry()}
      {getMaterial()}
    </mesh>
  );
});

export default SceneObject;
