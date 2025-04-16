import React, { useState } from 'react';

const PropertiesPanel = ({ selectedObject, onObjectChange }) => {
  const [activeCategory, setActiveCategory] = useState('Transform');

  const panelStyle = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTop: '1px solid #333',
    padding: '16px',
    zIndex: 1002,
    color: 'white'
  };

  const categoryStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #333',
    paddingBottom: '8px'
  };

  const categoryButtonStyle = {
    background: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    color: 'white',
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: '14px',
    opacity: 0.7,
    transition: 'opacity 0.2s'
  };

  const activeCategoryButtonStyle = {
    ...categoryButtonStyle,
    opacity: 1,
    borderBottom: '2px solid #2196F3'
  };

  const contentStyle = {
    padding: '16px',
    backgroundColor: '#242424',
    borderRadius: '4px',
    display: 'flex',
    gap: '8px'
  };

  const inputGroupStyle = {
    marginBottom: '12px',
    display: 'flex',
    gap: '8px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontSize: '12px',
    color: '#999'
  };

  const inputStyle = {
    width: '100%',
    padding: '4px 8px',
    background: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    color: 'white',
    fontSize: '12px'
  };

  const checkboxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px'
  };

  const renderTransformProperties = () => (
    <div style={contentStyle}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Position</label>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '200px' }}>
          <input 
            type="number" 
            value={selectedObject?.position?.x || 0} 
            onChange={(e) => onObjectChange('position', { ...selectedObject.position, x: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input 
            type="number" 
            value={selectedObject?.position?.y || 0} 
            onChange={(e) => onObjectChange('position', { ...selectedObject.position, y: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input 
            type="number" 
            value={selectedObject?.position?.z || 0} 
            onChange={(e) => onObjectChange('position', { ...selectedObject.position, z: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Rotation</label>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '200px' }}>
          <input 
            type="number" 
            value={selectedObject?.rotation?.x || 0} 
            onChange={(e) => onObjectChange('rotation', { ...selectedObject.rotation, x: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input 
            type="number" 
            value={selectedObject?.rotation?.y || 0} 
            onChange={(e) => onObjectChange('rotation', { ...selectedObject.rotation, y: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input 
            type="number" 
            value={selectedObject?.rotation?.z || 0} 
            onChange={(e) => onObjectChange('rotation', { ...selectedObject.rotation, z: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Scale</label>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '200px' }}>
          <input 
            type="number" 
            value={selectedObject?.scale?.x || 1} 
            onChange={(e) => onObjectChange('scale', { ...selectedObject.scale, x: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input 
            type="number" 
            value={selectedObject?.scale?.y || 1} 
            onChange={(e) => onObjectChange('scale', { ...selectedObject.scale, y: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
          <input 
            type="number" 
            value={selectedObject?.scale?.z || 1} 
            onChange={(e) => onObjectChange('scale', { ...selectedObject.scale, z: parseFloat(e.target.value) })}
            style={{ ...inputStyle, flex: 1 }}
          />
        </div>
      </div>
    </div>
  );

  const renderGeometryProperties = () => (
    <div style={contentStyle}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Type</label>
        <input 
          type="text" 
          value={selectedObject?.geometry?.type || ''} 
          readOnly 
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Width</label>
        <input 
          type="number" 
          value={selectedObject?.geometry?.parameters?.width || 1} 
          onChange={(e) => onObjectChange('geometry', { 
            ...selectedObject.geometry, 
            parameters: { ...selectedObject.geometry.parameters, width: parseFloat(e.target.value) }
          })}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Height</label>
        <input 
          type="number" 
          value={selectedObject?.geometry?.parameters?.height || 1} 
          onChange={(e) => onObjectChange('geometry', { 
            ...selectedObject.geometry, 
            parameters: { ...selectedObject.geometry.parameters, height: parseFloat(e.target.value) }
          })}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Depth</label>
        <input 
          type="number" 
          value={selectedObject?.geometry?.parameters?.depth || 1} 
          onChange={(e) => onObjectChange('geometry', { 
            ...selectedObject.geometry, 
            parameters: { ...selectedObject.geometry.parameters, depth: parseFloat(e.target.value) }
          })}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Width Segments</label>
        <input 
          type="number" 
          value={selectedObject?.geometry?.parameters?.widthSegments || 1} 
          onChange={(e) => onObjectChange('geometry', { 
            ...selectedObject.geometry, 
            parameters: { ...selectedObject.geometry.parameters, widthSegments: parseInt(e.target.value) }
          })}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Height Segments</label>
        <input 
          type="number" 
          value={selectedObject?.geometry?.parameters?.heightSegments || 1} 
          onChange={(e) => onObjectChange('geometry', { 
            ...selectedObject.geometry, 
            parameters: { ...selectedObject.geometry.parameters, heightSegments: parseInt(e.target.value) }
          })}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Depth Segments</label>
        <input 
          type="number" 
          value={selectedObject?.geometry?.parameters?.depthSegments || 1} 
          onChange={(e) => onObjectChange('geometry', { 
            ...selectedObject.geometry, 
            parameters: { ...selectedObject.geometry.parameters, depthSegments: parseInt(e.target.value) }
          })}
          style={inputStyle}
        />
      </div>
    </div>
  );

  const renderMaterialProperties = () => (
    <div style={contentStyle}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Type</label>
        <select 
          value={selectedObject?.material?.type || 'MeshStandardMaterial'}
          onChange={(e) => onObjectChange('material', { ...selectedObject.material, type: e.target.value })}
          style={inputStyle}
        >
          <option value="MeshStandardMaterial">Standard</option>
          <option value="MeshPhongMaterial">Phong</option>
          <option value="MeshBasicMaterial">Basic</option>
          <option value="MeshLambertMaterial">Lambert</option>
        </select>
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Color</label>
        <input 
          type="color" 
          value={selectedObject?.material?.color || '#ffffff'} 
          onChange={(e) => onObjectChange('material', { ...selectedObject.material, color: e.target.value })}
          style={{ ...inputStyle, height: '24px', padding: '0' }}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Metalness</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={selectedObject?.material?.metalness || 0} 
          onChange={(e) => onObjectChange('material', { ...selectedObject.material, metalness: parseFloat(e.target.value) })}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Roughness</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={selectedObject?.material?.roughness || 0.5} 
          onChange={(e) => onObjectChange('material', { ...selectedObject.material, roughness: parseFloat(e.target.value) })}
          style={inputStyle}
        />
      </div>
      <div style={inputGroupStyle}>
        <div style={checkboxStyle}>
          <input 
            type="checkbox" 
            checked={selectedObject?.material?.wireframe || false}
            onChange={(e) => onObjectChange('material', { ...selectedObject.material, wireframe: e.target.checked })}
          />
          <span>Wireframe</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={panelStyle}>
      <div style={categoryStyle}>
        <button
          style={activeCategory === 'Transform' ? activeCategoryButtonStyle : categoryButtonStyle}
          onClick={() => setActiveCategory('Transform')}
        >
          Transform
        </button>
        <button
          style={activeCategory === 'Geometry' ? activeCategoryButtonStyle : categoryButtonStyle}
          onClick={() => setActiveCategory('Geometry')}
        >
          Geometry
        </button>
        <button
          style={activeCategory === 'Material' ? activeCategoryButtonStyle : categoryButtonStyle}
          onClick={() => setActiveCategory('Material')}
        >
          Material
        </button>
      </div>
      {activeCategory === 'Transform' && renderTransformProperties()}
      {activeCategory === 'Geometry' && renderGeometryProperties()}
      {activeCategory === 'Material' && renderMaterialProperties()}
    </div>
  );
};

export default PropertiesPanel; 