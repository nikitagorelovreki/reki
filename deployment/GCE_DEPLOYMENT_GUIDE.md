# 🚀 Google Cloud Engine Deployment Guide for Reki

## 📋 Complete Deployment Plan

### Phase 1: Initial Setup (15 minutes)
```bash
# 1. Create GCP account and project
# Visit: console.cloud.google.com
# Create project: reki-medical-platform
# Enable billing

# 2. Install and configure gcloud CLI
curl https://sdk.cloud.google.com | bash
source ~/.bashrc
gcloud auth login
gcloud config set project reki-medical-platform
```

### Phase 2: Automated Infrastructure (10 minutes)
```bash
# Run complete setup script
chmod +x deployment/gce-complete-setup.sh
export PROJECT_ID="reki-medical-platform"
export REGION="us-central1"
./deployment/gce-complete-setup.sh
```

**This script automatically creates:**
- ✅ GKE Kubernetes cluster (2 nodes, auto-scaling 1-5)
- ✅ Cloud SQL PostgreSQL instance
- ✅ Container Registry and Docker images
- ✅ Load balancers and networking
- ✅ Basic security and secrets

### Phase 3: Configuration (5 minutes)
```bash
# 1. Update database password in secrets
# Edit: deployment/reki-secrets.yaml
# Replace CHANGE_PASSWORD with actual password from script output

# 2. Apply secrets
kubectl apply -f deployment/reki-secrets.yaml

# 3. Update frontend environment variables
# Will be done automatically by CI/CD
```

### Phase 4: CI/CD Setup (5 minutes)
```bash
# Add these secrets to GitHub repository:
# Settings → Secrets and variables → Actions

GCP_PROJECT_ID=reki-medical-platform
GCP_SA_KEY=<service-account-json-key>
AUTH_API_URL=https://your-auth-domain.com
CORE_API_URL=https://your-core-domain.com
FIREBASE_SERVICE_ACCOUNT=<firebase-service-account-json>
```

## 🎯 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Hosting                        │
│                  (React Frontend)                          │
├─────────────────────────────────────────────────────────────┤
│                  Google Load Balancer                      │
│                     (SSL + CDN)                            │
├─────────────────────────────────────────────────────────────┤
│               Google Kubernetes Engine                     │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │   Auth Server   │    │      Core Server              │ │
│  │   (Port 3001)   │    │      (Port 3002)              │ │
│  │   2 replicas    │    │      2 replicas               │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Cloud SQL PostgreSQL                    │
│                  (Managed Database)                        │
├─────────────────────────────────────────────────────────────┤
│              Vertex AI / PaLM API                          │
│               (AI Integration)                             │
└─────────────────────────────────────────────────────────────┘
```

## 💰 Cost Breakdown (Monthly)

| Service | Configuration | Cost |
|---------|---------------|------|
| GKE Cluster | 2 x e2-standard-2 nodes | ~$70 |
| Cloud SQL | db-f1-micro PostgreSQL | ~$15 |
| Load Balancer | 2 x regional LB | ~$20 |
| Container Registry | Image storage | ~$5 |
| Firebase Hosting | Static files + CDN | ~$0 |
| Vertex AI | Pay-per-use | ~$10-50 |
| **Total** | | **~$120-160** |

## 🔄 Easy Environment Cloning

### Create New Client Instance:
```bash
# 1. Clone production to new environment
export CLIENT_NAME="client-demo"
export NAMESPACE="reki-$CLIENT_NAME"

# 2. Create namespace and copy secrets
kubectl create namespace $NAMESPACE
kubectl get secret reki-secrets -n reki-production -o yaml | \
  sed "s/namespace: reki-production/namespace: $NAMESPACE/" | \
  kubectl apply -f -

# 3. Deploy services to new namespace
sed "s/reki-production/$NAMESPACE/g" deployment/gce-deployment.yml | \
  kubectl apply -f -

# 4. Get new service URLs
kubectl get services -n $NAMESPACE
```

### Result: 
- **New database instance** (separate data)
- **Dedicated URLs** for client
- **Independent scaling** and configuration
- **Time to deploy**: ~5 minutes

## 🤖 AI Integration Features

### Vertex AI Setup:
```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Deploy AI service
kubectl apply -f deployment/gce-ai-integration.yaml
```

### Available AI Models:
- **PaLM 2 for Text** - Medical document analysis
- **PaLM 2 for Chat** - Patient consultation assistant
- **AutoML** - Custom medical device recognition
- **Document AI** - Form processing automation

## 📊 Monitoring & Operations

### Built-in Monitoring:
```bash
# View logs
kubectl logs -f deployment/reki-core-server -n reki-production

# Check resource usage
kubectl top pods -n reki-production

# Scale services
kubectl scale deployment reki-core-server --replicas=3 -n reki-production
```

### GCP Console:
- **GKE Dashboard**: Cluster overview and scaling
- **Cloud SQL**: Database performance and backups
- **Cloud Logging**: Centralized application logs
- **Cloud Monitoring**: Alerting and dashboards

## 🚨 Emergency Procedures

### Quick Rollback:
```bash
# Rollback to previous version
kubectl rollout undo deployment/reki-core-server -n reki-production
kubectl rollout undo deployment/reki-auth-server -n reki-production
```

### Database Recovery:
```bash
# Restore from automatic backup
gcloud sql backups restore BACKUP_ID --restore-instance=reki-postgres
```

### Scale Down (Cost Saving):
```bash
# Scale to minimum resources
kubectl scale deployment reki-core-server --replicas=1 -n reki-production
kubectl scale deployment reki-auth-server --replicas=1 -n reki-production
```

## ✅ Success Checklist

- [ ] GCP project created and billing enabled
- [ ] gcloud CLI installed and authenticated
- [ ] Infrastructure deployment script completed successfully
- [ ] Database password updated in secrets
- [ ] GitHub Actions secrets configured
- [ ] First deployment pushed to main branch
- [ ] Frontend accessible via Firebase URL
- [ ] API endpoints responding to health checks
- [ ] SSL certificates automatically provisioned
- [ ] Monitoring dashboards showing data

## 🎯 Next Steps After Deployment

1. **Custom Domain**: Point DNS to Load Balancer IPs
2. **SSL Certificate**: Automatic via Google-managed certificates
3. **Database Migration**: Run via Kubernetes job
4. **AI Integration**: Configure Vertex AI service account
5. **Monitoring Alerts**: Set up budget and performance alerts
6. **Backup Testing**: Verify database backup/restore procedures

**Total setup time**: ~35 minutes
**Time to deploy new client**: ~5 minutes
**Monthly cost**: ~$120-160
