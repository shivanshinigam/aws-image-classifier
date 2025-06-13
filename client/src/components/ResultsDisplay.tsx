import React from 'react';
import { Trophy, Zap, Clock } from 'lucide-react';
import type { ClassificationResult } from '../types';
import { IMAGENET_LABELS } from '../constants/imagenet_labels';


interface ResultsDisplayProps {
  results: ClassificationResult[];
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const completedResults = results.filter(r => r.status === 'completed');

  if (completedResults.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500">No classifications yet. Upload an image to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">
        <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
        Classification Results
      </h2>
      
      <div className="grid gap-6">
        {completedResults.map((result) => (
          <div key={result.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{result.fileName}</h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>
                {result.processingTime && (
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <Zap className="w-4 h-4 mr-1" />
                    {(result.processingTime / 1000).toFixed(2)}s
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Predictions:</h4>
                {result.predictions.map((prediction, index) => {
  const labelIndex = Number(prediction.label);
  const readableLabel =
    !isNaN(labelIndex) && IMAGENET_LABELS[labelIndex]
      ? IMAGENET_LABELS[labelIndex]
      : prediction.label;

  return (
    <div key={index} className="flex items-center justify-between">
      <span className="text-gray-700">{readableLabel}</span>
      <div className="flex items-center space-x-3">
        <div className="progress-bar w-32 h-4 bg-gray-200 rounded overflow-hidden">
          <div 
            className="progress-fill bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded"
            style={{ width: `${prediction.confidence * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600 w-12 text-right">
          {(prediction.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
