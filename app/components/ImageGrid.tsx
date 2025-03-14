'use client';

import { useEffect, useState } from 'react';
import type { Image as ImageType } from '../types/image';
import Image from 'next/image';
import FullscreenImage from './FullscreenImage';
import Pagination from './Pagination';

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
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    has_more: false,
    items_per_page: 10
  });

  const fetchImages = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/images?page=${page}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data: ApiResponse = await response.json();
      setImages(data.images);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(pagination.current_page);
  }, [pagination.current_page, refreshTrigger]);

  const handlePageChange = (page: number) => {
    console.log(page);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPagination(prev => ({ ...prev, current_page: page }));
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 min-h-[400px]">
        {loading ? (
          // Loading skeletons
          Array.from({ length: pagination.items_per_page }).map((_, index) => (
            <div
              key={index}
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
        ) : (
          images.map((image, index) => (
            <div
              key={image.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.gallery_url}
                  alt={image.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={85}
                  priority={index < 6}
                  loading={index < 6 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </div>
              <div className="p-4">
                <p className="text-gray-800 font-medium truncate">{image.description}</p>
                <p className="text-sm text-gray-500">By {image.uploaded_by}</p>
                <p className="text-xs text-gray-400">
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {!loading && !error && images.length > 0 && (
        <Pagination
          current_page={pagination.current_page}
          total_pages={pagination.total_pages}
          total_items={pagination.total_items}
          has_more={pagination.has_more}
          items_per_page={pagination.items_per_page}
          onPageChange={handlePageChange}
        />
      )}

      <FullscreenImage
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
} 