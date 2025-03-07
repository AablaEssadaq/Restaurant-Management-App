import React from 'react';
import { Loader2 } from 'lucide-react';

const GlobalLoader = () => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-beige" 
      style={{ 
        margin: 0, 
        padding: 0, 
        border: 'none', 
        boxSizing: 'border-box' 
      }}
    >
      <div className="flex flex-col items-center">
        <Loader2 
          className="animate-spin text-burgundy" 
          size={64} 
        />
        <p className="mt-4 text-gray-600 text-lg">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;