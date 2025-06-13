// Mock AWS service implementations for demonstration
import { v4 as uuidv4 } from 'uuid';
import type { ClassificationResult, ModelMetrics } from '../types';

// Mock image classification labels with confidence scores
const mockPredictions = [
  [
    { label: 'Golden Retriever', confidence: 0.94 },
    { label: 'Labrador', confidence: 0.84 },
    { label: 'German Shepherd', confidence: 0.12 }
  ],
  [
    { label: 'Sports Car', confidence: 0.91 },
    { label: 'Sedan', confidence: 0.76 },
    { label: 'SUV', confidence: 0.23 }
  ],
  [
    { label: 'Mountain Landscape', confidence: 0.88 },
    { label: 'Forest', confidence: 0.67 },
    { label: 'Lake', confidence: 0.45 }
  ],
  [
    { label: 'Modern Architecture', confidence: 0.92 },
    { label: 'Glass Building', confidence: 0.78 },
    { label: 'Office Complex', confidence: 0.34 }
  ]
];

export class MockS3Service {
  static async uploadImage(file: File): Promise<string> {
    // Simulate S3 upload with delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock S3 URL
    return `https://my-ml-bucket.s3.amazonaws.com/uploads/${uuidv4()}-${file.name}`;
  }
}

export class MockSageMakerService {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static async classify(_imageUrl: string): Promise<Array<{ label: string; confidence: number }>> {
    // Simulate SageMaker inference delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return random predictions from our mock set
    const randomIndex = Math.floor(Math.random() * mockPredictions.length);
    return mockPredictions[randomIndex];
  }
}

export class MockDynamoDBService {
  static async saveResult(result: ClassificationResult): Promise<void> {
    // Simulate DynamoDB write
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Result saved to DynamoDB:', result);
  }
  
  static async getResults(): Promise<ClassificationResult[]> {
    // Return mock historical results
    return JSON.parse(localStorage.getItem('classificationResults') || '[]');
  }
}

export class MockSNSService {
  static async sendNotification(result: ClassificationResult): Promise<void> {
    // Simulate SNS notification
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log('Notification sent via SNS for:', result.fileName);
  }
}

export class MockModelMonitorService {
  static async getModelMetrics(): Promise<ModelMetrics> {
    // Simulate drift monitoring data
    return {
      accuracy: 0.94,
      driftScore: 0.12,
      lastUpdated: Date.now() - 86400000, // 1 day ago
      version: 'v2.1.3',
      status: 'healthy'
    };
  }
}