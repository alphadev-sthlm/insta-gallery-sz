'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { Image as ImageType } from '../types/image';
import Image from 'next/image';
import FullscreenImage from './FullscreenImage';

interface PaginationData {
  current_page: number;
  total_pages: number;
  total_items: number;
  has_more: boolean;
  items_per_page: number;
}

interface ApiResponse {
  images: ImageType[];
  pagination: PaginationData;
}

interface ImageGridProps {
  refreshTrigger?: number;
}

export default function ImageGrid({ refreshTrigger = 0 }: ImageGridProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  const lastImageRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || !hasMore) return;
    
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
        setCurrentPage(prev => prev + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore]);

  const fetchImages = async (page: number, isInitialLoad: boolean = false) => {
    try {
      loadingRef.current = true;
      setLoading(true);
      const response = await fetch(`/api/images?page=${page}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data: ApiResponse = await response.json();
      
      setImages(prev => isInitialLoad ? data.images : [...prev, ...data.images]);
      setHasMore(data.pagination.has_more);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    setImages([]);
    setLoadedImages(new Set());
    setCurrentPage(1);
    setHasMore(true);
    fetchImages(1, true);
  }, [refreshTrigger]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchImages(currentPage, false);
    }
  }, [currentPage]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-700" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 min-h-[400px]">
        {images.map((image, index) => (
          <div
            key={image.id}
            ref={index === images.length - 1 ? lastImageRef : null}
            className="bg-primary rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            onClick={() => setSelectedImage(image)}
          >
            <div className="relative aspect-square">
              <Image
                src={image.gallery_url}
                alt={image.description}
                fill
                className={`object-cover transition-all duration-500 ${
                  loadedImages.has(image.id)
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105'
                }`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={85}
                priority={index < 6}
                loading={index < 6 ? 'eager' : 'lazy'}
                onLoad={() => handleImageLoad(image.id)}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
            <div className="p-4">
              <p className="text-primary font-medium truncate">
                {image.description}
              </p>
              <p className="text-sm text-secondary">
                By {image.uploaded_by}
              </p>
              <p className="text-xs text-secondary">
                {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        
        {loading && (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="relative aspect-square bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))
        )}
      </div>

      <FullscreenImage
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
} 