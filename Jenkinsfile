pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = credentials('fe08e1ad-3815-4480-81d2-f82cd7d17542') // set this in Jenkins
    IMAGE = "vardhan2244/devops-assignment"
    KUBECONFIG_CRED = credentials('Kube-cred') // optional if storing kubeconfig
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        sh "docker build -t ${IMAGE}:$BUILD_NUMBER ."
      }
    }

    stage('Docker Login & Push') {
      steps {
        sh "echo $DOCKERHUB_CRED_PSW | docker login -u $DOCKERHUB_CRED_USR --password-stdin"
        sh "docker tag ${IMAGE}:$BUILD_NUMBER ${IMAGE}:latest"
        sh "docker push ${IMAGE}:$BUILD_NUMBER"
        sh "docker push ${IMAGE}:latest"
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        // Option A: If kubectl is configured on Jenkins agent
        sh "kubectl set image deployment/ticket-app ticket-app=${IMAGE}:latest --record || true"
        // fallback apply if not created
        sh "kubectl apply -f k8s/deployment.yaml || true"
        sh "kubectl apply -f k8s/service.yaml || true"
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
