#!/bin/bash

# Deploy React frontend to Firebase Hosting
# Alternative to App Engine for better performance

set -e

PROJECT_ID="${PROJECT_ID:-reki-medical-platform}"

echo "🎨 Deploying Reki frontend to Firebase Hosting..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Initialize Firebase (run once)
if [ ! -f "firebase.json" ]; then
    echo "🔧 Initializing Firebase..."
    firebase init hosting --project $PROJECT_ID
fi

# Build frontend with production environment
echo "🏗️  Building frontend..."
cd packages/app-control-panel

# Create production environment file
cat > .env.production << EOF
REACT_APP_AUTH_API_URL=https://reki-auth.your-domain.com
REACT_APP_CORE_API_URL=https://reki-core.your-domain.com
REACT_APP_ENVIRONMENT=production
EOF

# Build
npm run build

# Deploy to Firebase
echo "🚀 Deploying to Firebase Hosting..."
firebase deploy --only hosting --project $PROJECT_ID

echo "✅ Frontend deployed successfully!"
echo "🌐 Your app is live at: https://$PROJECT_ID.web.app"
