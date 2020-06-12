#!/bin/bash

REGION=eu-west-1
AWS_ECR_ID=228513434769

aws ecr get-login-password --region "$REGION" | docker login --username AWS --password-stdin $AWS_ECR_ID.dkr.ecr.$REGION.amazonaws.com
