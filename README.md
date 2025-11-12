# 🚀 AWS DevOps CI/CD Pipeline with Jenkins, Docker, and EC2

This project demonstrates a **complete CI/CD pipeline** for a containerized Node.js application using **Jenkins, Docker, AWS EC2, ECR, IAM, and GitHub Webhooks**.

It automates the entire workflow — from code commit to live deployment — showing end-to-end DevOps proficiency for cloud-based delivery.

---

## 🧩 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Phases](#project-phases)
5. [Pipeline Workflow](#pipeline-workflow)
6. [IAM Role Configuration](#iam-role-configuration)
7. [Next Improvements](#next-improvements)

---

## 🧠 Overview

The goal of this project is to implement a **fully automated CI/CD pipeline** that:

* Builds and tests source code from GitHub.
* Packages the app into a Docker image.
* Pushes the image to **Amazon ECR** (Elastic Container Registry).
* Deploys the container to an **AWS EC2 App Server**.
* Uses **IAM roles** for secure access — no static AWS credentials.
* Integrates **GitHub Webhooks** for automatic build triggers on each push.

---

## 🏗️ Architecture

```
Developer → GitHub → Jenkins (CI Server) → Docker → AWS ECR → EC2 (App Server)
```

**Components:**

* **Jenkins EC2 Instance:** Builds the Docker image, pushes to ECR, triggers deployment.
* **App EC2 Instance:** Pulls latest image from ECR and runs the container.
* **AWS ECR:** Private registry to store Docker images.
* **IAM Roles:** Secure communication between services without static credentials.
* **GitHub Webhook:** Automatically triggers Jenkins pipeline on every push.

---

## ⚙️ Tech Stack

| Category               | Tool / Service   | Purpose                                 |
| ---------------------- | ---------------- | --------------------------------------- |
| **Version Control**    | Git + GitHub     | Source code + webhook trigger           |
| **CI/CD Orchestrator** | Jenkins          | Automates build, push, and deploy       |
| **Containerization**   | Docker           | Build and package Node.js app           |
| **Registry**           | AWS ECR          | Stores and versions container images    |
| **Compute**            | AWS EC2          | Hosts Jenkins and App servers           |
| **IAM**                | Roles & Policies | Secure, keyless access between services |
| **OS / Shell**         | Ubuntu + Bash    | Linux automation scripting              |
| **Language**           | Node.js          | Sample app for containerization         |

---

## 🪜 Project Phases

### **Phase 1: Source Code & Dockerization**

* Created a simple Node.js application with a Dockerfile.
* Used a **multi-stage Docker build** for lightweight image optimization.
* Validated image locally using Docker run.

### **Phase 2: Jenkins Setup**

* Launched a dedicated **EC2 instance** for Jenkins.
* Installed Jenkins, Docker, AWS CLI.
* Configured Jenkins user with Docker group permissions.

### **Phase 3: GitHub Integration**

* Connected Jenkins to GitHub via repository URL.
* Configured **GitHub Webhook** to trigger builds automatically on commits.

### **Phase 4: AWS ECR Integration**

* Created an ECR repository (`oggy-repo`).
* Attached `JenkinsRole` with ECR push permissions.
* Implemented AWS CLI authentication in Jenkinsfile:

  ```bash
  aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin <ECR_URL>
  ```

### **Phase 5: Deployment Automation**

* Created **App EC2 instance** with Docker installed.
* Configured passwordless SSH from Jenkins → App server.
* Jenkins pipeline deploys by SSH-ing into App EC2, pulling the new image, and running the container.

### **Phase 6: IAM Roles & Security**

* **JenkinsRole:** Pushes to ECR.
* **AppServerRole:** Pulls from ECR.
* Both roles trust `ec2.amazonaws.com` for assumption.
* Fully secure: no static credentials.

### **Phase 7: Final Validation**

* Verified complete flow:

  * Commit → GitHub webhook → Jenkins build → Docker push → EC2 deploy.
* Confirmed working app on `<EC2-Public-IP>:33333`.

---

## 🔁 Pipeline Workflow (Jenkinsfile Summary)

| Stage                  | Description                                  |
| ---------------------- | -------------------------------------------- |
| **Checkout SCM**       | Fetch code from GitHub                       |
| **Build Docker Image** | Build container                              |
| **Tag Image**          | Tag with build number                        |
| **Login to AWS ECR**   | Authenticate Jenkins to ECR                  |
| **Push Image**         | Push image to AWS ECR                        |
| **Deploy to EC2**      | SSH to App server, pull image, run container |

---

## 🔐 IAM Role Configuration (Simplified JSON)

**JenkinsRole – Permission Policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage",
        "ecr:DescribeRepositories",
        "ecr:ListImages"
      ],
      "Resource": "*"
    }
  ]
}
```

**AppServerRole – Permission Policy**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchGetImage",
        "ecr:GetDownloadUrlForLayer"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## 🌱 Next Improvements

| Feature                    | Description                                                     |
| -------------------------- | --------------------------------------------------------------- |
| **Health Check Stage**     | Verify app health after deploy (e.g. `curl -f localhost:33333`) |
| **Rollback Logic**         | Redeploy previous image on failure                              |
| **Elastic IP for Jenkins** | Maintain webhook stability                                      |
| **Nginx / ALB Setup**      | Add HTTPS and routing                                           |
| **Terraform Integration**  | Infrastructure as code for reproducibility                      |
| **Monitoring**             | Add CloudWatch or Prometheus for container health               |

