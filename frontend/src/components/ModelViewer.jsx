import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three-stdlib';

const ModelViewer = ({ modelUrl }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    console.log('ModelViewer received modelUrl:', modelUrl);
    if (!modelUrl) {
      console.warn('No modelUrl provided to ModelViewer');
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xfff2ff, 7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 7);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    console.log('Attempting to load model from:', modelUrl);

    const throttleProgress = (progress) => {
      const percent = ((progress.loaded / progress.total) * 100).toFixed(2);
      console.log(`Model loading progress: ${percent}%`);
    };
    let lastLogTime = 0;
    const throttleInterval = 500; 

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        console.log('Model loaded successfully:', gltf);
        const model = gltf.scene;

        model.traverse((child) => {
          if (child.isMesh) {
            child.geometry.computeVertexNormals();
            child.material.side = THREE.FrontSide;
            if (child.material.map) {
              child.material.map.minFilter = THREE.LinearFilter;
            }
          }
        });

        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

  
        model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 20 / maxDim; 
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);


        const cameraDistance = maxDim * scaleFactor; 
        camera.position.set(cameraDistance, cameraDistance * 0.5, cameraDistance); 
        camera.lookAt(0, 0, 0);
      },
      (progress) => {
        const now = performance.now();
        if (now - lastLogTime >= throttleInterval) {
          throttleProgress(progress);
          lastLogTime = now;
        }
      },
      (error) => console.error('Model loading error for', modelUrl, ':', error)
    );


    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 1;
    controls.maxDistance = 50;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.addEventListener('wheel', () => {}, { passive: true }); // Explicitly passive


    let lastFrameTime = 0;
    const animate = (time) => {
      const delta = time - lastFrameTime;
      if (delta > 16) { 
        lastFrameTime = time;
        controls.update();
        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);


    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      controls.dispose();
      scene.clear();
      renderer.dispose();
    };
  }, [modelUrl]);

  return <div ref={mountRef} style={{ width: '100%', height: '400px', border: '1px solid black' }} />;
};

export default ModelViewer;