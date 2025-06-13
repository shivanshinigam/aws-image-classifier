import React from 'react';
import { Loader2, CheckCircle, XCircle, Upload, Brain, Database, Bell } from 'lucide-react';
import type { ClassificationResult } from '../types';

interface ProcessingStatusProps {
  result: ClassificationResult | null;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ result }) => {
  if (!result) return null;

  const steps = [
    { 
      id: 'uploading', 
      label: 'Uploading to S3', 
      icon: Upload,
      description: 'Securing your image in cloud storage'
    },
    { 
      id: 'processing', 
      label: 'SageMaker Analysis', 
      icon: Brain,
      description: 'AI model analyzing your image'
    },
    { 
      id: 'saving', 
      label: 'Saving Results', 
      icon: Database,
      description: 'Storing predictions in DynamoDB'
    },
    { 
      id: 'notification', 
      label: 'Sending Notification', 
      icon: Bell,
      description: 'Notifying via SNS'
    }
  ];

  const getCurrentStepIndex = () => {
    switch (result.status) {
      case 'uploading': return 0;
      case 'processing': return 1;
      case 'completed': return 4;
      case 'error': return -1;
      default: return 0;
    }
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Processing: {result.fileName}
        </h3>
        {result.status === 'error' && (
          <div className="flex items-center text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <XCircle className="w-5 h-5 mr-2" />
            <span>{result.error || 'An error occurred'}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isCompleted = index < currentStep || result.status === 'completed';
          const isError = result.status === 'error' && index <= currentStep;

          return (
            <div key={step.id} className="flex items-center space-x-4">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isError 
                  ? 'bg-red-100 text-red-600'
                  : isCompleted 
                  ? 'bg-green-100 text-green-600' 
                  : isActive 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {isError ? (
                  <XCircle className="w-5 h-5" />
                ) : isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-grow">
                <p className={`font-medium ${
                  isError 
                    ? 'text-red-700'
                    : isCompleted 
                    ? 'text-green-700' 
                    : isActive 
                    ? 'text-blue-700' 
                    : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {result.status === 'completed' && result.processingTime && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Processing completed in {(result.processingTime / 1000).toFixed(2)} seconds
          </p>
        </div>
      )}
    </div>
  );
};