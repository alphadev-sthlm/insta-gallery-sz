import ImageGrid from './components/ImageGrid';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Image Gallery</h1>
        <ImageGrid />
      </div>
    </main>
  );
}
