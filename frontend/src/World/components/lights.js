
import { HemisphereLight, DirectionalLight } from 'three';

function createLights() {
  const ambientLight = new HemisphereLight(
    'white',
    'darkslategrey',
    5,
  );

  const mainLight = new DirectionalLight('white', 10);
  mainLight.position.set(5, 5, 5);

  return { ambientLight, mainLight };
}

export { createLights };