import React, { useState, useRef, useEffect } from 'react';

const EditMenu = ({
  objects,
  selectedObject,
  cameras,
  selectedCamera,
  lights,
  selectedLight,
  onAddObject,
  onAddCamera,
  onAddLight,
  onDeleteObject,
  onDeleteCamera,
  onDeleteLight,
  onSaveState,
  onLoadTexture,
  onImportModel,
  onLoadState,
  onNewScene,
  transformMode,
  setTransformMode,
  onRadiusChange,
  cameraControls,
  onCameraChange,
  onCameraSelect,
  onObjectChange,
  onObjectSelect,
  onMaterialChange,
  onLightChange,
  onLightSelect,
}) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const fileInputRef = useRef(null);
  const stateInputRef = useRef(null);
  const [recentScenes, setRecentScenes] = useState([]);

  // Load recent scenes from localStorage
  useEffect(() => {
    const savedScenes = localStorage.getItem('recentScenes');
    if (savedScenes) {
      setRecentScenes(JSON.parse(savedScenes));
    }
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      onImportModel(file);
    }
  };

  const handleStateLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const state = JSON.parse(e.target.result);
          onLoadState(state);
          // Add to recent scenes
          const newScene = {
            name: file.name,
            date: new Date().toISOString(),
            state: state
          };
          const updatedScenes = [newScene, ...recentScenes.slice(0, 4)];
          setRecentScenes(updatedScenes);
          localStorage.setItem('recentScenes', JSON.stringify(updatedScenes));
        } catch (error) {
          console.error('Error loading state:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSaveState = () => {
    const sceneName = prompt('Enter a name for this scene:');
    if (sceneName) {
      onSaveState(sceneName);
      // Add to recent scenes
      const newScene = {
        name: sceneName,
        date: new Date().toISOString(),
        state: {
          objects,
          cameras,
          viewportCamera: cameraControls
        }
      };
      const updatedScenes = [newScene, ...recentScenes.slice(0, 4)];
      setRecentScenes(updatedScenes);
      localStorage.setItem('recentScenes', JSON.stringify(updatedScenes));
    }
  };

  const handleLoadRecentScene = (scene) => {
    if (window.confirm(`Load scene "${scene.name}"? This will replace your current scene.`)) {
      onLoadState(scene.state);
    }
  };

  const handleDeleteRecentScene = (index) => {
    const updatedScenes = recentScenes.filter((_, i) => i !== index);
    setRecentScenes(updatedScenes);
    localStorage.setItem('recentScenes', JSON.stringify(updatedScenes));
  };

  const topbarStyle = {
    position: 'relative',
    top: 41,
    left: 0,
    right: 0,
    height: '40px',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    padding: '0 10px',
    zIndex: 1002,
    borderTop: '1px solid #333',
    borderBottom: '1px solid #333',
    margin: 0,
    boxSizing: 'border-box'
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '0 0 4px 4px',
    padding: '10px',
    minWidth: '200px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    zIndex: 1003
  };

  const categoryButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    padding: '0 15px',
    height: '40px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.2s',
    position: 'relative',
    ':hover': {
      backgroundColor: '#333'
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '4px',
    background: '#444',
    color: 'white',
    border: '1px solid #555',
    borderRadius: '3px',
    fontSize: '12px'
  };

  const categories = [
    {
      name: "File",
      content: (
        <div style={dropdownStyle}>
          <button onClick={onNewScene} className="menu-button">
            New Scene
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="menu-button">
            Import 3D Model
          </button>
          <button onClick={() => stateInputRef.current?.click()} className="menu-button">
            Load Scene
          </button>
          <button onClick={handleSaveState} className="menu-button">
            Save Scene
          </button>
          {recentScenes.length > 0 && (
            <>
              <div className="menu-separator" />
              <div className="recent-scenes">
                <h4>Recent Scenes</h4>
                {recentScenes.map((scene, index) => (
                  <div key={index} className="recent-scene-item">
                    <button onClick={() => handleLoadRecentScene(scene)}>
                      {scene.name}
                    </button>
                    <button onClick={() => handleDeleteRecentScene(index)} className="delete-button">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      name: "Add",
      content: (
        <div style={dropdownStyle}>
          <div style={{ position: 'relative' }}>
            <button 
              className="menu-button subcategory-button"
              onClick={() => setActiveSubcategory(activeSubcategory === 'geometries' ? null : 'geometries')}
            >
              Geometries
              <span style={{ float: 'right' }}>{activeSubcategory === 'geometries' ? '▼' : '▶'}</span>
            </button>
            <div 
              className="subcategory-content"
              style={{ 
                display: activeSubcategory === 'geometries' ? 'block' : 'none',
                position: 'absolute',
                left: '100%',
                top: 0,
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '0 4px 4px 0',
                padding: '10px',
                minWidth: '150px',
                boxShadow: '4px 0 6px rgba(0,0,0,0.1)',
                zIndex: 1004
              }}
            >
              <button onClick={() => onAddObject('sphere')} className="menu-button">Sphere</button>
              <button onClick={() => onAddObject('cube')} className="menu-button">Cube</button>
              <button onClick={() => onAddObject('plane')} className="menu-button">Plane</button>
              <button onClick={() => onAddObject('torus')} className="menu-button">Torus</button>
              <button onClick={() => onAddObject('cylinder')} className="menu-button">Cylinder</button>
              <button onClick={() => onAddObject('cone')} className="menu-button">Cone</button>
              <button onClick={() => onAddObject('capsule')} className="menu-button">Capsule</button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              className="menu-button subcategory-button"
              onClick={() => setActiveSubcategory(activeSubcategory === 'camera' ? null : 'camera')}
            >
              Camera
              <span style={{ float: 'right' }}>{activeSubcategory === 'camera' ? '▼' : '▶'}</span>
            </button>
            <div 
              className="subcategory-content"
              style={{ 
                display: activeSubcategory === 'camera' ? 'block' : 'none',
                position: 'absolute',
                left: '100%',
                top: 0,
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '0 4px 4px 0',
                padding: '10px',
                minWidth: '150px',
                boxShadow: '4px 0 6px rgba(0,0,0,0.1)',
                zIndex: 1004
              }}
            >
              <button onClick={() => onAddCamera()} className="menu-button">Add Camera</button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              className="menu-button subcategory-button"
              onClick={() => setActiveSubcategory(activeSubcategory === 'lights' ? null : 'lights')}
            >
              Lights
              <span style={{ float: 'right' }}>{activeSubcategory === 'lights' ? '▼' : '▶'}</span>
            </button>
            <div 
              className="subcategory-content"
              style={{ 
                display: activeSubcategory === 'lights' ? 'block' : 'none',
                position: 'absolute',
                left: '100%',
                top: 0,
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '0 4px 4px 0',
                padding: '10px',
                minWidth: '150px',
                boxShadow: '4px 0 6px rgba(0,0,0,0.1)',
                zIndex: 1004
              }}
            >
              <button onClick={() => onAddLight('ambient')} className="menu-button">Ambient Light</button>
              <button onClick={() => onAddLight('point')} className="menu-button">Point Light</button>
              <button onClick={() => onAddLight('spot')} className="menu-button">Spot Light</button>
              <button onClick={() => onAddLight('directional')} className="menu-button">Directional Light</button>
              <button onClick={() => onAddLight('hemisphere')} className="menu-button">Hemisphere Light</button>
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Camera",
      content: (
        <div style={dropdownStyle}>
          <select 
            value={selectedCamera !== null ? selectedCamera : 'viewport'}
            onChange={(e) => onCameraSelect(e.target.value === 'viewport' ? null : parseInt(e.target.value))}
            className="camera-select"
          >
            <option value="viewport">Viewport Camera</option>
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>{camera.name}</option>
            ))}
          </select>
          <div className="camera-controls">
            <label>Field of View</label>
            <input
              type="range"
              min="30"
              max="120"
              value={cameraControls.fov}
              onChange={(e) => onCameraChange('fov', parseFloat(e.target.value))}
            />
            <label>Position</label>
            <div className="position-inputs">
              <input
                type="number"
                value={cameraControls.position[0]}
                onChange={(e) => onCameraChange('position', [parseFloat(e.target.value), cameraControls.position[1], cameraControls.position[2]])}
                placeholder="X"
              />
              <input
                type="number"
                value={cameraControls.position[1]}
                onChange={(e) => onCameraChange('position', [cameraControls.position[0], parseFloat(e.target.value), cameraControls.position[2]])}
                placeholder="Y"
              />
              <input
                type="number"
                value={cameraControls.position[2]}
                onChange={(e) => onCameraChange('position', [cameraControls.position[0], cameraControls.position[1], parseFloat(e.target.value)])}
                placeholder="Z"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      name: "Transform",
      content: (
        <div style={dropdownStyle}>
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setTransformMode('translate')}
              className={`menu-button ${transformMode === 'translate' ? 'active' : ''}`}
            >
              Translate
            </button>
            {transformMode === 'translate' && (
              <div style={{ padding: '10px', background: '#333', borderRadius: '4px', marginTop: '5px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Position</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  <input
                    type="number"
                    value={selectedObject !== null ? objects.find(obj => obj.id === selectedObject)?.position[0].toFixed(2) : '0'}
                    onChange={(e) => onObjectChange('position', [parseFloat(e.target.value), objects.find(obj => obj.id === selectedObject)?.position[1], objects.find(obj => obj.id === selectedObject)?.position[2]])}
                    placeholder="X"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={selectedObject !== null ? objects.find(obj => obj.id === selectedObject)?.position[1].toFixed(2) : '0'}
                    onChange={(e) => onObjectChange('position', [objects.find(obj => obj.id === selectedObject)?.position[0], parseFloat(e.target.value), objects.find(obj => obj.id === selectedObject)?.position[2]])}
                    placeholder="Y"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={selectedObject !== null ? objects.find(obj => obj.id === selectedObject)?.position[2].toFixed(2) : '0'}
                    onChange={(e) => onObjectChange('position', [objects.find(obj => obj.id === selectedObject)?.position[0], objects.find(obj => obj.id === selectedObject)?.position[1], parseFloat(e.target.value)])}
                    placeholder="Z"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setTransformMode('rotate')}
              className={`menu-button ${transformMode === 'rotate' ? 'active' : ''}`}
            >
              Rotate
            </button>
            {transformMode === 'rotate' && (
              <div style={{ padding: '10px', background: '#333', borderRadius: '4px', marginTop: '5px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Rotation (degrees)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  <input
                    type="number"
                    value={selectedObject !== null ? (objects.find(obj => obj.id === selectedObject)?.rotation[0] * 180 / Math.PI).toFixed(2) : '0'}
                    onChange={(e) => onObjectChange('rotation', [parseFloat(e.target.value) * Math.PI / 180, objects.find(obj => obj.id === selectedObject)?.rotation[1], objects.find(obj => obj.id === selectedObject)?.rotation[2]])}
                    placeholder="X"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={selectedObject !== null ? (objects.find(obj => obj.id === selectedObject)?.rotation[1] * 180 / Math.PI).toFixed(2) : '0'}
                    onChange={(e) => onObjectChange('rotation', [objects.find(obj => obj.id === selectedObject)?.rotation[0], parseFloat(e.target.value) * Math.PI / 180, objects.find(obj => obj.id === selectedObject)?.rotation[2]])}
                    placeholder="Y"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={selectedObject !== null ? (objects.find(obj => obj.id === selectedObject)?.rotation[2] * 180 / Math.PI).toFixed(2) : '0'}
                    onChange={(e) => onObjectChange('rotation', [objects.find(obj => obj.id === selectedObject)?.rotation[0], objects.find(obj => obj.id === selectedObject)?.rotation[1], parseFloat(e.target.value) * Math.PI / 180])}
                    placeholder="Z"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => setTransformMode('scale')}
              className={`menu-button ${transformMode === 'scale' ? 'active' : ''}`}
            >
              Scale
            </button>
            {transformMode === 'scale' && (
              <div style={{ padding: '10px', background: '#333', borderRadius: '4px', marginTop: '5px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Scale</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  <input
                    type="number"
                    value={selectedObject !== null ? objects.find(obj => obj.id === selectedObject)?.scale[0].toFixed(2) : '1'}
                    onChange={(e) => onObjectChange('scale', [parseFloat(e.target.value), objects.find(obj => obj.id === selectedObject)?.scale[1], objects.find(obj => obj.id === selectedObject)?.scale[2]])}
                    placeholder="X"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={selectedObject !== null ? objects.find(obj => obj.id === selectedObject)?.scale[1].toFixed(2) : '1'}
                    onChange={(e) => onObjectChange('scale', [objects.find(obj => obj.id === selectedObject)?.scale[0], parseFloat(e.target.value), objects.find(obj => obj.id === selectedObject)?.scale[2]])}
                    placeholder="Y"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={selectedObject !== null ? objects.find(obj => obj.id === selectedObject)?.scale[2].toFixed(2) : '1'}
                    onChange={(e) => onObjectChange('scale', [objects.find(obj => obj.id === selectedObject)?.scale[0], objects.find(obj => obj.id === selectedObject)?.scale[1], parseFloat(e.target.value)])}
                    placeholder="Z"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}
          </div>

          {selectedObject !== null && (
            <div style={{ marginTop: '10px', padding: '10px', background: '#333', borderRadius: '4px' }}>
              <button 
                onClick={() => onObjectSelect(null)}
                className="menu-button"
                style={{ 
                  width: '100%',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#ff6666'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
              >
                Deselect Object
              </button>
            </div>
          )}
        </div>
      )
    },
    {
      name: "Material",
      content: selectedObject !== null && (
        <div style={dropdownStyle}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Material Type</label>
            <select
              value={objects.find(obj => obj.id === selectedObject)?.material?.type || 'MeshStandardMaterial'}
              onChange={(e) => onMaterialChange('type', e.target.value)}
              style={inputStyle}
            >
              <option value="MeshStandardMaterial">Standard</option>
              <option value="MeshPhongMaterial">Phong</option>
              <option value="MeshBasicMaterial">Basic</option>
              <option value="MeshLambertMaterial">Lambert</option>
            </select>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Color</label>
            <input
              type="color"
              value={objects.find(obj => obj.id === selectedObject)?.material?.color || '#ffffff'}
              onChange={(e) => onMaterialChange('color', e.target.value)}
              style={{ ...inputStyle, height: '30px', padding: '0' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Metalness</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={objects.find(obj => obj.id === selectedObject)?.material?.metalness || 0.5}
              onChange={(e) => onMaterialChange('metalness', parseFloat(e.target.value))}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Roughness</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={objects.find(obj => obj.id === selectedObject)?.material?.roughness || 0.5}
              onChange={(e) => onMaterialChange('roughness', parseFloat(e.target.value))}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Wireframe</label>
            <input
              type="checkbox"
              checked={objects.find(obj => obj.id === selectedObject)?.material?.wireframe || false}
              onChange={(e) => onMaterialChange('wireframe', e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            <span style={{ color: '#888' }}>Enable wireframe mode</span>
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Texture</label>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="menu-button"
              style={{ marginBottom: '5px' }}
            >
              Load Texture
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  onLoadTexture(file);
                }
              }}
            />
          </div>
        </div>
      )
    },
    {
      name: "Light",
      content: selectedLight !== null && (
        <div style={dropdownStyle}>
          <div style={{ marginTop: '10px', padding: '10px', background: '#333', borderRadius: '4px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Light Type</label>
              <span style={{ color: '#fff' }}>{lights.find(l => l.id === selectedLight)?.type}</span>
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Color</label>
              <input
                type="color"
                value={lights.find(l => l.id === selectedLight)?.color || '#ffffff'}
                onChange={(e) => onLightChange('color', e.target.value)}
                style={{ ...inputStyle, height: '30px', padding: '0' }}
              />
            </div>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Intensity</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={lights.find(l => l.id === selectedLight)?.intensity || 1}
                onChange={(e) => onLightChange('intensity', parseFloat(e.target.value))}
                style={{ ...inputStyle, width: '100%' }}
              />
            </div>

            {lights.find(l => l.id === selectedLight)?.type === 'spot' && (
              <>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Angle</label>
                  <input
                    type="range"
                    min="0"
                    max="Math.PI/2"
                    step="0.1"
                    value={lights.find(l => l.id === selectedLight)?.angle || Math.PI/4}
                    onChange={(e) => onLightChange('angle', parseFloat(e.target.value))}
                    style={{ ...inputStyle, width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Penumbra</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={lights.find(l => l.id === selectedLight)?.penumbra || 0.1}
                    onChange={(e) => onLightChange('penumbra', parseFloat(e.target.value))}
                    style={{ ...inputStyle, width: '100%' }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Distance</label>
                  <input
                    type="number"
                    value={lights.find(l => l.id === selectedLight)?.distance || 100}
                    onChange={(e) => onLightChange('distance', parseFloat(e.target.value))}
                    style={inputStyle}
                  />
                </div>
              </>
            )}

            {lights.find(l => l.id === selectedLight)?.type === 'hemisphere' && (
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Ground Color</label>
                <input
                  type="color"
                  value={lights.find(l => l.id === selectedLight)?.groundColor || '#000000'}
                  onChange={(e) => onLightChange('groundColor', e.target.value)}
                  style={{ ...inputStyle, height: '30px', padding: '0' }}
                />
              </div>
            )}

            {lights.find(l => l.id === selectedLight)?.type !== 'ambient' && (
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '5px' }}>Position</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                  <input
                    type="number"
                    value={lights.find(l => l.id === selectedLight)?.position[0].toFixed(2) || '0'}
                    onChange={(e) => onLightChange('position', [parseFloat(e.target.value), lights.find(l => l.id === selectedLight)?.position[1], lights.find(l => l.id === selectedLight)?.position[2]])}
                    placeholder="X"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={lights.find(l => l.id === selectedLight)?.position[1].toFixed(2) || '0'}
                    onChange={(e) => onLightChange('position', [lights.find(l => l.id === selectedLight)?.position[0], parseFloat(e.target.value), lights.find(l => l.id === selectedLight)?.position[2]])}
                    placeholder="Y"
                    style={inputStyle}
                  />
                  <input
                    type="number"
                    value={lights.find(l => l.id === selectedLight)?.position[2].toFixed(2) || '0'}
                    onChange={(e) => onLightChange('position', [lights.find(l => l.id === selectedLight)?.position[0], lights.find(l => l.id === selectedLight)?.position[1], parseFloat(e.target.value)])}
                    placeholder="Z"
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => onDeleteLight()}
                className="menu-button"
                style={{ 
                  flex: 1,
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#ff6666'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ff4444'}
              >
                Delete Light
              </button>
              <button 
                onClick={() => onLightSelect(null)}
                className="menu-button"
                style={{ 
                  flex: 1,
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#777'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#666'}
              >
                Deselect Light
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  const canvasStyle = {
    position: 'absolute',
    top: '95px',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden'
  };

  return (
    <>
      <style>
        {`
          .menu-button {
            display: block;
            width: 100%;
            padding: 8px 12px;
            margin: 4px 0;
            background: none;
            border: none;
            color: white;
            text-align: left;
            cursor: pointer;
            border-radius: 4px;
          }
          .menu-button:hover {
            background: #333;
          }
          .menu-button.active {
            background: #2196F3;
          }
          .menu-separator {
            height: 1px;
            background: #333;
            margin: 8px 0;
          }
          .recent-scenes h4 {
            margin: 0 0 8px 0;
            color: #888;
            font-size: 12px;
          }
          .recent-scene-item {
            display: flex;
            align-items: center;
            margin: 4px 0;
          }
          .recent-scene-item button {
            flex: 1;
            text-align: left;
            padding: 4px 8px;
          }
          .delete-button {
            padding: 2px 6px;
            background: #ff4444;
            border-radius: 3px;
            margin-left: 8px;
          }
          .camera-select {
            width: 100%;
            margin-bottom: 12px;
            padding: 4px;
            background: #333;
            color: white;
            border: 1px solid #444;
          }
          .camera-controls label {
            display: block;
            margin: 8px 0 4px;
            color: #888;
          }
          .position-inputs {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
          }
          .position-inputs input {
            width: 100%;
            padding: 4px;
            background: #333;
            color: white;
            border: 1px solid #444;
          }
        `}
      </style>
      <div style={topbarStyle}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".glb,.gltf"
          onChange={handleFileSelect}
        />
        <input
          type="file"
          ref={stateInputRef}
          style={{ display: 'none' }}
          accept=".json"
          onChange={handleStateLoad}
        />
        {categories.map((category, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <button
              style={categoryButtonStyle}
              onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
            >
              {category.name}
            </button>
            {activeCategory === category.name && category.content}
          </div>
        ))}
      </div>
    </>
  );
};

export default EditMenu;