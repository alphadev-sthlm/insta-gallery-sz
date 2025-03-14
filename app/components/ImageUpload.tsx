'use client';

import { useState } from 'react';

interface UploadResponse {
  id: string;
  originalUrl: string;
  galleryUrl: string;
  thumbnailUrl: string;
  description: string;
}

interface ImageUploadProps {
  onUploadSuccess: () => void;
}

export default function ImageUpload({ onUploadSuccess }: ImageUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);

      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append(
      'metadata',
      JSON.stringify({
        description,
        uploadedBy,
      })
    );

    try {
      const response = await fetch(
        'https://wkuhfuofhpjuwilhhtnj.supabase.co/functions/v1/upload-image',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data: UploadResponse = await response.json();
      console.log('Upload successful:', data);
      
      // Reset form
      setFile(null);
      setDescription('');
      setUploadedBy('');
      setPreview(null);
      onUploadSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Image
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {file && (
            <span className="text-sm text-gray-500">
              {file.name}
            </span>
          )}
        </div>
        {preview && (
          <div className="mt-2 relative aspect-square w-32">
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter image description"
          required
        />
      </div>

      <div>
        <label htmlFor="uploadedBy" className="block text-sm font-medium text-gray-700">
          Uploaded By
        </label>
        <input
          type="text"
          id="uploadedBy"
          value={uploadedBy}
          onChange={(e) => setUploadedBy(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="Enter your name"
          required
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isUploading || !file || !description || !uploadedBy}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${isUploading || !file || !description || !uploadedBy
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </form>
  );
} 