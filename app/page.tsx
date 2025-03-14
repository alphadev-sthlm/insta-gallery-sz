'use client';

import { useState } from 'react';
import ImageGrid from './components/ImageGrid';
import ImageUpload from './components/ImageUpload';
import Modal from './components/Modal';
import Header from './components/Header';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsUploadModalOpen(false);
  };

  return (
    <>
      <Header onUploadClick={() => setIsUploadModalOpen(true)} />
      
      <main className="container mx-auto px-4 py-8 bg-secondary min-h-screen">
        <ImageGrid refreshTrigger={refreshTrigger} />

        <Modal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          title="Upload New Image"
        >
          <ImageUpload onUploadSuccess={handleUploadSuccess} />
        </Modal>
      </main>
    </>
  );
}
