import * as THREE from 'three';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    75, // FOV
    window.innerWidth / window.innerHeight, // Aspect ratio (updated by Resizer)
    0.1, // Near plane
    1000 // Far plane
  );
  camera.position.set(0, 5, 10);
  camera.lookAt(0, 0, 0);
  console.log('Camera position:', camera.position);
  return camera;
}
