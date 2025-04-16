import * as THREE from 'three';

export function createSphere() {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(2, 0.5, 0); // Offset from the cube
  return sphere;
}