import React from 'react';
import UploadForm from './UploadForm';
import { usePostManager } from '../hooks/usePostManager';
import { useEffect, useRef } from 'react';
import { ueArtworksManager } from '../hooks/useArtworksManager';


export default function Artworks() {
  return (
    <div>
      <UploadForm />
    </div>
  );
}