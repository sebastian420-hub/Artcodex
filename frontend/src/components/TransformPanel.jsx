import React from 'react';

const TransformPanel = ({ transformMode, setTransformMode }) => {
  const panelStyle = {
    position: 'absolute',
    top: '89px', // Position it right under the EditMenu
    right: '10px',
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column', // Make it vertical
    gap: '8px',
    zIndex: 1002,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    pointerEvents: 'auto'
  };

  const buttonStyle = {
    background: '#1a1a1a',
    border: '1px solid #333',
    color: 'white',
    padding: '8px 12px',
    cursor: 'pointer',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s',
    pointerEvents: 'auto',
    width: '100%',
    textAlign: 'left'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: '#333'
  };

  return (
    <div style={panelStyle}>
      <button
        style={transformMode === 'translate' ? activeButtonStyle : buttonStyle}
        onClick={() => setTransformMode('translate')}
        title="Translate (T)"
      >
        <span style={{ fontSize: '18px' }}>↕</span>
        <span>Move</span>
      </button>
      <button
        style={transformMode === 'rotate' ? activeButtonStyle : buttonStyle}
        onClick={() => setTransformMode('rotate')}
        title="Rotate (R)"
      >
        <span style={{ fontSize: '18px' }}>⟳</span>
        <span>Rotate</span>
      </button>
      <button
        style={transformMode === 'scale' ? activeButtonStyle : buttonStyle}
        onClick={() => setTransformMode('scale')}
        title="Scale (S)"
      >
        <span style={{ fontSize: '18px' }}>⤡</span>
        <span>Scale</span>
      </button>
    </div>
  );
};

export default TransformPanel; 