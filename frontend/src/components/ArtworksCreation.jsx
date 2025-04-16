import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useArtworksManager } from '../hooks/useArtworksManager'; 
import { useRef } from 'react';
import Artworks from './Artworks';
import UploadForm from './UploadForm';

export default function ArtworksCreation() {
    const categories = ['computer_graphics','graphic_designs','model_3d','painting','photography','music'];
    const { artworks, fetchArtworks, isLoading } = useArtworksManager();
    const [category, setCategory] = useState('');
    const observer = useRef();
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    useEffect(() => {
        observer.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.dataset.visible = 'true';
                    }
                });
            },
            { threshold: 0.1 }
        );
    }
    , [artworks]);
    if (isLoading && artworks.length === 0) return <div>Loading...</div>;

    const DisplayUploadForm = () => {
        setIsUploadOpen(!isUploadOpen);
      };
    return (
        <div>
            <div className='container'>
                <div className='row mb-4'>
                    {categories.map((category) => (
                        <button
                            id={category}
                            key={category}
                            className='btn btn-primary btn-sm col-md-2'
                            style={{ borderRadius: '8px' }}
                            onClick={() => {
                                console.log('Clicked on', category);
                                setCategory(category);
                                fetchArtworks(category);
                            }}
                        >
                            {category.replace('_', ' ').charAt(0).toUpperCase() + category.slice(1).replace('_', ' ').toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>
            <div className='container'>
                <div id='artworks' className='artworks-container row'>
                    <button onClick={DisplayUploadForm} className='mb-5' id="upload-btn">Upload</button>
                    {isUploadOpen && <UploadForm onClose={() => setIsUploadOpen(false)} />}
                    {artworks.map(artwork => (
                        <div key={artwork.id} className="artwork-item col-md-4" data-visible="false">
                            <Artworks post={artwork} />
                        </div>
                    ))}
                </div>
            </div>
            
        </div>
    );}