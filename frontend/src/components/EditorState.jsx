// EditorState.js
class EditorState {
    static instance = null;
  
    constructor() {
      if (EditorState.instance) return EditorState.instance;
      this.objects = [
        { id: 0, type: 'sphere', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], radius: 1, texture: null },
      ];
      this.cameras = [];
      this.lights = [
        { id: 0, type: 'ambient', intensity: 0.5, color: '#ffffff' },
        { id: 1, type: 'point', position: [10, 10, 10], intensity: 1, color: '#ffffff' },
      ];
      this.selectedObject = null;
      this.selectedCamera = null;
      this.selectedLight = null;
      this.transformMode = 'translate';
      this.isTransforming = false;
      this.viewportCamera = { fov: 75, near: 0.1, far: 1000, position: [5, 5, 5] };
      this.nextId = 1;
      this.nextCameraId = 1;
      this.nextLightId = 2;
      EditorState.instance = this;
    }
  
    static getInstance() {
      if (!EditorState.instance) new EditorState();
      return EditorState.instance;
    }
  
    // Methods to update state
    addObject(obj) { this.objects.push(obj); this.nextId++; }
    addCamera(cam) { this.cameras.push(cam); this.nextCameraId++; }
    addLight(light) { this.lights.push(light); this.nextLightId++; }
    deleteObject(id) { this.objects = this.objects.filter(obj => obj.id !== id); }
    deleteCamera(id) { this.cameras = this.cameras.filter(cam => cam.id !== id); }
    deleteLight(id) { this.lights = this.lights.filter(light => light.id !== id); }
    updateObject(id, updates) {
      this.objects = this.objects.map(obj => (obj.id === id ? { ...obj, ...updates } : obj));
    }
    updateCamera(id, updates) {
      this.cameras = this.cameras.map(cam => (cam.id === id ? { ...cam, ...updates } : cam));
    }
    updateLight(id, updates) {
      this.lights = this.lights.map(light => (light.id === id ? { ...light, ...updates } : light));
    }
    setSelectedObject(id) { this.selectedObject = id; }
    setSelectedCamera(id) { this.selectedCamera = id; }
    setSelectedLight(id) { this.selectedLight = id; }
    setTransformMode(mode) { this.transformMode = mode; }
    setIsTransforming(value) { this.isTransforming = value; }
    reset() {
      this.objects = [];
      this.cameras = [];
      this.lights = [];
      this.selectedObject = null;
      this.selectedCamera = null;
      this.selectedLight = null;
      this.viewportCamera = { fov: 75, near: 0.1, far: 1000, position: [5, 5, 5] };
      this.nextId = 1;
      this.nextCameraId = 1;
      this.nextLightId = 1;
    }
  }
  
  export default EditorState;