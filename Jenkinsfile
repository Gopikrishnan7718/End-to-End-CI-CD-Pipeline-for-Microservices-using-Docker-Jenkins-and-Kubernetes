pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u root'
        }
    }

    environment {
        DOCKER_HUB_CREDS = 'docker-hub-creds'
        SONARQUBE_SERVER = 'sonarqube-server'
    }

    stages {

        //  1. Checkout (Webhook triggers this)
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        //  2. Install Dependencies
        stage('Install Dependencies') {
            steps {
                sh '''
                cd client && npm install
                cd ../server && npm install
                cd ../worker && npm install
                '''
            }
        }

        //  3. Unit Tests (ALL services)
        stage('Unit Test') {
            steps {
                sh '''
                cd client && npm test -- --watchAll=false
                cd ../server && npm test
                cd ../worker && npm test
                '''
            }
        }

        //  4. SonarQube Scan
        stage('SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh 'cd client && npx sonar-scanner'
                }
            }
        }

        //  5. Build Client (React)
        stage('Build Client') {
            steps {
                sh 'cd client && npm run build'
            }
        }

        //  6. Docker Build with Tagging
        stage('Docker Build') {
            steps {
                script {
                    env.COMMIT = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                }

                sh '''
                docker build -t gopi/client:$COMMIT ./client
                docker build -t gopi/server:$COMMIT ./server
                docker build -t gopi/worker:$COMMIT ./worker
                docker build -t gopi/nginx:$COMMIT ./nginx

                docker tag gopi/client:$COMMIT gopi/client:latest
                docker tag gopi/server:$COMMIT gopi/server:latest
                docker tag gopi/worker:$COMMIT gopi/worker:latest
                docker tag gopi/nginx:$COMMIT gopi/nginx:latest
                '''
            }
        }

        //  7. Integration Test
        stage('Integration Test') {
            steps {
                sh '''
                docker-compose -f docker-compose.ci.yml up -d
                sleep 10

                curl -f http://localhost:3050 || exit 1

                docker-compose -f docker-compose.ci.yml down
                '''
            }
        }

        //  8. Push to Docker Hub
        stage('Push Images') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_HUB_CREDS}",
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {

                    sh '''
                    echo $PASSWORD | docker login -u $USERNAME --password-stdin

                    docker push gopi/client:$COMMIT
                    docker push gopi/server:$COMMIT
                    docker push gopi/worker:$COMMIT
                    docker push gopi/nginx:$COMMIT

                    docker push gopi/client:latest
                    docker push gopi/server:latest
                    docker push gopi/worker:latest
                    docker push gopi/nginx:latest
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker system prune -f'
        }
    }
}