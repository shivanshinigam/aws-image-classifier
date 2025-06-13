import { useState, useCallback, useEffect } from 'react';

import { Brain, Github, ExternalLink } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { ProcessingStatus } from './components/ProcessingStatus';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ModelMetrics } from './components/ModelMetrics';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { ClassificationService } from './services/classificationService';
import type { ClassificationResult } from './types';


function App() {
  const [currentResult, setCurrentResult] = useState<ClassificationResult | null>(null);
  const [results, setResults] = useState<ClassificationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'classify' | 'results' | 'metrics' | 'architecture'>('classify');

  const handleFileSelect = useCallback(async (file: File) => {
    setIsProcessing(true);
    setCurrentResult(null);

    try {
      await ClassificationService.processImage(file, (updatedResult) => {
        setCurrentResult(updatedResult);

        if (updatedResult.status === 'completed') {
          setResults(prev => {
            const newResults = [updatedResult, ...prev];
            localStorage.setItem('classificationResults', JSON.stringify(newResults));
            return newResults;
          });
        }
      });
    } catch (error) {
      console.error('Classification failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('classificationResults');
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  const tabs = [
    { id: 'classify', label: 'Classify Images', count: null },
    { id: 'results', label: 'Results', count: results.filter(r => r.status === 'completed').length },
    { id: 'metrics', label: 'Model Metrics', count: null },
    { id: 'architecture', label: 'Architecture', count: null }
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="text-red-500 font-bold text-2xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  AWS Image Classification Platform
                </h1>
                <p className="text-sm text-gray-500">
                  Production-ready ML inference with SageMaker
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                View Code
              </a>
              <a
                href="https://docs.aws.amazon.com/sagemaker/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                AWS Docs
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 px-1 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'classify' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI-Powered Image Classification
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Upload any image to get instant AI-powered classification results using our 
                production-grade SageMaker model with real-time monitoring and drift detection.
              </p>
            </div>

            <ImageUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            
            {currentResult && (
              <ProcessingStatus result={currentResult} />
            )}

            {currentResult?.status === 'completed' && (
              <div className="max-w-2xl mx-auto">
                <ResultsDisplay results={[currentResult]} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="max-w-4xl mx-auto">
            <ResultsDisplay results={results} />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="max-w-4xl mx-auto">
            <ModelMetrics />
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="max-w-6xl mx-auto">
            <ArchitectureDiagram />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-sm">
              Demonstrates production-ready AWS ML architecture with SageMaker, S3, Lambda, and DynamoDB
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
