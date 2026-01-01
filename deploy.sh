#!/bin/bash
# DigitalJamath Production Deployment Script
# Usage: ./deploy.sh

set -e

echo "🚀 Pulling latest images from GitHub Container Registry..."
docker-compose -f docker-compose.prod.yml pull frontend

echo "🔄 Restarting frontend service..."
docker-compose -f docker-compose.prod.yml up -d frontend

echo "✅ Deployment complete!"
echo ""
echo "To deploy all services (including backend updates):"
echo "  docker-compose -f docker-compose.prod.yml up -d --build"
