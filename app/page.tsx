'use client';

import { useState } from 'react';
import ImageGrid from './components/ImageGrid';
import ImageUpload from './components/ImageUpload';
import Modal from './components/Modal';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsUploadModalOpen(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Upload Image
        </button>
      </div>

      <ImageGrid refreshTrigger={refreshTrigger} />

      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Upload New Image"
      >
        <ImageUpload onUploadSuccess={handleUploadSuccess} />
      </Modal>
    </main>
  );
}
