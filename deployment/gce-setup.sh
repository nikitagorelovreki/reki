#!/bin/bash

# Google Cloud Platform setup script for Reki deployment

set -e

PROJECT_ID="reki-medical-platform"
REGION="us-central1"
CLUSTER_NAME="reki-cluster"

echo "Setting up GCP resources for Reki..."

# 1. Create GKE cluster
echo "Creating GKE cluster..."
gcloud container clusters create $CLUSTER_NAME \
  --project=$PROJECT_ID \
  --zone=$REGION-a \
  --num-nodes=3 \
  --enable-autoscaling \
  --min-nodes=1 \
  --max-nodes=5 \
  --machine-type=e2-standard-2 \
  --enable-network-policy \
  --enable-ip-alias \
  --enable-autorepair \
  --enable-autoupgrade

# 2. Configure kubectl
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$REGION-a --project=$PROJECT_ID

# 3. Create Cloud SQL instance
echo "Creating Cloud SQL PostgreSQL instance..."
gcloud sql instances create reki-postgres \
  --database-version=POSTGRES_16 \
  --tier=db-g1-small \
  --region=$REGION \
  --storage-size=20GB \
  --storage-type=SSD \
  --backup-start-time=03:00 \
  --enable-bin-log \
  --retained-backups-count=7

# 4. Create database
gcloud sql databases create reki --instance=reki-postgres

# 5. Create database user
gcloud sql users create reki-user \
  --instance=reki-postgres \
  --password=$(openssl rand -base64 32)

# 6. Enable APIs
echo "Enabling required APIs..."
gcloud services enable container.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable aiplatform.googleapis.com

# 7. Build and push Docker images
echo "Building Docker images..."
docker build -f packages/app-core-server/Dockerfile -t gcr.io/$PROJECT_ID/reki-core:latest .
docker build -f packages/app-auth-server/Dockerfile -t gcr.io/$PROJECT_ID/reki-auth:latest .

docker push gcr.io/$PROJECT_ID/reki-core:latest
docker push gcr.io/$PROJECT_ID/reki-auth:latest

# 8. Create Kubernetes secrets
kubectl create secret generic reki-secrets \
  --from-literal=database-url="postgresql://reki-user:PASSWORD@INSTANCE_IP:5432/reki" \
  --from-literal=jwt-secret=$(openssl rand -base64 64)

# 9. Deploy applications
kubectl apply -f deployment/gce-deployment.yml

echo "Deployment complete! Check status with:"
echo "kubectl get pods"
echo "kubectl get services"
