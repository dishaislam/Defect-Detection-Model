import React from 'react';
import { Image as ImageIcon, Scan } from 'lucide-react';

const ImageComparison = ({ originalImage, heatmapUrl }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Original Image */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
          <div className="flex items-center gap-2 text-white">
            <ImageIcon className="w-5 h-5" />
            <h3 className="font-semibold">Original Image</h3>
          </div>
        </div>
        <div className="p-4">
          <img
            src={originalImage}
            alt="Original"
            className="w-full h-auto rounded-lg border-2 border-gray-200"
          />
        </div>
      </div>

      {/* Heatmap Image */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-3">
          <div className="flex items-center gap-2 text-white">
            <Scan className="w-5 h-5" />
            <h3 className="font-semibold">Defect Analysis</h3>
          </div>
        </div>
        <div className="p-4">
          {heatmapUrl ? (
            <img
              src={heatmapUrl}
              alt="Heatmap"
              className="w-full h-auto rounded-lg border-2 border-gray-200"
            />
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
              <p className="text-gray-500">No heatmap available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;