# ◈ NexaBank AI — DevSecOps Learning Project

> **"Don't just learn DevSecOps theory. Apply every concept on a real app you built yourself."**

This is not just a banking app. This is your **DevSecOps laboratory**.
Every tool, every concept, every pipeline — explained from zero, applied to this project.

---

## 📋 Table of Contents

1. [What is DevSecOps?](#1-what-is-devsecops)
2. [Project Architecture](#2-project-architecture)
3. [Run Locally (No DevOps)](#3-run-locally-no-devops)
4. [Docker — Containerization](#4-docker--containerization)
5. [GitHub Actions — CI/CD Pipelines](#5-github-actions--cicd-pipelines)
6. [Kubernetes (K8s) — Container Orchestration](#6-kubernetes-k8s--container-orchestration)
7. [Terraform — Infrastructure as Code](#7-terraform--infrastructure-as-code)
8. [Ansible — Configuration Management](#8-ansible--configuration-management)
9. [GitOps — ArgoCD](#9-gitops--argocd)
10. [Observability — Prometheus, Grafana, Loki](#10-observability--prometheus-grafana-loki)
11. [Security — The "Sec" in DevSecOps](#11-security--the-sec-in-devsecops)
12. [Full DevSecOps Flow — End to End](#12-full-devsecops-flow--end-to-end)
13. [Learning Roadmap](#13-learning-roadmap)

---

## 1. What is DevSecOps?

### The Old Way (Waterfall)
```
Developer → [writes code for 6 months] → Ops team deploys → Security team scans → Problems found → Back to start
```
This was **slow, expensive, and dangerous**.

### The DevOps Way
```
Developer → CI/CD Pipeline → Auto Deploy → Monitor
```
Fast! But security was still bolted on at the end.

### The DevSecOps Way
```
Developer → [Security baked in at every step] → CI/CD with security gates → Secure Deploy → Monitor + Alert
```

**DevSecOps = Development + Security + Operations working together continuously.**

### The Three Pillars

```
┌─────────────────────────────────────────────────────────┐
│                     DevSecOps                           │
│                                                         │
│   DEV              SEC              OPS                 │
│   ───             ───              ───                  │
│   Write code      Scan code        Deploy               │
│   Write tests     Check secrets    Monitor              │
│   Git push        SAST/DAST        Alert                │
│   Review PR       Compliance       Scale                │
└─────────────────────────────────────────────────────────┘
```

### Key Concepts You'll Learn

| Concept | Tool | What it does |
|---|---|---|
| Containerization | Docker | Package app + dependencies into a portable box |
| CI/CD | GitHub Actions | Auto-build, test, deploy on every git push |
| Orchestration | Kubernetes | Run 100s of containers, auto-heal, scale |
| IaC | Terraform | Write cloud infrastructure as code |
| Config Mgmt | Ansible | Install software on servers automatically |
| GitOps | ArgoCD | Git = single source of truth for deployments |
| Observability | Prometheus + Grafana | See what's happening inside your app |
| Security | Trivy, SonarQube, OWASP | Find vulnerabilities before attackers do |

---

## 2. Project Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      NexaBank AI                             │
│                                                              │
│   ┌─────────────────┐         ┌──────────────────────────┐  │
│   │  React Frontend │ ──────► │   FastAPI Backend         │  │
│   │  (Vite + CSS)   │  HTTP   │   /api/accounts           │  │
│   │  Port: 3000     │         │   /api/transactions       │  │
│   └─────────────────┘         │   /api/ai                 │  │
│                               │   Port: 8000              │  │
│                               └───────────┬───────────────┘  │
│                                           │                   │
│                               ┌───────────▼───────────────┐  │
│                               │   SQLite (local dev)       │  │
│                               │   PostgreSQL (production)  │  │
│                               └───────────────────────────┘  │
│                                           │                   │
│                               ┌───────────▼───────────────┐  │
│                               │   Ollama (Local LLM)       │  │
│                               │   llama3.2 model           │  │
│                               │   Port: 11434              │  │
│                               └───────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### File Structure
```
ai-nexabank/
├── backend/
│   ├── main.py              ← FastAPI app entry point
│   ├── database.py          ← SQLAlchemy DB connection
│   ├── models.py            ← DB table definitions
│   ├── schemas.py           ← Pydantic request/response shapes
│   ├── requirements.txt     ← Python dependencies
│   └── routes/
│       ├── accounts.py      ← Account CRUD
│       ├── transactions.py  ← Deposit, Withdraw, Transfer
│       └── ai_advisor.py    ← Ollama AI integration
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx         ← React entry point
│   │   ├── App.jsx          ← Navigation shell
│   │   ├── api.js           ← All fetch() calls to backend
│   │   ├── index.css        ← Full styling
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── CreateAccount.jsx
│   │       ├── Transactions.jsx
│   │       └── AIAdvisor.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md                ← YOU ARE HERE
```

---

## 3. Run Locally (No DevOps)

This is the baseline. Run the app without any DevOps tooling.

### Prerequisites
- Python 3.11+
- Node.js 18+
- (Optional) Ollama installed → `ollama pull llama3.2`

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
→ API running at http://localhost:8000
→ Swagger docs at http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
→ App running at http://localhost:3000

### Optional: Ollama AI
```bash
# Install Ollama: https://ollama.com
ollama pull llama3.2
ollama serve              # starts on port 11434
```
Without Ollama, the AI Advisor uses smart rule-based fallback responses.

---

## 4. Docker — Containerization

### What Problem Does Docker Solve?

**Without Docker:**
> "It works on my machine!" 😤
> — Every developer ever

**With Docker:**
> Every machine runs the exact same environment. No more "but it worked locally."

### Core Concepts

#### Image vs Container
```
Image = Recipe (blueprint, read-only)
Container = Cooked dish (running instance, can be created/destroyed)

Docker Image → run → Docker Container
(like a Class)       (like an Object/instance)
```

#### Layers
Every instruction in a Dockerfile adds a layer.
Docker caches layers — so if you change only your app code, it only rebuilds that layer.

```
Layer 5: COPY app code         ← changes often → rebuilt
Layer 4: RUN pip install       ← only if requirements.txt changes
Layer 3: COPY requirements.txt
Layer 2: RUN apt-get install python
Layer 1: FROM ubuntu:22.04     ← base image, rarely changes
```

### Dockerfile — Backend
Create `backend/Dockerfile`:
```dockerfile
# Stage 1: Base
FROM python:3.11-slim AS base

WORKDIR /app

# Copy deps first (layer cache optimization)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Expose port
EXPOSE 8000

# Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Dockerfile — Frontend
Create `frontend/Dockerfile`:
```dockerfile
# Stage 1: Build React app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # ci = clean install (faster, no package-lock changes)
COPY . .
RUN npm run build             # creates /app/dist folder

# Stage 2: Serve with Nginx (tiny, production-ready)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Why two stages?**
- Build stage has Node.js (~400MB) — only needed to compile
- Final image has only Nginx (~20MB) — no Node.js needed at runtime
- Result: tiny, fast, secure image

### docker-compose.yml
Create `docker-compose.yml` at root:
```yaml
version: "3.9"

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://nexabank:secret@db:5432/nexabank
    depends_on:
      db:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER:     nexabank
      POSTGRES_PASSWORD: secret
      POSTGRES_DB:       nexabank
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U nexabank"]
      interval: 5s
      retries: 5

volumes:
  pgdata:
```

### Run Everything with Docker
```bash
docker-compose up --build
```

### Key Docker Commands
```bash
docker build -t nexabank-backend .   # Build image
docker run -p 8000:8000 nexabank-backend  # Run container
docker ps                            # List running containers
docker logs <container_id>           # See container logs
docker exec -it <id> bash            # Enter container shell
docker images                        # List images
docker system prune                  # Clean up unused stuff
```

### Docker Networking
When containers are in the same docker-compose network:
- They talk to each other by **service name**, not IP
- `backend` connects to DB at `db:5432` (not `localhost:5432`)
- This is why we set `DATABASE_URL=postgresql://...@db:5432/...`

---

## 5. GitHub Actions — CI/CD Pipelines

### What is CI/CD?

```
CI = Continuous Integration
     Every time someone pushes code → automatically build + test

CD = Continuous Delivery/Deployment
     Every time tests pass → automatically deploy to staging/production
```

### The Flow for NexaBank

```
Developer pushes code to GitHub
         │
         ▼
GitHub Actions triggers workflow
         │
    ┌────┴────────────────────────────────────┐
    │                                         │
    ▼                                         ▼
 CI Jobs                              CD Jobs (after CI passes)
  ├── Lint code                        ├── Build Docker images
  ├── Run tests                        ├── Push to Docker Hub / ECR
  ├── Security scan (Trivy)            ├── Deploy to staging
  └── Code quality (SonarQube)         └── Deploy to production (manual approval)
```

### Create `.github/workflows/ci.yml`
```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # ── Job 1: Test Backend ──────────────────────────────────
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          cd backend
          pip install -r requirements.txt
          pip install pytest httpx

      - name: Run tests
        run: |
          cd backend
          pytest tests/ -v

  # ── Job 2: Test Frontend ─────────────────────────────────
  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "18"
      - run: cd frontend && npm ci && npm run build

  # ── Job 3: Security Scan ─────────────────────────────────
  security-scan:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          scan-ref: .
          severity: HIGH,CRITICAL
          exit-code: 1    # fail pipeline if critical vulns found

      - name: Check for secrets in code
        uses: gitleaks/gitleaks-action@v2
```

### Create `.github/workflows/cd.yml`
```yaml
name: CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            yourusername/nexabank-backend:latest
            yourusername/nexabank-backend:${{ github.sha }}

      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            yourusername/nexabank-frontend:latest
            yourusername/nexabank-frontend:${{ github.sha }}
```

### Key Concepts

**Secrets:** Never hardcode passwords. Store in GitHub → Settings → Secrets:
```
DOCKER_USERNAME = your_dockerhub_username
DOCKER_PASSWORD = your_dockerhub_token
```

**Triggers:**
```yaml
on:
  push:           # runs when you push
  pull_request:   # runs when you open a PR
  schedule:       # runs on a cron schedule
    - cron: "0 2 * * *"  # every day at 2am
  workflow_dispatch:  # manual trigger
```

**Jobs vs Steps:**
- **Job** = a machine (VM) that runs
- **Step** = one task inside a job
- Jobs run **in parallel** by default
- Use `needs:` to make a job wait for another

---

## 6. Kubernetes (K8s) — Container Orchestration

### What Problem Does K8s Solve?

Docker runs one container on one machine.
But in production you need:
- 10 containers for backend (to handle traffic)
- Auto-restart if a container crashes
- Rolling updates (zero downtime)
- Load balancing between containers
- Auto-scaling on high traffic

**Kubernetes does all of this automatically.**

### Core Concepts

```
┌─────────────────────────────────────────────────────────────┐
│                        CLUSTER                              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    NODE 1    │  │    NODE 2    │  │    NODE 3    │     │
│  │  (Server/VM) │  │  (Server/VM) │  │  (Server/VM) │     │
│  │              │  │              │  │              │     │
│  │  ┌────────┐  │  │  ┌────────┐  │  │  ┌────────┐  │     │
│  │  │  POD   │  │  │  │  POD   │  │  │  │  POD   │  │     │
│  │  │backend │  │  │  │backend │  │  │  │frontend│  │     │
│  │  └────────┘  │  │  └────────┘  │  │  └────────┘  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**Pod** = Smallest deployable unit. Wraps one (or more) containers.
**Node** = A server (physical or virtual machine).
**Cluster** = Collection of nodes managed by K8s.
**Deployment** = Defines how many pods to run + what image to use.
**Service** = Network endpoint to reach pods (pods have changing IPs, Service has a fixed IP).
**Ingress** = HTTP router. Routes traffic from outside to the right service.

### K8s Manifests for NexaBank

**backend/k8s/deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nexabank-backend
  labels:
    app: nexabank-backend
spec:
  replicas: 3              # Run 3 pods of backend
  selector:
    matchLabels:
      app: nexabank-backend
  template:
    metadata:
      labels:
        app: nexabank-backend
    spec:
      containers:
        - name: backend
          image: yourusername/nexabank-backend:latest
          ports:
            - containerPort: 8000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:        # Pull from K8s Secret, not hardcoded
                  name: nexabank-secrets
                  key: database-url
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "200m"
          livenessProbe:             # K8s pings /health to check if alive
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:            # K8s checks if pod is ready for traffic
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 5
            periodSeconds: 10
```

**backend/k8s/service.yaml:**
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nexabank-backend-svc
spec:
  selector:
    app: nexabank-backend    # Routes to pods with this label
  ports:
    - port: 80
      targetPort: 8000
  type: ClusterIP            # Internal only (not exposed to internet)
```

**k8s/ingress.yaml:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nexabank-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: nexabank.yourdomain.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: nexabank-backend-svc
                port:
                  number: 80
          - path: /
            pathType: Prefix
            backend:
              service:
                name: nexabank-frontend-svc
                port:
                  number: 80
```

**k8s/secrets.yaml (NEVER commit this — use Sealed Secrets or Vault):**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: nexabank-secrets
type: Opaque
stringData:
  database-url: "postgresql://nexabank:secret@postgres-svc:5432/nexabank"
```

### K8s Commands
```bash
kubectl apply -f k8s/               # Apply all manifests in folder
kubectl get pods                    # List running pods
kubectl get services                # List services
kubectl logs <pod-name>             # View pod logs
kubectl describe pod <pod-name>     # Debug a pod
kubectl exec -it <pod-name> -- bash # Shell into pod
kubectl scale deployment nexabank-backend --replicas=5  # Scale up
kubectl rollout status deployment/nexabank-backend      # Watch deployment
kubectl rollout undo deployment/nexabank-backend        # Roll back
```

### HPA — Horizontal Pod Autoscaler
Automatically scales pods based on CPU usage:
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nexabank-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nexabank-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70   # Scale when CPU > 70%
```

---

## 7. Terraform — Infrastructure as Code

### What Problem Does Terraform Solve?

Imagine clicking through AWS Console to create:
- 1 VPC
- 3 subnets
- 1 EKS cluster
- 2 RDS databases
- 1 S3 bucket
- 3 security groups

Now do it again for staging. And again for prod.
One click mistake → hours of debugging.

**Terraform lets you write all of this as code.**
- Version controlled
- Reproducible
- Reviewable (like code reviews)
- Destroyable with one command

### Core Concepts

```
Provider  = Plugin to talk to AWS/GCP/Azure/etc
Resource  = Thing you want to create (EC2, RDS, VPC...)
State     = Terraform's memory (what it already created)
Plan      = Preview of what will change
Apply     = Execute the changes
Destroy   = Delete everything
```

### Terraform for NexaBank on AWS

**terraform/main.tf:**
```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # Store state in S3 so team can share it
  backend "s3" {
    bucket = "nexabank-terraform-state"
    key    = "production/terraform.tfstate"
    region = "ap-south-1"
  }
}

provider "aws" {
  region = var.aws_region
}

# ── VPC ──────────────────────────────────────────────────────
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "nexabank-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["ap-south-1a", "ap-south-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway = true
}

# ── EKS Cluster ──────────────────────────────────────────────
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.0.0"

  cluster_name    = "nexabank-cluster"
  cluster_version = "1.29"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.medium"]
      min_size       = 2
      max_size       = 5
      desired_size   = 2
    }
  }
}

# ── RDS PostgreSQL ────────────────────────────────────────────
resource "aws_db_instance" "nexabank_db" {
  identifier        = "nexabank-postgres"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.micro"
  allocated_storage = 20

  db_name  = "nexabank"
  username = "nexabank"
  password = var.db_password    # Never hardcode passwords!

  skip_final_snapshot = false
  multi_az            = true    # High availability
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}
```

**terraform/variables.tf:**
```hcl
variable "aws_region" {
  default = "ap-south-1"
}

variable "db_password" {
  description = "RDS master password"
  sensitive   = true    # Won't be shown in logs
}
```

### Terraform Workflow
```bash
terraform init      # Download providers and modules
terraform plan      # Preview changes (ALWAYS do this first!)
terraform apply     # Create/update infrastructure
terraform destroy   # Tear everything down
terraform fmt       # Format code
terraform validate  # Check syntax
```

### State Management
Terraform keeps track of what it created in a **state file**.
- Local: `terraform.tfstate` (bad for teams)
- Remote: S3 + DynamoDB (good for teams)

```
terraform apply
    │
    ├── Reads: terraform.tfstate (what exists now)
    ├── Reads: your .tf files (what you want)
    ├── Calculates: the difference (Plan)
    └── Creates/Updates/Deletes: resources to match desired state
```

---

## 8. Ansible — Configuration Management

### What Problem Does Ansible Solve?

You have 10 servers. You need to:
- Install Python 3.11 on all of them
- Copy the app code
- Set environment variables
- Start the service
- Set up firewall rules

Doing this manually on 10 servers = 10x work and 10x chances of mistake.
**Ansible does it all from one command on your laptop.**

### Core Concepts

```
Control Node  = Your laptop (where you run Ansible)
Managed Node  = The servers you're configuring
Inventory     = List of servers to manage
Playbook      = YAML file with instructions (like a recipe)
Task          = One action (install nginx, copy file, run command)
Role          = Reusable set of tasks (like a Python module)
Module        = Built-in Ansible functions (apt, copy, service...)
```

### Ansible is Agentless
Unlike other tools, Ansible needs **nothing installed on the servers**.
It connects via SSH and runs commands remotely.

```
Your Laptop ──(SSH)──► Server 1
            ──(SSH)──► Server 2
            ──(SSH)──► Server 3
```

### Inventory File
**ansible/inventory.ini:**
```ini
[webservers]
server1 ansible_host=192.168.1.10
server2 ansible_host=192.168.1.11

[database]
dbserver ansible_host=192.168.1.20

[all:vars]
ansible_user=ubuntu
ansible_ssh_private_key_file=~/.ssh/nexabank.pem
```

### Playbook for NexaBank
**ansible/deploy.yml:**
```yaml
---
- name: Deploy NexaBank Backend
  hosts: webservers
  become: yes          # sudo

  vars:
    app_dir: /opt/nexabank
    python_version: "3.11"

  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes

    - name: Install Python 3.11
      apt:
        name: "python{{ python_version }}"
        state: present

    - name: Install pip
      apt:
        name: python3-pip
        state: present

    - name: Create app directory
      file:
        path: "{{ app_dir }}"
        state: directory
        owner: ubuntu

    - name: Copy application code
      copy:
        src: ../backend/
        dest: "{{ app_dir }}/backend/"

    - name: Install Python dependencies
      pip:
        requirements: "{{ app_dir }}/backend/requirements.txt"
        virtualenv: "{{ app_dir }}/venv"

    - name: Copy systemd service file
      template:
        src: templates/nexabank.service.j2
        dest: /etc/systemd/system/nexabank.service

    - name: Start and enable NexaBank service
      systemd:
        name: nexabank
        state: started
        enabled: yes
        daemon_reload: yes

    - name: Open port 8000 in firewall
      ufw:
        rule: allow
        port: "8000"
        proto: tcp
```

### Run Ansible
```bash
ansible-playbook -i inventory.ini deploy.yml
ansible-playbook -i inventory.ini deploy.yml --check  # dry run
ansible all -i inventory.ini -m ping                  # test connectivity
```

### Ansible vs Terraform
```
Terraform  → Creates infrastructure (VMs, databases, networks)
Ansible    → Configures the software INSIDE that infrastructure

Terraform: "Give me 3 Ubuntu VMs on AWS"
Ansible:   "On those 3 VMs, install Python, copy my app, start the service"
```

---

## 9. GitOps — ArgoCD

### What is GitOps?

**Core principle: Git is the single source of truth for everything — including infrastructure and deployments.**

```
Traditional CD:
  CI Pipeline → SSH into server → kubectl apply → Done
  (Imperative: you tell it WHAT TO DO)

GitOps:
  Developer updates k8s YAML in Git repo
  ArgoCD watches the repo
  ArgoCD sees the change → automatically applies it to cluster
  (Declarative: you tell it WHAT STATE YOU WANT)
```

### Why GitOps?

- **Full audit trail**: Every deployment is a git commit. Who deployed what, when, why.
- **Easy rollback**: `git revert` = instant rollback
- **Drift detection**: If someone manually changes something in K8s, ArgoCD detects the "drift" and reverts it
- **Security**: No one needs kubectl access to production. Only ArgoCD does.

### Repository Structure for GitOps

```
nexabank-gitops/           ← Separate repo! (not your app repo)
├── apps/
│   ├── nexabank-backend/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── hpa.yaml
│   └── nexabank-frontend/
│       ├── deployment.yaml
│       └── service.yaml
├── infrastructure/
│   ├── prometheus/
│   ├── grafana/
│   └── ingress-nginx/
└── environments/
    ├── staging/
    └── production/
```

### ArgoCD Application Manifest
**argocd/nexabank-app.yaml:**
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nexabank
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/yourusername/nexabank-gitops
    targetRevision: main
    path: apps/nexabank-backend
  destination:
    server: https://kubernetes.default.svc
    namespace: nexabank
  syncPolicy:
    automated:
      prune: true      # Delete resources removed from Git
      selfHeal: true   # Revert manual changes in cluster
    syncOptions:
      - CreateNamespace=true
```

### ArgoCD Setup
```bash
# Install ArgoCD in cluster
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Apply our app
kubectl apply -f argocd/nexabank-app.yaml
```

### GitOps Flow with NexaBank
```
1. Developer builds new feature → pushes to feature branch
2. PR opened → CI runs tests + security scans
3. PR merged to main → CD pipeline builds new Docker image
4. CD pipeline updates the image tag in nexabank-gitops repo
   (e.g., nexabank-backend:abc123 → nexabank-backend:def456)
5. ArgoCD detects change in gitops repo
6. ArgoCD applies new deployment to K8s cluster
7. K8s rolls out new pods (zero downtime rolling update)
8. Old pods terminate after new ones are healthy
```

---

## 10. Observability — Prometheus, Grafana, Loki

### The Three Pillars of Observability

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│    METRICS   │   │    LOGS      │   │    TRACES    │
│              │   │              │   │              │
│ Numbers over │   │ Text events  │   │ Request path │
│ time         │   │ from your    │   │ across       │
│              │   │ app          │   │ services     │
│ "API handled │   │ "2024-01-01  │   │ "Request     │
│  1200 req/s" │   │  ERROR: DB   │   │  took 230ms  │
│              │   │  timeout"    │   │  in 4 hops"  │
│  Prometheus  │   │    Loki      │   │    Jaeger    │
└──────────────┘   └──────────────┘   └──────────────┘
```

### Prometheus — Metrics Collection

Prometheus **scrapes** (pulls) metrics from your app at regular intervals.

**Add metrics to FastAPI backend:**
```python
# Add to backend/main.py
from prometheus_fastapi_instrumentator import Instrumentator

Instrumentator().instrument(app).expose(app)
# This adds /metrics endpoint automatically
```

**Add to requirements.txt:**
```
prometheus-fastapi-instrumentator==6.1.0
```

Now visit http://localhost:8000/metrics — you'll see:
```
# HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",status="200"} 42
http_requests_total{method="POST",status="201"} 15
```

**prometheus.yml config:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: nexabank-backend
    static_configs:
      - targets: ['nexabank-backend-svc:8000']

  - job_name: kubernetes-pods
    kubernetes_sd_configs:
      - role: pod
```

### Grafana — Visualization

Grafana reads from Prometheus and makes beautiful dashboards.

**Key dashboards to create for NexaBank:**
1. **API Performance**: Request rate, error rate, latency (P50, P95, P99)
2. **Business Metrics**: Transactions per minute, deposit amounts, AI queries
3. **Infrastructure**: CPU, Memory, Pod restarts
4. **Alerts**: When error rate > 5%, when response time > 2s

**Example PromQL queries:**
```promql
# Requests per second
rate(http_requests_total[5m])

# Error rate (%)
rate(http_requests_total{status=~"5.."}[5m])
/ rate(http_requests_total[5m]) * 100

# 95th percentile response time
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Total transactions in last hour
increase(http_requests_total{path="/api/transactions"}[1h])
```

### Loki — Log Aggregation

Loki collects logs from all your pods and makes them searchable.
Think of it as "Ctrl+F for your entire production system."

**Promtail** (log collector) → **Loki** (storage) → **Grafana** (query/view)

**LogQL queries:**
```logql
# All errors from backend
{app="nexabank-backend"} |= "ERROR"

# Failed transactions in last 10min
{app="nexabank-backend"} |= "Insufficient funds" | json

# Count of 500 errors per minute
rate({app="nexabank-backend"} |= "500" [1m])
```

### Alerting
**Grafana Alert Rule:**
```yaml
# Alert when backend error rate > 5%
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  for: 2m
  labels:
    severity: critical
  annotations:
    summary: "NexaBank backend error rate is {{ $value }}%"
    description: "Check logs immediately!"
```

**Alert channels:** Slack, PagerDuty, Email, Telegram

### The Stack in Docker Compose
```yaml
# Add to docker-compose.yml
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  loki:
    image: grafana/loki:latest

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./monitoring/promtail.yml:/etc/promtail/config.yml
```

---

## 11. Security — The "Sec" in DevSecOps

### Shift Left Security

```
OLD WAY:   Code → Build → Deploy → [Security check] → Problems found → Fix → Redeploy (EXPENSIVE)

NEW WAY:   [Security check] → Code → [Security check] → Build → [Security check] → Deploy (CHEAP)
```

"Shift Left" means moving security checks earlier in the pipeline (to the left on a timeline).

### Security Layers for NexaBank

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Code Security (SAST)                              │
│  Tool: Bandit (Python), SonarQube                           │
│  When: Pre-commit + CI pipeline                             │
│  Checks: SQL injection, hardcoded secrets, insecure code    │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Dependency Security (SCA)                         │
│  Tool: Safety, Snyk, OWASP Dependency Check                 │
│  When: CI pipeline, weekly scheduled scans                  │
│  Checks: Known vulnerabilities in pip/npm packages          │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Container Security                                │
│  Tool: Trivy, Docker Scout                                  │
│  When: After docker build, before push                      │
│  Checks: Vulnerable OS packages inside image                │
├─────────────────────────────────────────────────────────────┤
│  Layer 4: Secret Detection                                  │
│  Tool: GitLeaks, TruffleHog                                 │
│  When: Pre-commit hook, CI pipeline                         │
│  Checks: API keys, passwords accidentally committed to Git  │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: Runtime Security                                  │
│  Tool: Falco (K8s), AWS GuardDuty                           │
│  When: Always running in production                         │
│  Checks: Suspicious behavior in containers (crypto mining,  │
│          unexpected network connections, privilege escalation│
├─────────────────────────────────────────────────────────────┤
│  Layer 6: API Security (DAST)                               │
│  Tool: OWASP ZAP, Burp Suite                                │
│  When: Against staging environment                          │
│  Checks: OWASP Top 10 vulnerabilities in running API        │
└─────────────────────────────────────────────────────────────┘
```

### SAST — Static Application Security Testing

Scans your source code without running it.

**Bandit for Python:**
```bash
pip install bandit
bandit -r backend/ -ll   # scan backend, report medium+ severity
```

Bandit detects issues like:
```python
# BAD — SQL injection vulnerability
query = f"SELECT * FROM accounts WHERE email = '{email}'"

# GOOD — parameterized query (safe)
db.query(Account).filter(Account.email == email).first()
```

**Add to GitHub Actions:**
```yaml
- name: Run Bandit (Python SAST)
  run: |
    pip install bandit
    bandit -r backend/ -f json -o bandit-report.json
```

### Trivy — Container Scanning
```bash
# Scan a Docker image for vulnerabilities
trivy image nexabank-backend:latest

# Scan filesystem
trivy fs .

# Output:
# nexabank-backend:latest (debian 12.5)
# =====================================
# Total: 3 (HIGH: 1, MEDIUM: 2)
#
# HIGH: CVE-2024-XXXX in openssl 3.0.2 → upgrade to 3.0.11
```

### Secret Detection with GitLeaks
```bash
# Never commit secrets! Use GitLeaks to check
docker run -v $(pwd):/path zricethezav/gitleaks:latest detect --source /path

# Common secrets people accidentally commit:
# - AWS access keys
# - Database passwords
# - API keys (OpenAI, Stripe, etc.)
# - JWT secret keys
```

**Use environment variables ALWAYS:**
```python
import os
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nexabank.db")
OLLAMA_URL   = os.getenv("OLLAMA_URL", "http://localhost:11434")
```

### K8s Security Best Practices

**1. Run containers as non-root:**
```yaml
securityContext:
  runAsNonRoot: true
  runAsUser: 1000
  readOnlyRootFilesystem: true
```

**2. Network Policies (firewall between pods):**
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
spec:
  podSelector:
    matchLabels:
      app: nexabank-backend
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: nexabank-frontend  # Only frontend can talk to backend
```

**3. Resource Limits (prevent resource exhaustion attacks):**
```yaml
resources:
  limits:
    memory: "256Mi"
    cpu: "200m"
```

**4. Never use `latest` tag in production:**
```yaml
# BAD
image: nexabank-backend:latest

# GOOD — pinned to exact commit
image: nexabank-backend:sha-a1b2c3d
```

---

## 12. Full DevSecOps Flow — End to End

Here is the complete journey of a code change from your laptop to production:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE DevSecOps FLOW                              │
│                                                                         │
│  1. DEV WRITES CODE                                                     │
│     git add . && git commit -m "feat: add fraud detection"              │
│         │                                                               │
│         │ pre-commit hooks fire:                                        │
│         ├── GitLeaks: no secrets? ✓                                     │
│         └── Bandit: no insecure code? ✓                                 │
│                                                                         │
│  2. GIT PUSH → GITHUB                                                   │
│     git push origin feature/fraud-detection                             │
│         │                                                               │
│  3. PULL REQUEST OPENED                                                 │
│     GitHub Actions CI triggers:                                         │
│         ├── pytest: all tests pass? ✓                                   │
│         ├── Bandit SAST scan: no issues? ✓                              │
│         ├── Safety: no vulnerable dependencies? ✓                       │
│         ├── Trivy: Docker image scan clean? ✓                           │
│         └── SonarQube: code quality gate passed? ✓                      │
│                                                                         │
│  4. CODE REVIEW + MERGE TO MAIN                                         │
│     Team reviews PR → approved → merged                                 │
│         │                                                               │
│  5. CD PIPELINE TRIGGERS                                                │
│     ├── Build Docker image                                              │
│     ├── Tag with git SHA: nexabank-backend:a1b2c3d                      │
│     ├── Final Trivy scan on built image                                 │
│     └── Push to Container Registry (ECR/DockerHub)                     │
│         │                                                               │
│  6. GITOPS UPDATE                                                       │
│     CD pipeline updates nexabank-gitops repo:                          │
│     image: nexabank-backend:a1b2c3d → nexabank-backend:e4f5g6h          │
│         │                                                               │
│  7. ARGOCD DETECTS CHANGE                                               │
│     ArgoCD watches gitops repo → sees new commit                       │
│     → runs kubectl apply → K8s rolling update                          │
│         │                                                               │
│  8. KUBERNETES DEPLOYS                                                  │
│     ├── Starts new pods with new image                                  │
│     ├── Waits for readiness probes to pass                              │
│     ├── Shifts traffic to new pods                                      │
│     └── Terminates old pods                                             │
│         │                                                               │
│  9. OBSERVABILITY MONITORS                                              │
│     ├── Prometheus collects metrics every 15s                           │
│     ├── Grafana shows dashboards in real-time                           │
│     ├── Loki captures all pod logs                                      │
│     └── Alert fires to Slack if error rate spikes                       │
│                                                                         │
│  TOTAL TIME: Code push → Production = ~5-10 minutes ⚡                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Learning Roadmap

### Phase 1 — Foundation (Week 1-2)
- [ ] Run NexaBank locally without any DevOps
- [ ] Understand the app: read every file, understand every API
- [ ] Learn Git deeply: branches, PRs, merge conflicts
- [ ] Write one new API endpoint (e.g., account statement PDF)

### Phase 2 — Docker (Week 3-4)
- [ ] Write Dockerfile for backend
- [ ] Write multi-stage Dockerfile for frontend
- [ ] Write docker-compose.yml (backend + frontend + postgres)
- [ ] Replace SQLite with PostgreSQL via Docker
- [ ] Learn: `docker build`, `docker run`, `docker-compose`, networking

### Phase 3 — CI/CD (Week 5-6)
- [ ] Create GitHub Actions CI: run pytest + bandit on every push
- [ ] Add Trivy container scan to pipeline
- [ ] Create CD: build and push Docker image on merge to main
- [ ] Add GitHub Secrets for DockerHub credentials

### Phase 4 — Kubernetes (Week 7-9)
- [ ] Install minikube or kind locally
- [ ] Write Deployment and Service YAMLs for backend + frontend
- [ ] Deploy NexaBank to local K8s cluster
- [ ] Configure Ingress
- [ ] Try HPA (auto-scaling)
- [ ] Learn: `kubectl get`, `kubectl describe`, `kubectl logs`, rolling updates

### Phase 5 — Terraform (Week 10-12)
- [ ] Create free AWS account
- [ ] Write Terraform to create an EC2 instance
- [ ] Deploy NexaBank to that EC2 manually
- [ ] Write Terraform to create EKS cluster
- [ ] Deploy NexaBank to EKS via kubectl

### Phase 6 — Ansible (Week 13-14)
- [ ] Create 2 EC2 instances via Terraform
- [ ] Write Ansible playbook to install Python + deploy backend
- [ ] Write Ansible playbook to install Nginx + deploy frontend
- [ ] Practice: change code, re-run Ansible, see update apply

### Phase 7 — GitOps (Week 15-16)
- [ ] Create separate `nexabank-gitops` repo
- [ ] Install ArgoCD on your K8s cluster
- [ ] Connect ArgoCD to gitops repo
- [ ] Make a code change → watch the full GitOps flow happen automatically
- [ ] Practice rollback with `git revert`

### Phase 8 — Observability (Week 17-18)
- [ ] Add Prometheus metrics to FastAPI backend
- [ ] Deploy Prometheus + Grafana via Docker Compose
- [ ] Build a Grafana dashboard for NexaBank (API metrics)
- [ ] Set up a Slack alert for high error rate
- [ ] Add Loki + explore logs in Grafana

### Phase 9 — Security Deep Dive (Week 19-20)
- [ ] Add pre-commit hooks (GitLeaks + Bandit)
- [ ] Run OWASP ZAP against NexaBank staging
- [ ] Fix any vulnerabilities found
- [ ] Add Falco to K8s cluster
- [ ] Write a security scan GitHub Actions job

### Phase 10 — Full Integration
- [ ] Everything above is working end-to-end
- [ ] One `git push` triggers: tests → security scan → build → push image → ArgoCD deploys → Grafana monitors
- [ ] Write a blog post or LinkedIn post explaining what you built 🎉

---

## Tools Quick Reference

| Category | Tool | Install | Learn |
|---|---|---|---|
| Containerization | Docker | docker.com | docs.docker.com |
| Compose | Docker Compose | included with Docker | docs.docker.com/compose |
| CI/CD | GitHub Actions | github.com (free) | docs.github.com/actions |
| K8s Local | minikube | minikube.sigs.k8s.io | kubernetes.io/docs |
| K8s Cloud | EKS (AWS) | via Terraform | docs.aws.amazon.com/eks |
| IaC | Terraform | terraform.io | developer.hashicorp.com |
| Config Mgmt | Ansible | pip install ansible | docs.ansible.com |
| GitOps | ArgoCD | argocd.readthedocs.io | argo-cd.readthedocs.io |
| Metrics | Prometheus | prometheus.io | prometheus.io/docs |
| Dashboards | Grafana | grafana.com | grafana.com/docs |
| Logs | Loki | grafana.com/loki | grafana.com/docs/loki |
| SAST | Bandit | pip install bandit | bandit.readthedocs.io |
| Container Scan | Trivy | github.com/aquasecurity/trivy | aquasecurity.github.io/trivy |
| Secret Scan | GitLeaks | github.com/gitleaks/gitleaks | github.com/gitleaks |
| LLM | Ollama | ollama.com | ollama.com/docs |

---

## Final Note

> DevSecOps is not a set of tools. It's a **culture and mindset**.
> The tools are just how you implement that mindset at scale.
>
> The mindset is:
> - **Automate everything** that can be automated
> - **Security is everyone's job**, not just the security team's
> - **Fail fast** — catch problems in dev, not production
> - **Git is truth** — if it's not in Git, it doesn't exist
> - **Measure everything** — you can't improve what you don't measure
>
> Build this project end-to-end, from a simple `uvicorn main:app` to a
> fully automated, secured, monitored, auto-scaling production deployment.
>
> That journey IS the learning. 🚀

---

*Built with ❤️ as a DevSecOps learning project | NexaBank AI*
# ai-nexabankApp
