pipeline {
    agent {
        docker {
            image 'gopidoc77/jenkins-agent:v1'

            args '''
            --add-host=host.docker.internal:host-gateway \
            -u root \
            -v /var/run/docker.sock:/var/run/docker.sock
            '''
        }
    }

    environment {
        DOCKER_HUB_CREDS = 'docker-hub-creds'
        SONARQUBE_SERVER = 'sonarqube-server'
        CI = 'true'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                cd client && npm install
                cd ../server && npm install
                cd ../worker && npm install
                '''
            }
        }

        stage('Unit Test') {
            steps {
                sh '''
                cd client && npm test -- --watchAll=false
                cd ../server && npm test
                cd ../worker && npm test
                '''
            }
        }

        stage('SonarQube') {
            steps {
                withSonarQubeEnv("${SONARQUBE_SERVER}") {
                    sh '''
                    apt-get update
                    apt-get install -y unzip wget

                    if [ ! -d "sonar-scanner-7.1.0.4889-linux-x64" ]; then
                        wget https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-7.1.0.4889-linux-x64.zip

                        unzip -o sonar-scanner-cli-7.1.0.4889-linux-x64.zip
                    fi

                    export PATH=$PATH:$(pwd)/sonar-scanner-7.1.0.4889-linux-x64/bin

                    cd client
                    sonar-scanner
                    '''
                }
            }
        }

        stage('Build Client') {
            steps {
                sh 'cd client && npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {

                    sh '''
                    git config --global --add safe.directory /var/lib/jenkins/workspace/Multi-service-Application
                    '''

                    env.COMMIT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }

                sh '''



                docker build -t gopidoc77/fib-client:$COMMIT ./client
                docker build -t gopidoc77/fib-server:$COMMIT ./server
                docker build -t gopidoc77/fib-worker:$COMMIT ./worker
                docker build -t gopidoc77/fib-nginx:$COMMIT ./nginx

                docker tag gopidoc77/fib-client:$COMMIT gopidoc77/fib-client:latest
                docker tag gopidoc77/fib-server:$COMMIT gopidoc77/fib-server:latest
                docker tag gopidoc77/fib-worker:$COMMIT gopidoc77/fib-worker:latest
                docker tag gopidoc77/fib-nginx:$COMMIT gopidoc77/fib-nginx:latest
                '''
            }
        }

        stage('Integration Test') {
            steps {

                sh 'docker compose -f docker-compose-ci.yml up -d'

                sh '''
                echo "Waiting for application to start..."

                for i in {1..10}; do

                docker compose -f docker-compose-ci.yml exec -T nginx \
                curl -f http://localhost && exit 0

                echo "Application not ready yet..."
                sleep 5
                done

                echo "Application failed to start"

                docker compose -f docker-compose-ci.yml logs

                exit 1
                '''
            }

            post {
                always {
                    sh 'docker compose -f docker-compose-ci.yml down'
                }
            }
        }

        stage('Push Images') {
            steps {

                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {

                    sh '''
                    echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin

                    docker push gopidoc77/fib-client:$COMMIT
                    docker push gopidoc77/fib-server:$COMMIT
                    docker push gopidoc77/fib-worker:$COMMIT
                    docker push gopidoc77/fib-nginx:$COMMIT

                    docker push gopidoc77/fib-client:latest
                    docker push gopidoc77/fib-server:latest
                    docker push gopidoc77/fib-worker:latest
                    docker push gopidoc77/fib-nginx:latest

                    docker logout
                    '''
                }
            }
        }

    post {
        always {
            sh 'docker system prune -f'
        }
    }
}
