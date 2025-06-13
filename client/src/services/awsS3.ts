// client/src/services/awsS3.ts
export async function uploadToS3(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("http://localhost:8000/upload", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("S3 upload failed");
  }

  const { file_key } = await res.json();

  return `https://image-classifier-bucket-shivanshi.s3.ap-south-1.amazonaws.com/${file_key}`;
}
