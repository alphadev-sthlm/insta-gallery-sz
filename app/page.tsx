'use client';

import { useState } from 'react';
import ImageGrid from './components/ImageGrid';
import ImageUpload from './components/ImageUpload';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Image Gallery</h1>
        <div className="max-w-md mx-auto mb-8">
          <ImageUpload onUploadSuccess={handleUploadSuccess} />
        </div>
        <ImageGrid refreshTrigger={refreshTrigger} />
      </div>
    </main>
  );
}
