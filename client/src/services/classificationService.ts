import type { ClassificationResult } from '../types';
import { 
  MockDynamoDBService} from './mockAws';
import { uploadToS3 } from './awsS3'; // ✅ real S3 upload handler

export class ClassificationService {
  static async processImage(
    file: File,
    onStatusUpdate: (result: ClassificationResult) => void
  ): Promise<ClassificationResult> {
    const result: ClassificationResult = {
      id: crypto.randomUUID(),
      imageUrl: '',
      fileName: file.name,
      predictions: [],
      status: 'uploading',
      timestamp: Date.now()
    };

    try {
      // Step 1: Uploading
      onStatusUpdate(result);

      // ✅ Step 2: Upload to real S3 via FastAPI
      result.imageUrl = await uploadToS3(file);

      // Step 3: Processing
      result.status = 'processing';
      onStatusUpdate(result);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const startTime = Date.now();




      // 🧪 Step 4: Use mock inference 
      // 🧠 Step 4: Call real SageMaker inference
const classifyFormData = new FormData();
classifyFormData.append("file", file);

const classifyRes = await fetch("http://localhost:8000/classify", {
  method: "POST",
  body: classifyFormData,
});

if (!classifyRes.ok) {
  throw new Error("SageMaker classification failed");
}

const classifyJson = await classifyRes.json();
result.predictions = classifyJson.predictions;



      // Step 5: Save result 
      result.status = 'completed';
      await fetch("http://localhost:8000/save-result", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });


      await fetch("http://localhost:8000/notify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(result),
        });


      onStatusUpdate(result);
      return result;

    } catch (error) {
      result.status = 'error';
      result.error = error instanceof Error ? error.message : 'Unknown error';
      onStatusUpdate(result);
      throw error;
    }
  }

  static async getHistory(): Promise<ClassificationResult[]> {
    return MockDynamoDBService.getResults();
  }
}
