import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import SceneObject from './SceneObject';
import EditMenu from './EditMenu';
import TransformPanel from './TransformPanel';
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts';
import PropertiesPanel from './PropertiesPanel';

const Scene = () => {
  const [objects, setObjects] = useState([
    { id: 0, type: 'sphere', position: [0, 0, 0], rotation: [0, 0, 0], scale: [1, 1, 1], radius: 1, texture: null },
  ]);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [nextId, setNextId] = useState(1);
  const [nextCameraId, setNextCameraId] = useState(1);
  const [transformMode, setTransformMode] = useState('translate');
  const [isTransforming, setIsTransforming] = useState(false);
  const [viewportCamera, setViewportCamera] = useState({
    fov: 75,
    near: 0.1,
    far: 1000,
    position: [5, 5, 5]
  });
  const meshRefs = useRef({});
  const cameraRefs = useRef({});
  const transformControlsRef = useRef();
  const orbitControlsRef = useRef();
  const viewportCameraRef = useRef();
  const textureLoader = new THREE.TextureLoader();

  const [lights, setLights] = useState([
    { id: 0, type: 'ambient', intensity: 0.5, color: '#ffffff' },
    { id: 1, type: 'point', position: [10, 10, 10], intensity: 1, color: '#ffffff' },
  ]);
  const [nextLightId, setNextLightId] = useState(2);
  const [selectedLight, setSelectedLight] = useState(null);
  const lightRefs = useRef({});

  useEffect(() => {
    if (!transformControlsRef.current || !orbitControlsRef.current) {
      console.log('Refs not ready yet:', {
        transformControls: transformControlsRef.current,
        orbitControls: orbitControlsRef.current,
      });
      return;
    }

    const controls = transformControlsRef.current;
    const handleDraggingChanged = (event) => {
      console.log('dragging-changed fired, value:', event.value);
      setIsTransforming(event.value);
      orbitControlsRef.current.enabled = !event.value;
    };

    console.log('Attaching dragging-changed listener to TransformControls');
    controls.addEventListener('dragging-changed', handleDraggingChanged);

    if (controls.dragging) {
      console.log('TransformControls already dragging on mount, syncing state');
      setIsTransforming(true);
      orbitControlsRef.current.enabled = false;
    }

    return () => {
      console.log('Removing dragging-changed listener from TransformControls');
      controls.removeEventListener('dragging-changed', handleDraggingChanged);
    };
  }, [transformControlsRef.current, orbitControlsRef.current, selectedObject]);

  const handleAddObject = (type) => {
    const newId = nextId;
    setNextId(nextId + 1);
    
    const baseProperties = {
      id: newId,
      type,
      position: [Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      texture: null,
      material: {
        type: 'MeshStandardMaterial',
        color: '#ffffff',
        metalness: 0.5,
        roughness: 0.5,
        wireframe: false
      }
    };

    const typeSpecificProperties = {
      sphere: { radius: 1 },
      cube: { size: 1 },
      plane: { width: 2, height: 2 },
      torus: { radius: 1, tube: 0.3, radialSegments: 16, tubularSegments: 32 },
      cylinder: { radius: 0.5, height: 2, radialSegments: 32 },
      cone: { radius: 0.5, height: 2, radialSegments: 32 },
      capsule: { radius: 0.5, height: 2, radialSegments: 32, capSegments: 16 }
    };

    setObjects([
      ...objects,
      {
        ...baseProperties,
        ...typeSpecificProperties[type]
      },
    ]);
  };

  const handleDeleteObject = () => {
    if (selectedObject !== null) {
      setObjects(objects.filter(obj => obj.id !== selectedObject));
      setSelectedObject(null);
    }
  };

  const handleSaveState = () => {
    const state = {
      objects,
      lights,
      camera: { position: orbitControlsRef.current?.object.position },
    };
    const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scene-state.json';
    link.click();
  };

  const handleLoadTexture = (file) => {
    if (file && selectedObject !== null) {
      textureLoader.load(URL.createObjectURL(file), (texture) => {
        setObjects(objects.map(obj =>
          obj.id === selectedObject ? { ...obj, texture } : obj
        ));
      });
    }
  };

  const handleMaterialChange = (property, value) => {
    if (selectedObject !== null) {
      setObjects(objects.map(obj =>
        obj.id === selectedObject ? {
          ...obj,
          material: {
            ...obj.material,
            [property]: value
          }
        } : obj
      ));
    }
  };

  const handleRadiusChange = (radius) => {
    if (selectedObject !== null) {
      setObjects(objects.map(obj =>
        obj.id === selectedObject ? { ...obj, radius } : obj
      ));
    }
  };

  const handleObjectChange = (property, value) => {
    if (selectedObject !== null) {
      setObjects(objects.map(obj =>
        obj.id === selectedObject ? {
          ...obj,
          [property]: value
        } : obj
      ));

      if (meshRefs.current[selectedObject]) {
        const mesh = meshRefs.current[selectedObject];
        if (property === 'position') {
          mesh.position.set(...value);
        } else if (property === 'rotation') {
          mesh.rotation.set(...value);
        } else if (property === 'scale') {
          mesh.scale.set(...value);
        }
      }
    }
  };

  useEffect(() => {
    if (!transformControlsRef.current || selectedObject === null) return;

    const controls = transformControlsRef.current;
    const handleChange = () => {
      const object = controls.object;
      if (object) {
        setObjects(objects.map(obj =>
          obj.id === selectedObject ? {
            ...obj,
            position: object.position.toArray(),
            rotation: object.rotation.toArray(),
            scale: object.scale.toArray()
          } : obj
        ));
      }
    };

    controls.addEventListener('change', handleChange);
    return () => controls.removeEventListener('change', handleChange);
  }, [selectedObject, objects]);

  const handleAddCamera = () => {
    const newId = nextCameraId;
    setNextCameraId(nextCameraId + 1);
    const newCamera = {
      id: newId,
      position: [10, 10, 10],
      rotation: [0, 0, 0],
      fov: 75,
      near: 0.1,
      far: 1000,
      name: `Camera ${newId}`
    };
    setCameras([...cameras, newCamera]);
    setSelectedCamera(newId); 
  };

  const handleCameraChange = (property, value) => {
    if (selectedCamera !== null) {
      setCameras(cameras.map(cam =>
        cam.id === selectedCamera ? { ...cam, [property]: value } : cam
      ));

      if (cameraRefs.current[selectedCamera]) {
        const camera = cameraRefs.current[selectedCamera];
        if (property === 'position') {
          camera.position.set(...value);
        } else if (property === 'rotation') {
          camera.rotation.set(...value);
        } else {
          camera[property] = value;
          camera.updateProjectionMatrix();
        }
      }
    } else {
      setViewportCamera(prev => ({
        ...prev,
        [property]: value
      }));

      if (viewportCameraRef.current) {
        if (property === 'position') {
          viewportCameraRef.current.position.set(...value);
        } else {
          viewportCameraRef.current[property] = value;
          viewportCameraRef.current.updateProjectionMatrix();
        }
      }
    }
  };

  const handleDeleteCamera = () => {
    if (selectedCamera !== null) {
      setCameras(cameras.filter(cam => cam.id !== selectedCamera));
      setSelectedCamera(null);
    }
  };

  const handleCameraSelect = (cameraId) => {
    setSelectedCamera(cameraId);
  };

  const handleLoadState = (state) => {
    try {
      if (state.objects) {
        setObjects(state.objects.map(obj => ({
          ...obj,
          position: obj.position,
          rotation: obj.rotation,
          scale: obj.scale,
          radius: obj.radius,
          type: obj.type
        })));
      }

      if (state.cameras) {
        setCameras(state.cameras.map(cam => ({
          ...cam,
          position: cam.position,
          rotation: cam.rotation,
          fov: cam.fov,
          near: cam.near,
          far: cam.far
        })));
      }

      if (state.viewportCamera) {
        setViewportCamera({
          ...state.viewportCamera,
          position: state.viewportCamera.position
        });
      }

      setSelectedObject(null);
      setSelectedCamera(null);
    } catch (error) {
      console.error('Error loading scene state:', error);
      alert('Failed to load scene state. The file might be corrupted or in the wrong format.');
    }
  };

  const handleNewScene = () => {
    if (window.confirm('Create a new scene? This will clear your current scene.')) {

      setObjects([]);
      
      setCameras([]);
      
      setSelectedObject(null);
      setSelectedCamera(null);
      
      setViewportCamera({
        fov: 75,
        near: 0.1,
        far: 1000,
        position: [5, 5, 5]
      });

      setNextId(1);
      setNextCameraId(1);
    }
  };
  

  const handleAddLight = (type) => {
    const newId = nextLightId;
    setNextLightId(nextLightId + 1);

    const baseProperties = {
      id: newId,
      type,
      color: '#ffffff',
      intensity: 1
    };

    const typeSpecificProperties = {
      ambient: {},
      point: { position: [5, 5, 5] },
      spot: { 
        position: [5, 5, 5],
        target: [0, 0, 0],
        angle: Math.PI / 4,
        penumbra: 0.1,
        decay: 1,
        distance: 100
      },
      directional: { 
        position: [5, 5, 5],
        target: [0, 0, 0]
      },
      hemisphere: {
        groundColor: '#000000',
        position: [0, 10, 0]
      }
    };

    setLights([...lights, {
      ...baseProperties,
      ...typeSpecificProperties[type]
    }]);
  };

  const handleDeleteLight = () => {
    if (selectedLight !== null) {
      setLights(lights.filter(light => light.id !== selectedLight));
      setSelectedLight(null);
    }
  };

  const handleLightChange = (property, value) => {
    if (selectedLight !== null) {
      setLights(lights.map(light =>
        light.id === selectedLight ? {
          ...light,
          [property]: value
        } : light
      ));

      if (lightRefs.current[selectedLight]) {
        const light = lights.find(l => l.id === selectedLight);
        if (property === 'position') {
          light.position.set(...value);
        } else if (property === 'target') {
          light.target.position.set(...value);
        } else if (property === 'color') {
          light.color.set(value);
        } else {
          light[property] = value;
        }
      }
    }
  };

  // Add keyboard shortcuts
  useKeyboardShortcuts(setTransformMode);

  return (
    <div style={{
      position: 'fixed',
      top: 56, 
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      zIndex: 1
    }}>
      <EditMenu
        objects={objects}
        selectedObject={selectedObject}
        cameras={cameras}
        selectedCamera={selectedCamera}
        onAddObject={handleAddObject}
        onAddCamera={handleAddCamera}
        onDeleteObject={handleDeleteObject}
        onDeleteCamera={handleDeleteCamera}
        onSaveState={handleSaveState}
        onLoadTexture={handleLoadTexture}
        onMaterialChange={handleMaterialChange}
        transformMode={transformMode}
        setTransformMode={setTransformMode}
        onRadiusChange={handleRadiusChange}
        cameraControls={selectedCamera !== null ? cameras.find(c => c.id === selectedCamera) : viewportCamera}
        onCameraChange={handleCameraChange}
        onCameraSelect={handleCameraSelect}
        onLoadState={handleLoadState}
        onNewScene={handleNewScene}
        onObjectChange={handleObjectChange}
        onObjectSelect={setSelectedObject}
        lights={lights}
        selectedLight={selectedLight}
        onAddLight={handleAddLight}
        onDeleteLight={handleDeleteLight}
        onLightChange={handleLightChange}
        onLightSelect={setSelectedLight}
      />
      <TransformPanel
        transformMode={transformMode}
        setTransformMode={setTransformMode}
      />
      <PropertiesPanel
        selectedObject={selectedObject}
        onObjectChange={handleObjectChange}
      />

      <Canvas
        camera={{ 
          position: viewportCamera.position, 
          fov: viewportCamera.fov,
          near: viewportCamera.near,
          far: viewportCamera.far,
          ref: viewportCameraRef
        }}
        style={{
          background: '#000',
          width: '100%',
          height: '100%',
          position: 'absolute',
          overflow: 'hidden',
          left: 0,
          zIndex: 1001
        }}
      >
        <fog attach="fog" args={['black', 0, 200]} />

        <group onClick={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedObject(null);
          }
        }}>
          {lights.map((light, index) => {
            const lightProps = {
              ref: ref => {
                if (ref) {
                  lightRefs.current[light.id] = ref;
                  // Initialize light properties
                  ref.intensity = light.intensity;
                  ref.color.set(light.color);
                  if (light.type !== 'ambient') {
                    ref.position.set(...light.position);
                    if (light.type === 'spot' || light.type === 'directional') {
                      ref.target.position.set(...light.target);
                    }
                  }
                }
              },
              onClick: (e) => {
                e.stopPropagation();
                setSelectedLight(light.id);
                setSelectedObject(null);
              }
            };

            switch (light.type) {
              case 'ambient':
                return <ambientLight key={light.id} {...lightProps} />;
              case 'point':
                return (
                  <group key={light.id}>
                    <pointLight {...lightProps} />
                    {lightRefs.current[light.id] && (
                      <primitive
                        object={new THREE.PointLightHelper(
                          lightRefs.current[light.id],
                          1,
                          light.color
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLight(light.id);
                          setSelectedObject(null);
                        }}
                      />
                    )}
                  </group>
                );
              case 'spot':
                return (
                  <group key={light.id}>
                    <spotLight
                      {...lightProps}
                      angle={light.angle}
                      penumbra={light.penumbra}
                      decay={light.decay}
                      distance={light.distance}
                    />
                    {lightRefs.current[light.id] && (
                      <primitive
                        object={new THREE.SpotLightHelper(
                          lightRefs.current[light.id],
                          light.color
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLight(light.id);
                          setSelectedObject(null);
                        }}
                      />
                    )}
                  </group>
                );
              case 'directional':
                return (
                  <group key={light.id}>
                    <directionalLight {...lightProps} />
                    {lightRefs.current[light.id] && (
                      <primitive
                        object={new THREE.DirectionalLightHelper(
                          lightRefs.current[light.id],
                          1,
                          light.color
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLight(light.id);
                          setSelectedObject(null);
                        }}
                      />
                    )}
                  </group>
                );
              case 'hemisphere':
                return (
                  <group key={light.id}>
                    <hemisphereLight
                      {...lightProps}
                      groundColor={light.groundColor}
                    />
                    {lightRefs.current[light.id] && (
                      <primitive
                        object={new THREE.HemisphereLightHelper(
                          lightRefs.current[light.id],
                          1,
                          light.color,
                          light.groundColor
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLight(light.id);
                          setSelectedObject(null);
                        }}
                      />
                    )}
                  </group>
                );
              default:
                return null;
            }
          })}
          {selectedLight !== null && lightRefs.current[selectedLight] && (
            <TransformControls
              object={lightRefs.current[selectedLight]}
              mode={transformMode}
              onObjectChange={(object) => {
                if (object) {
                  const light = lights.find(l => l.id === selectedLight);
                  if (light) {
                    if (property === 'position') {
                      handleLightChange('position', object.position.toArray());
                    }
                    if ((light.type === 'spot' || light.type === 'directional') && object.target) {
                      handleLightChange('target', object.target.position.toArray());
                    }
                  }
                }
              }}
              visible={true}
            />
          )}
          {cameras.map(camera => (
            <perspectiveCamera
              key={camera.id}
              ref={ref => cameraRefs.current[camera.id] = ref}
              position={camera.position}
              rotation={camera.rotation}
              fov={camera.fov}
              near={camera.near}
              far={camera.far}
            />
          ))}

          {objects.map(obj => (
            <SceneObject
              key={obj.id}
              ref={ref => meshRefs.current[obj.id] = ref}
              position={obj.position}
              rotation={obj.rotation}
              scale={obj.scale}
              type={obj.type}
              radius={obj.radius}
              size={obj.size}
              width={obj.width}
              height={obj.height}
              tube={obj.tube}
              radialSegments={obj.radialSegments}
              tubularSegments={obj.tubularSegments}
              capSegments={obj.capSegments}
              texture={obj.texture}
              material={obj.material}
              onSelect={() => setSelectedObject(obj.id)}
              isSelected={selectedObject === obj.id}
              id={obj.id}
            />
          ))}

          {selectedObject !== null && meshRefs.current[selectedObject] && (
            <TransformControls
              ref={transformControlsRef}
              object={meshRefs.current[selectedObject]}
              mode={transformMode}
              onObjectChange={handleObjectChange}
              visible={true}
            />
          )}

          <Grid
            cellSize={1}
            cellThickness={0.5}
            cellColor="#555"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#888"
            fadeDistance={25}
            infiniteGrid
          />
        </group>

        <OrbitControls
          ref={orbitControlsRef}
          enableDamping
          dampingFactor={0.05}
          enabled={!isTransforming}
        />
      </Canvas>
    </div>
  );
};

export default Scene;



