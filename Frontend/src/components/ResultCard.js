import React from 'react';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import ConfidenceChart from './ConfidenceChart';
import ImageComparison from './ImageComparison';

const ResultCard = ({ result, originalImage }) => {
  const isDefective = result.prediction === 'Defective';

  return (
    <div className="space-y-6">
      {/* Prediction Status Card */}
      <div
        className={`rounded-2xl shadow-xl overflow-hidden ${
          isDefective
            ? 'bg-gradient-to-br from-red-50 to-red-100'
            : 'bg-gradient-to-br from-green-50 to-green-100'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {isDefective ? (
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  Detection Result
                </h3>
                <p
                  className={`text-3xl font-bold ${
                    isDefective ? 'text-red-700' : 'text-green-700'
                  }`}
                >
                  {result.prediction}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-gray-700">
                {(result.confidence * 100).toFixed(1)}% Confidence
              </span>
            </div>
          </div>

          {/* Confidence Chart */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Confidence Score
            </h4>
            <ConfidenceChart
              confidence={result.confidence}
              prediction={result.prediction}
            />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isDefective
                  ? 'Defects detected in the fabric. Review the heatmap for details.'
                  : 'No significant defects detected. Fabric appears to be in good condition.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Comparison */}
      <ImageComparison
        originalImage={originalImage}
        heatmapUrl={result.heatmap_url}
      />
    </div>
  );
};

export default ResultCard;