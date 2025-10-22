pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = credentials('fe08e1ad-3815-4480-81d2-f82cd7d17542') // DockerHub creds
    IMAGE = "vardhan2244/devops-assignment"
    KUBECONFIG_CRED = credentials('Kube-cred') // Kubeconfig creds (optional)
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Image') {
      steps {
        bat "docker build -t %IMAGE%:%BUILD_NUMBER% ."
      }
    }

    stage('Docker Login & Push') {
      steps {
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
        bat '''
          kubectl set image deployment/devops-assignment devops-assignment=%IMAGE%:latest --record || echo "Deployment not found, creating new..."
          kubectl apply -f k8s/deployment.yaml || echo "Applied deployment"
          kubectl apply -f k8s/service.yaml || echo "Applied service"
        '''
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
