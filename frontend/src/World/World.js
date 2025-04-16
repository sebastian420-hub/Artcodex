import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';
import { Wave } from './components/Wave.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { setupAudio, analyser, dataArray } from './systems/audio.js';
import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three';

let camera;
let controls;
let renderer;
let scene;
let loop;

class World {
  constructor(container,audioFile) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);
  
    const { ambientLight, mainLight } = createLights();
  
    setupAudio(audioFile);
  
    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshStandardMaterial({ color: 'red' });
    const cube = new Mesh(geometry, material);
    scene.add(cube);
  
    // const wave = new Wave(analyser, dataArray);
    // scene.add(wave.mesh);
  
    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight);
  
    
    const resizer = new Resizer(container, camera, renderer, scene);
  }
  

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
