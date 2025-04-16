import * as THREE from 'three';

export function createCube() {
  const geometry = new THREE.BoxGeometry(3, 3, 3);
  const material = new THREE.MeshStandardMaterial({ 
    color: "red",
  wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0.5, 0); // Slightly above the origin
  return cube;
}
