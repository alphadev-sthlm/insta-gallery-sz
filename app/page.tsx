'use client';

import { useState } from 'react';
import ImageGrid from './components/ImageGrid';
import ImageUpload from './components/ImageUpload';
import Modal from './components/Modal';
import ThemeToggle from './components/ThemeToggle';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsUploadModalOpen(false);
  };

  return (
    <main className="container mx-auto px-4 py-8 bg-secondary min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Image Gallery</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 accent-primary rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary"
          >
            Upload Image
          </button>
        </div>
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
