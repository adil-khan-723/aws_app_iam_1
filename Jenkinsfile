pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = '736786104206.dkr.ecr.ap-south-1.amazonaws.com/oggy-repo'
        IMAGE_TAG = "build-${BUILD_NUMBER}"
        APP_NAME = 'oggyapp'
        APP_SERVER = 'ubuntu@13.232.164.183'
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'main', url: 'https://github.com/adil-khan-723/aws_app_iam_1.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker Image...'
                sh "docker build -t ${APP_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Tag Image for AWS ECR') {
            steps {
                echo 'Tagging Docker Image for AWS ECR...'
                sh "docker image tag ${APP_NAME}:${IMAGE_TAG} ${ECR_REPO}:${IMAGE_TAG}"
                echo "Tagged Image: ${ECR_REPO}:${IMAGE_TAG}"
            }
        }
        stage('Login to AWS ECR') {
            steps {
                echo 'Logging in to AWS ECR...'
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin ${ECR_REPO} \
                """
                echo 'Logged in to AWS ECR'
            }
        }
        stage('Push Image to AWS ECR') {
            steps {
                echo 'Pushing Docker Image to AWS ECR...'
                sh "docker push ${ECR_REPO}:${IMAGE_TAG}"
                echo "Pushed Image: ${ECR_REPO}:${IMAGE_TAG}"
            }
        }
        stage('Deploy to App EC2 server') {
            steps {
                sshagent(credentials: ['ssh']) {
                    echo 'Deploying Application to EC2 Server...'
                    sh '''
                        ssh -o StrictHostKeyChecking=no $APP_SERVER "
                            aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO && \
                            docker system prune -af && \
                            docker pull $ECR_REPO:$IMAGE_TAG && \
                            docker stop $APP_NAME || true && \
                            docker rm $APP_NAME || true && \
                            docker run -d -p 33333:33333 --name $APP_NAME $ECR_REPO:$IMAGE_TAG
                        "
                    '''
                    echo 'Deployment to EC2 Server Completed.'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!...'
        }
        failure {
            echo 'Pipeline failed. Please check the logs...'
        }
    }
}
