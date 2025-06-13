export interface ClassificationResult {
  id: string;
  imageUrl: string;
  fileName: string;
  predictions: Array<{
    label: string;
    confidence: number;
  }>;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  timestamp: number;
  processingTime?: number;
  error?: string;
}

export interface AwsConfig {
  s3Bucket: string;
  region: string;
  sagemakerEndpoint: string;
  lambdaFunction: string;
}

export interface ModelMetrics {
  accuracy: number;
  driftScore: number;
  lastUpdated: number;
  version: string;
  status: 'healthy' | 'warning' | 'critical';
}