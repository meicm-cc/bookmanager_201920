#!/bin/bash

VERSION="1.0.4"

SERVICE_IMAGE_GATEWAY="bookmanager_gateway_service:$VERSION"
SERVICE_IMAGE_AUTHENTICATION="bookmanager_authentication_service:$VERSION"
SERVICE_IMAGE_DATA_GATHERER="bookmanager_data_gatherer_service:$VERSION"
SERVICE_IMAGE_HISTORY="bookmanager_history_service:$VERSION"
SERVICE_IMAGE_SEARCH="bookmanager_search_service:$VERSION"
SERVICE_IMAGE_STATISTICS="bookmanager_statistics_service:$VERSION"
SERVICE_IMAGE_TRACKING="bookmanager_tracking_service:$VERSION"

SERVICE_IMAGE_GATEWAY_TAG="bookmanager_gateway_service_$VERSION"
SERVICE_IMAGE_AUTHENTICATION_TAG="bookmanager_authentication_service_$VERSION"
SERVICE_IMAGE_DATA_GATHERER_TAG="bookmanager_data_gatherer_service_$VERSION"
SERVICE_IMAGE_HISTORY_TAG="bookmanager_history_service_$VERSION"
SERVICE_IMAGE_SEARCH_TAG="bookmanager_search_service_$VERSION"
SERVICE_IMAGE_STATISTICS_TAG="bookmanager_statistics_service_$VERSION"
SERVICE_IMAGE_TRACKING_TAG="bookmanager_tracking_service_$VERSION"

AWS_ECR_ID=228513434769
REGION="eu-west-1"
ECR_NAME="meicm_bookmanager"

echo "Pushing images to AWS Container Registry"

echo "Pushing Frontend"
docker tag $SERVICE_IMAGE_GATEWAY "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_GATEWAY_TAG"
docker push "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_GATEWAY_TAG"

echo "Pushing Services"
docker tag $SERVICE_IMAGE_AUTHENTICATION "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_AUTHENTICATION_TAG"
docker push "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_AUTHENTICATION_TAG"
docker tag $SERVICE_IMAGE_DATA_GATHERER "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_DATA_GATHERER_TAG"
docker push "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_DATA_GATHERER_TAG"
docker tag $SERVICE_IMAGE_HISTORY "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_HISTORY_TAG"
docker push "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_HISTORY_TAG"
docker tag $SERVICE_IMAGE_SEARCH "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_SEARCH_TAG"
docker push "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_SEARCH_TAG"
docker tag $SERVICE_IMAGE_STATISTICS "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_STATISTICS_TAG"
docker push "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_STATISTICS_TAG"
docker tag $SERVICE_IMAGE_TRACKING "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_TRACKING_TAG"
docker push "$AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com/$ECR_NAME:$SERVICE_IMAGE_TRACKING_TAG"
