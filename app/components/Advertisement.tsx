'use client';

export default function Advertisement() {
  return (
    <div className="bg-primary rounded-lg shadow-md overflow-hidden h-full">
      <div className="relative h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-primary">Advertisement</div>
          <p className="text-secondary text-sm">
            Your ad could be here! Contact us for advertising opportunities.
          </p>
          <button 
            onClick={() => window.open('mailto:ads@example.com', '_blank')}
            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Advertise Here
          </button>
        </div>
      </div>
    </div>
  );
} 