# 🧠 AWS Image Classifier — Full-Stack AI on the Cloud ☁️

**New Skill Unlocked: Full-Stack AI on AWS 🚀**

Built from scratch — a fully working, real-time image classification platform using **React + FastAPI + AWS (S3, SageMaker, DynamoDB, SNS)**.

> Upload an image → Get predictions → See results → Receive an email. Zero servers, 100% cloud.

---

## 🌐 Live Demo Flow

1.  Upload an image (JPEG/PNG)
2.  Inference via SageMaker (pretrained model)
3.  SageMaker gives you top-3 predictions (currently raw class labels like 281, 285)
4.  Image stored in S3
5.  Result saved to DynamoDB
6.  Email sent via SNS with prediction

---

## 🧩 Tech Stack

| Layer      | Tech Used                         |
|------------|-----------------------------------|
| Frontend   | `React`, `TypeScript`, `Tailwind` |
| Backend    | `FastAPI`, `Python`               |
| Cloud      | `AWS S3`, `SageMaker`, `SNS`, `DynamoDB` |
| Dev Tools  | `GitHub`, `VS Code`, `Postman`, `Uvicorn` |

---

## Features
 Real-time image upload to S3
 SageMaker model prediction
 Email notifications via SNS
 History tracking with DynamoDB
 UI feedback, loading states, and clean progress bar animations

 ## Screenshots
<img width="1675" alt="HomeScreen" src="https://github.com/user-attachments/assets/76bead2d-ff24-42b4-8bb2-f16719c48293" />
<img width="1680" alt="Architecture" src="https://github.com/user-attachments/assets/09d732a0-b187-4d6b-9117-be580499ecf3" />
<img width="1680" alt="Image" src="https://github.com/user-attachments/assets/12fa6e51-e628-477a-a7c2-778f09c4611c" />
<img width="1680" alt="predictions" src="https://github.com/user-attachments/assets/02423ef9-4cd1-44d0-8d94-1cf61b63cce0" />
<h3>✉️ Sample Email Notification</h3>
![IMG_B785CC642085-1](https://github.com/user-attachments/assets/914f0810-d9df-4359-8ac2-f4ef88a66b82)



