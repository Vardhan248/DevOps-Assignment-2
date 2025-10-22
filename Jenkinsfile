pipeline {
  agent any

  environment {
    // DockerHub credentials (replace ID with your Jenkins credential ID)
    DOCKERHUB_CRED = credentials('fe08e1ad-3815-4480-81d2-f82cd7d17542')

    // Image name on DockerHub
    IMAGE = "vardhan2244/devops-assignment"

    // Kubernetes config file credential
    KUBECONFIG_CRED = credentials('Kube-cred')
  }

  stages {
    stage('Checkout') {
      steps {
        echo "📥 Checking out code from GitHub..."
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        echo "🐳 Building Docker image..."
        bat "docker build -t %IMAGE%:%BUILD_NUMBER% ."
      }
    }

    stage('Docker Login & Push') {
      steps {
        echo "🔐 Logging in to DockerHub and pushing images..."
        bat '''
          echo %DOCKERHUB_CRED_PSW% | docker login -u %DOCKERHUB_CRED_USR% --password-stdin
          docker tag %IMAGE%:%BUILD_NUMBER% %IMAGE%:latest
          docker push %IMAGE%:%BUILD_NUMBER%
          docker push %IMAGE%:latest
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        echo "🚀 Deploying to Kubernetes..."
        withCredentials([file(credentialsId: 'Kube-cred', variable: 'KUBECONFIG_FILE')]) {
          bat '''
            set KUBECONFIG=%KUBECONFIG_FILE%
            kubectl set image deployment/devops-assignment devops-assignment=%IMAGE%:latest --record || echo "Deployment not found, creating new..."
            kubectl apply -f k8s/deployment.yaml --validate=false || echo "Applied deployment"
            kubectl apply -f k8s/service.yaml --validate=false || echo "Applied service"
            kubectl get pods -o wide
            kubectl get svc -o wide
          '''
        }
      }
    }
  }

  post {
    always {
      echo "🧹 Cleaning up workspace..."
      cleanWs()
    }
    success {
      echo "✅ Build, push, and deploy completed successfully!"
    }
    failure {
      echo "❌ Pipeline failed. Check logs for details."
    }
  }
}
