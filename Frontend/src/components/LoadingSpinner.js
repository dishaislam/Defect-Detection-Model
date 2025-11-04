import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
      <p className="mt-4 text-gray-600 font-medium">Analyzing image...</p>
      <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
    </div>
  );
};

export default LoadingSpinner;