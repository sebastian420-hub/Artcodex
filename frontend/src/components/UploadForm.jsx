import React from "react";
import { usePostManager } from '../hooks/usePostManager';

export default function UploadForm() {
  const { uploadPost } = usePostManager();

  const handleUpload = (e) => {
    e.preventDefault();
    const form = e.target;
    const text = form.querySelector('#uploadTextArea').value;
    const category = form.querySelector('#category')?.value || '';
    const link = form.querySelector('#link')?.value || '';
    const image = form.querySelector('#image')?.files[0];
    const model_3d = form.querySelector('#model_3d')?.files[0];
    const model_3d_bin = form.querySelector('#model_3d_bin')?.files[0];
    const model_3d_png = form.querySelector('#model_3d_png')?.files[0];

    if (image && model_3d) {
      document.getElementById('error').style.display = 'block';
      return;
    }
    document.getElementById('error').style.display = 'none'; // Reset error
    uploadPost(text, category, link, image, model_3d, model_3d_bin, model_3d_png);
  };

  const loadImageUpload = () => {
    document.getElementById('modelUpload').classList.add('d-none');
    document.getElementById('imageUpload').classList.remove('d-none');
  };

  const load3DUpload = () => {
    document.getElementById('imageUpload').classList.add('d-none');
    document.getElementById('modelUpload').classList.remove('d-none');
  }



  return (
    <form onSubmit={handleUpload} style={{ display: 'block' }} id="form-text">
      <textarea
        id="uploadTextArea"
        className="form-control mb-2"
        placeholder="Describe your artwork..."
        style={{ borderRadius: '4px' }}
      />
      <select id="category" className="form-control mb-2">
        <option value="">Select Category</option>
        {[
          'computer_graphics',
          'graphic_designs',
          'model_3d',
          'painting',
          'photography',
          'music',
        ].map(cat => (
          <option key={cat} value={cat}>
            {cat.replace('_', ' ').charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ').toLowerCase()}
          </option>
        ))}
      </select>
      <div className="container-fluid">
        <div className="row mt-3 mb-2">
          <div className="col-md-1">
            <button type="button" onClick={loadImageUpload} className="btn btn-primary mb-2 btn-sm" style={{ borderRadius: '4px' }}>Image</button>
          </div>
          <div className="col-md-1">
            <button type="button" onClick={load3DUpload} className="btn btn-primary mb-2 btn-sm" style={{ borderRadius: '4px' }}>3D Model</button>
          </div>
        </div>
      </div>
      <div className="mb-1" id="imageUpload">
        <label htmlFor="image">Upload Image (optional):</label>
        <input type="file" id="image" name="image" className="form-control mb-2" accept="image/*" />
      </div>
      <div className="d-none" id="modelUpload">
        <label htmlFor="model_3d">Upload 3D Model (optional: .gltf or .glb + .bin and .png (for texture)):</label> 
        <input type="file" id="model_3d" name="model_3d" className="form-control mb-2" accept=".glb,.gltf,.bin,.png" />
        <label htmlFor="model_3d_bin">Bin File:</label>
        <input type="file" id="model_3d_bin" name="model_3d_bin" className="form-control mb-2" accept=".glb,.gltf,.bin,.png" />
        <label htmlFor="model_3d_png">PNG File (TEXTURE) [Select all textures]:</label>
        <input type="file" id="model_3d_png" name="model_3d_png" className="form-control mb-2" accept=".glb,.gltf,.bin,.png" multiple/>
      </div>
      <button type="submit" className="btn btn-primary mb-3" style={{ borderRadius: '4px' }}>
        Upload
      </button>
      <p
        id="error"
        className="text-danger"
        style={{ color: 'red', display: 'none' }}
      >
        Please upload either an image or a 3D model, not both.
      </p>
    </form>
  );
}