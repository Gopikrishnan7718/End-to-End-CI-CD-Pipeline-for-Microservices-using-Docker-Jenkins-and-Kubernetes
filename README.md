# End-to-End CI/CD Pipeline for Multi-Service App using Docker, Jenkins and Kubernetes

## Project Overview

A production-style multi-service application with a fully automated CI/CD pipeline.
The application calculates Fibonacci numbers using a microservices architecture.
Jenkins automates the build, test, and deployment process with GitHub webhook triggers.
Docker containers are used for each service and images are pushed to Docker Hub.
Kubernetes handles container orchestration and deployment.

---

## Application Architecture

User
↓
Nginx (Reverse Proxy)
↓
┌─────────────────────────────┐
│  React Client (Frontend)    │
└─────────────────────────────┘
↓
┌─────────────────────────────┐
│  Express API Server         │
└─────────────────────────────┘
↓                    ↓
Redis (Pub/Sub)    Postgres (Storage)
↓
┌─────────────────────────────┐
│  Worker Service             │
│  (Fibonacci Calculator)     │
└─────────────────────────────┘

---

---

## How the Application Works

1. User enters a Fibonacci index on the React frontend
2. React sends the index to the Express API via Nginx
3. API stores the index in Postgres and publishes it to Redis
4. Worker service subscribes to Redis, calculates the Fibonacci value and stores result back in Redis
5. React fetches and displays all calculated values

---

## Services

| Service | Tech | Purpose |
|---------|------|---------|
| Client | React | Frontend UI |
| Server | Express.js | REST API, connects to Redis and Postgres |
| Worker | Node.js | Fibonacci calculator via Redis pub/sub |
| Nginx | Nginx | Reverse proxy — routes traffic to client and API |
| Postgres | PostgreSQL | Stores all submitted indexes |
| Redis | Redis | Message broker between server and worker |

---

## Tech Stack

| Category | Tool |
|---|---|
| Frontend | React |
| Backend | Express.js, Node.js |
| Database | PostgreSQL |
| Cache / Broker | Redis |
| Reverse Proxy | Nginx |
| Containerization | Docker |
| Container Registry | Docker Hub |
| CI/CD | Jenkins (GitHub webhook triggered) |
| Orchestration | Kubernetes (Minikube / EKS) |
| Version Control | Git & GitHub |

---

## Docker Hub Images

| Service | Image |
|---------|-------|
| Client | `gopidoc77/fib-client` |
| Server | `gopidoc77/fib-server` |
| Worker | `gopidoc77/fib-worker` |
| Nginx | `gopidoc77/fib-nginx` |

---

## CI/CD Workflow

1. Code pushed to GitHub
2. GitHub webhook triggers Jenkins pipeline automatically
3. Jenkins runs tests for each service
4. Docker images are built for each service
5. Images are pushed to Docker Hub
6. Kubernetes applies updated manifests
7. Rolling update deploys new containers with zero downtime

---

## Kubernetes Resources

- Deployments for each service (client, server, worker)
- ClusterIP Services for internal communication
- LoadBalancer / Ingress for external access
- ConfigMaps for environment configuration
- Secrets for sensitive credentials (Postgres password)

---

## Repository Structure

├── client/            # React frontend
│   ├── src/           # React components
│   ├── Dockerfile
│   └── Dockerfile.dev
├── server/            # Express API
│   ├── index.js       # API routes
│   ├── keys.js        # Environment config
│   ├── Dockerfile
│   └── Dockerfile.dev
├── worker/            # Fibonacci worker
│   ├── index.js       # Redis subscriber + Fib calculator
│   ├── fib.js         # Fibonacci logic
│   ├── Dockerfile
│   └── Dockerfile.dev
├── nginx/             # Reverse proxy config
│   ├── default.conf
│   ├── Dockerfile
│   └── Dockerfile.dev
├── k8s/               # Kubernetes manifests
├── docker-compose.yml # Local development setup
└── Jenkinsfile        # CI/CD pipeline

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/Gopikrishnan7718/End-to-End-CI-CD-Pipeline-for-Microservices-using-Docker-Jenkins-and-Kubernetes.git

# Start all services locally
docker-compose up --build
```

Access the app at `http://localhost:3050`

---

## Challenges Faced

- Nginx routing configuration between client and API
- Redis pub/sub connection handling between server and worker
- Jenkins pipeline managing multiple Docker image builds
- GitHub webhook integration with Jenkins

---

## Future Improvements

- Deploy on AWS EKS for production-grade Kubernetes
- Add Horizontal Pod Autoscaler (HPA)
- Add CloudWatch or Prometheus monitoring
- Add multi-environment setup (Dev / Stage / Prod)
