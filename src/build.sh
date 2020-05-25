#!/bin/bash

FRONTEND_IMAGE="bookmanager_frontend:1.0.0"
SERVICE_IMAGE_AUTHENTICATION="bookmanager_authentication_service:1.0.0"
SERVICE_IMAGE_DATA_GATHERER="bookmanager_data_gatherer_service:1.0.0"
SERVICE_IMAGE_HISTORY="bookmanager_history_service:1.0.0"
SERVICE_IMAGE_SEARCH="bookmanager_search_service:1.0.0"
SERVICE_IMAGE_STATISTICS="bookmanager_statistics_service:1.0.0"
SERVICE_IMAGE_TRACKING="bookmanager_tracking_service:1.0.0"

echo "Local Docker Image Building"

echo "Bulding Frontend"
docker build -t $FRONTEND_IMAGE ./frontend

echo "Bulding Services"
docker build -t $SERVICE_IMAGE_AUTHENTICATION ./services/authentication
docker build -t $SERVICE_IMAGE_DATA_GATHERER ./services/data_gatherer
docker build -t $SERVICE_IMAGE_HISTORY ./services/history
docker build -t $SERVICE_IMAGE_SEARCH ./services/search
docker build -t $SERVICE_IMAGE_STATISTICS ./services/statistics
docker build -t $SERVICE_IMAGE_TRACKING ./services/tracking


echo "DONE - Local Docker Image Building"
