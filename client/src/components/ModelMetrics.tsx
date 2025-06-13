import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import type { ModelMetrics as ModelMetricsType } from '../types';
import { MockModelMonitorService } from '../services/mockAws';

export const ModelMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<ModelMetricsType | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      const data = await MockModelMonitorService.getModelMetrics();
      setMetrics(data);
    };
    loadMetrics();
  }, []);

  if (!metrics) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return Shield;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Activity;
    }
  };

  const getDriftProgressClass = (driftScore: number) => {
    if (driftScore < 0.2) return 'progress-fill-green';
    if (driftScore < 0.5) return 'progress-fill-yellow';
    return 'progress-fill-red';
  };

  const StatusIcon = getStatusIcon(metrics.status);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Activity className="w-6 h-6 mr-2 text-blue-500" />
          Model Performance
        </h2>
        <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(metrics.status)}`}>
          <StatusIcon className="w-4 h-4 mr-1" />
          {metrics.status.charAt(0).toUpperCase() + metrics.status.slice(1)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {(metrics.accuracy * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Model Accuracy</div>
          <div className="progress-bar mt-2">
            <div 
              className="progress-fill progress-fill-blue"
              style={{ '--progress-width': `${metrics.accuracy * 100}%` } as React.CSSProperties & { '--progress-width': string }}
            />
          </div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {(metrics.driftScore * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Drift Score</div>
          <div className="progress-bar mt-2">
            <div 
              className={`progress-fill ${getDriftProgressClass(metrics.driftScore)}`}
              style={{ '--progress-width': `${Math.min(metrics.driftScore * 100, 100)}%` } as React.CSSProperties & { '--progress-width': string }}
            />
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold text-gray-700 mb-2">
            {metrics.version}
          </div>
          <div className="text-sm text-gray-600">Model Version</div>
          <div className="text-xs text-gray-500 mt-2 flex items-center justify-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Updated {Math.floor((Date.now() - metrics.lastUpdated) / 86400000)}d ago
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>SageMaker Model Monitor:</strong> Continuously monitors data drift and model performance
          </p>
          <p>
            <strong>Next Evaluation:</strong> Scheduled for tomorrow at 2:00 AM UTC
          </p>
        </div>
      </div>
    </div>
  );
};