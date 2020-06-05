#!/bin/bash

VERSION="1.0.4"

SERVICE_IMAGE_GATEWAY="bookmanager_gateway_service:$VERSION"
SERVICE_IMAGE_AUTHENTICATION="bookmanager_authentication_service:$VERSION"
SERVICE_IMAGE_DATA_GATHERER="bookmanager_data_gatherer_service:$VERSION"
SERVICE_IMAGE_HISTORY="bookmanager_history_service:$VERSION"
SERVICE_IMAGE_SEARCH="bookmanager_search_service:$VERSION"
SERVICE_IMAGE_STATISTICS="bookmanager_statistics_service:$VERSION"
SERVICE_IMAGE_TRACKING="bookmanager_tracking_service:$VERSION"

echo "Local Docker Image Building"

echo "Bulding Api Gateway"
docker build -t $SERVICE_IMAGE_GATEWAY -f ./frontend/DockerfileProxyCloudFrontend ./frontend

echo "Bulding Services"
docker build -t $SERVICE_IMAGE_AUTHENTICATION ./services/authentication
docker build -t $SERVICE_IMAGE_DATA_GATHERER ./services/data_gatherer
docker build -t $SERVICE_IMAGE_HISTORY ./services/history
docker build -t $SERVICE_IMAGE_SEARCH ./services/search
docker build -t $SERVICE_IMAGE_STATISTICS ./services/statistics
docker build -t $SERVICE_IMAGE_TRACKING ./services/tracking


echo "DONE - Local Docker Image Building"
