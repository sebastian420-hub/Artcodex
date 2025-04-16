import React from 'react';
import ModelViewer from './ModelViewer';

export default function Artworks({ post }) { 
  const [loadModel, setLoadModel] = React.useState(false);

  const handleLoadModel = () => {
    setLoadModel(!loadModel);
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="post-content">
          <small className="text-muted">{post.post}</small> 
          {post.image && <img src={post.image} alt="post" className="img-fluid" />}
          {post.model_3d_data && (
            <div>
              <button
                className="btn btn-primary btn-sm mb-2"
                onClick={handleLoadModel}
                style={{ borderRadius: '8px' }}
              >
                Load 3D Model
              </button>
              {loadModel && <ModelViewer modelUrl={post.model_3d_data.file} />}
            </div>
          )}
          <small className="text-muted">Created by: {post.user.username}</small>
        </div>
      </div>
    </div>
  );
}