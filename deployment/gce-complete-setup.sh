#!/bin/bash

# Complete GCP setup script for Reki deployment
# Run this after setting up GCP account and gcloud CLI

set -e

# Configuration
PROJECT_ID="${PROJECT_ID:-reki-medical-platform}"
REGION="${REGION:-us-central1}"
ZONE="${ZONE:-us-central1-a}"
CLUSTER_NAME="reki-cluster"
DB_INSTANCE="${DB_INSTANCE:-reki-postgres-17}"

echo "🚀 Starting complete Reki deployment to GCP..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"

# Check if gcloud is configured
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Please run 'gcloud auth login' first"
    exit 1
fi

# Set project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable \
    container.googleapis.com \
    sqladmin.googleapis.com \
    cloudresourcemanager.googleapis.com \
    compute.googleapis.com \
    aiplatform.googleapis.com \
    cloudbuild.googleapis.com \
    containerregistry.googleapis.com

# Create GKE cluster
echo "🏗️  Creating GKE cluster..."
if ! gcloud container clusters describe $CLUSTER_NAME --zone=$ZONE &>/dev/null; then
    gcloud container clusters create $CLUSTER_NAME \
        --zone=$ZONE \
        --num-nodes=2 \
        --enable-autoscaling \
        --min-nodes=1 \
        --max-nodes=5 \
        --machine-type=e2-standard-2 \
        --enable-network-policy \
        --enable-ip-alias \
        --enable-autorepair \
        --enable-autoupgrade \
        --disk-size=20GB \
        --preemptible
    echo "✅ GKE cluster created"
else
    echo "ℹ️  GKE cluster already exists"
fi

# Get cluster credentials
gcloud container clusters get-credentials $CLUSTER_NAME --zone=$ZONE

# Create Cloud SQL instance
echo "🗄️  Creating Cloud SQL instance..."
if ! gcloud sql instances describe $DB_INSTANCE &>/dev/null; then
    # Generate random password
    DB_PASSWORD=$(openssl rand -base64 32)
    
    gcloud sql instances create $DB_INSTANCE \
        --database-version=POSTGRES_16 \
        --tier=db-f1-micro \
        --region=$REGION \
        --storage-size=10GB \
        --storage-type=SSD \
        --backup-start-time=03:00 \
        --retained-backups-count=7 \
        --root-password="$DB_PASSWORD"
    
    # Create database
    gcloud sql databases create reki --instance=$DB_INSTANCE
    
    # Create user
    gcloud sql users create reki-user \
        --instance=$DB_INSTANCE \
        --password="$DB_PASSWORD"
    
    echo "✅ Cloud SQL instance created"
    echo "🔐 Database password: $DB_PASSWORD"
    echo "📝 Save this password - you'll need it for secrets!"
else
    echo "ℹ️  Cloud SQL instance already exists"
fi

# Get database connection info
DB_IP=$(gcloud sql instances describe $DB_INSTANCE --format="value(ipAddresses[0].ipAddress)")
DATABASE_URL="postgresql://reki-user:CHANGE_PASSWORD@$DB_IP:5432/reki"

# Build and push Docker images
echo "🐳 Building Docker images..."
docker build -f packages/app-core-server/Dockerfile -t gcr.io/$PROJECT_ID/reki-core:latest .
docker build -f packages/app-auth-server/Dockerfile -t gcr.io/$PROJECT_ID/reki-auth:latest .

echo "📤 Pushing images to Google Container Registry..."
docker push gcr.io/$PROJECT_ID/reki-core:latest
docker push gcr.io/$PROJECT_ID/reki-auth:latest

# Create namespace
kubectl create namespace reki-production --dry-run=client -o yaml | kubectl apply -f -

# Create secrets (you'll need to update these manually)
echo "🔐 Creating Kubernetes secrets template..."
kubectl create secret generic reki-secrets \
    --namespace=reki-production \
    --from-literal=database-url="$DATABASE_URL" \
    --from-literal=jwt-secret=$(openssl rand -base64 64) \
    --from-literal=encrypt-secret=$(openssl rand -base64 32) \
    --dry-run=client -o yaml > deployment/reki-secrets.yaml

echo "⚠️  Please update deployment/reki-secrets.yaml with real database password!"

# Deploy to Kubernetes
echo "🚀 Deploying to Kubernetes..."
# Update deployment file with project ID
sed "s/PROJECT_ID/$PROJECT_ID/g" deployment/gce-deployment.yml | kubectl apply -f - -n reki-production

# Wait for deployments
echo "⏳ Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/reki-core-server -n reki-production
kubectl wait --for=condition=available --timeout=300s deployment/reki-auth-server -n reki-production

# Get external IPs
echo "🌐 Getting service endpoints..."
CORE_IP=$(kubectl get service reki-core-service -n reki-production -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
AUTH_IP=$(kubectl get service reki-auth-service -n reki-production -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

# Wait for external IPs to be assigned
echo "⏳ Waiting for external IPs to be assigned..."
while [ -z "$CORE_IP" ] || [ -z "$AUTH_IP" ]; do
    echo "  Still waiting for LoadBalancer IPs..."
    sleep 10
    CORE_IP=$(kubectl get service reki-core-service -n reki-production -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    AUTH_IP=$(kubectl get service reki-auth-service -n reki-production -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
done

echo "✅ Backend services deployed!"
echo "📡 Core API: http://$CORE_IP"
echo "🔐 Auth API: http://$AUTH_IP"

# Deploy Frontend to Firebase
echo ""
echo "🎨 Deploying frontend to Firebase Hosting..."

# Install Firebase CLI if needed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Login to Firebase (interactive)
echo "🔧 Please login to Firebase..."
firebase login

# Initialize Firebase if needed
if [ ! -f "firebase.json" ]; then
    echo "🔧 Initializing Firebase..."
    firebase init hosting --project $PROJECT_ID
fi

# Build frontend with production environment
echo "🏗️  Building frontend..."
cd packages/app-control-panel

# Create production environment file with real API URLs
cat > .env.production << EOF
REACT_APP_AUTH_API_URL=http://$AUTH_IP
REACT_APP_CORE_API_URL=http://$CORE_IP
REACT_APP_ENVIRONMENT=production
EOF

# Install dependencies and build
npm ci
npm run build

# Deploy to Firebase
echo "🚀 Deploying frontend to Firebase Hosting..."
firebase deploy --only hosting --project $PROJECT_ID

cd ../..

echo ""
echo "✅ Complete deployment finished!"
echo "📡 Core API: http://$CORE_IP"
echo "🔐 Auth API: http://$AUTH_IP"
echo "🌐 Frontend: https://$PROJECT_ID.web.app"
echo "📊 Kubernetes Dashboard: kubectl proxy --port=8001"
echo ""
echo "🔧 Next steps:"
echo "1. Configure custom domain and SSL certificates"
echo "2. Run database migrations"
echo "3. Set up monitoring alerts"
echo ""
echo "🎯 Commands to remember:"
echo "kubectl get pods -n reki-production"
echo "kubectl logs -f deployment/reki-core-server -n reki-production"
echo "kubectl logs -f deployment/reki-auth-server -n reki-production"
