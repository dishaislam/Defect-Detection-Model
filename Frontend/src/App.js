import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import UploadForm from './components/UploadForm';
import ResultCard from './components/ResultCard';
import LoadingSpinner from './components/LoadingSpinner';
import { predictDefect, getHeatmapUrl } from './services/api';
import { AlertCircle } from 'lucide-react';

import './App.css';

function App() {
  const [result, setResult] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = async (file, previewUrl) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictDefect(file);
      
      // Add full URL to heatmap
      const resultWithFullUrl = {
        ...response,
        heatmap_url: getHeatmapUrl(response.heatmap_url),
      };

      setResult(resultWithFullUrl);
      setOriginalImage(previewUrl);
    } catch (err) {
      setError(err.message);
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setOriginalImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
            <Activity className="w-8 h-8 text-primary-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Fabric Defect Detection
            </h1>
          </div>
          <p className="text-white text-lg font-medium">
            AI-Powered Quality Control System
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {!result && !isLoading && (
            <UploadForm onImageUpload={handleImageUpload} isLoading={isLoading} />
          )}

          {isLoading && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {result && !isLoading && (
            <>
              <ResultCard result={result} originalImage={originalImage} />
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Analyze Another Image
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-white">
          <p className="text-sm">
            Powered by YOLOv8 & React | Built for Quality Assurance
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
