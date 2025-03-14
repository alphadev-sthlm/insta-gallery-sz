'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Image as ImageType } from '../types/image';

interface FullscreenImageProps {
  image: ImageType | null;
  onClose: () => void;
}

export default function FullscreenImage({ image, onClose }: FullscreenImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 p-2"
        aria-label="Close fullscreen view"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Image container */}
      <div 
        className="flex-1 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        )}
        <Image
          src={image.gallery_url}
          alt={image.description}
          fill
          className="object-contain"
          onLoadingComplete={() => setIsLoading(false)}
          priority
        />
      </div>

      {/* Image info */}
      <div 
        className="bg-black bg-opacity-75 text-white p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold mb-2">{image.description}</h2>
        <p className="text-gray-300">Uploaded by {image.uploaded_by}</p>
        <p className="text-gray-400 text-sm">
          {new Date(image.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
} 