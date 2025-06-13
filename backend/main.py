from imagenet_labels import IMAGENET_LABELS

import boto3
import base64

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import boto3
import uuid

app = FastAPI()

# Enable frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set to ["http://localhost:5173"] for safety in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_image_to_s3(file: UploadFile = File(...)):
    s3 = boto3.client("s3", region_name="ap-south-1")
    bucket_name = "image-classifier-bucket-shivanshi"
    file_key = f"uploads/{uuid.uuid4()}-{file.filename}"
    file_bytes = await file.read()

    s3.put_object(
        Bucket=bucket_name,
        Key=file_key,
        Body=file_bytes,
        ContentType=file.content_type
    )

    print(f"✅ Uploaded to: s3://{bucket_name}/{file_key}")
    return {"file_key": file_key}
from fastapi import Request
from decimal import Decimal
import boto3
import json

dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
table = dynamodb.Table("ImageClassificationResults")

def convert_floats_to_decimal(obj):
    """Recursively convert float values to Decimal"""
    if isinstance(obj, list):
        return [convert_floats_to_decimal(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: convert_floats_to_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, float):
        return Decimal(str(obj))
    else:
        return obj

@app.post("/save-result")
async def save_result(request: Request):
    body = await request.json()

    # Convert floats to Decimal
    clean_data = convert_floats_to_decimal(body)

    table.put_item(Item=clean_data)
    print("✅ Saved to DynamoDB:", clean_data["id"])
    return {"message": "Saved to DynamoDB"}

from fastapi import Request
import boto3

from fastapi import Request
import boto3

@app.post("/notify")
async def send_notification(request: Request):
    body = await request.json()

    sns = boto3.client("sns", region_name="ap-south-1")
    topic_arn = "arn:aws:sns:ap-south-1:765488553566:ImageClassificationNotifications"

    # Safely extract prediction
    label = "No prediction available"
    confidence_str = "N/A"

    predictions = body.get("predictions")
    if isinstance(predictions, list) and len(predictions) > 0:
        prediction = predictions[0]
        label = prediction.get("label", label)
        confidence = prediction.get("confidence", 0)
        confidence_str = f"{confidence * 100:.2f}%"

    message = f"""
    ✅ Image Classification Completed

    File: {body.get('fileName', 'Unknown')}
    Prediction: {label}
    Confidence: {confidence_str}
    """

    sns.publish(
        TopicArn=topic_arn,
        Subject=f"Prediction for {body.get('fileName', 'Unknown')}",
        Message=message.strip()
    )

    print("✅ SNS Email sent")
    return {"message": "Notification sent"}




from fastapi import UploadFile, File
from imagenet_labels import IMAGENET_LABELS  # ✅ Make sure this is defined
import json
import boto3

def call_sagemaker_endpoint(image_bytes: bytes, endpoint_name: str):
    runtime = boto3.client("sagemaker-runtime", region_name="ap-south-1")
    response = runtime.invoke_endpoint(
        EndpointName=endpoint_name,
        ContentType="application/x-image",
        Body=image_bytes
    )
    result = response["Body"].read().decode()
    return result

@app.post("/classify")
async def classify_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    endpoint_name = "your-real-endpoint-name"  # ✅ update if needed

    result_raw = call_sagemaker_endpoint(image_bytes, endpoint_name)
    print("🔥 Raw SageMaker result:", result_raw)

    try:
        parsed = json.loads(result_raw)

        # ✅ This covers both `{"probabilities": [...]}` and `{"predictions": [...]}` formats
        scores = parsed.get("predictions") or parsed.get("probabilities")
        if isinstance(scores[0], list):
            scores = scores[0]

        indexed_scores = list(enumerate(scores))
        top_scores = sorted(indexed_scores, key=lambda x: x[1], reverse=True)[:3]

        predictions = [
            {
                "label": IMAGENET_LABELS[index] if index < len(IMAGENET_LABELS) else f"Class {index}",
                "confidence": round(float(score), 4)
            }
            for index, score in top_scores
        ]

        return {"predictions": predictions}

    except Exception as e:
        print("❌ Failed to parse prediction:", result_raw)
        raise e
