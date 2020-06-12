resource "aws_ecr_repository" "meicm_bookmanager" {
  name                 = "meicm_bookmanager"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository_policy" "meicm_ecr_policy" {
  repository = "${aws_ecr_repository.meicm_bookmanager.name}"

  policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "new policy",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:DescribeRepositories",
                "ecr:GetRepositoryPolicy",
                "ecr:ListImages",
                "ecr:DeleteRepository",
                "ecr:BatchDeleteImage",
                "ecr:SetRepositoryPolicy",
                "ecr:DeleteRepositoryPolicy"
            ]
        }
    ]
}
EOF
}


output "aws_container_registry_arn" {
  value       = aws_ecr_repository.meicm_bookmanager.arn
  description = "ECR ARN"
}
output "aws_container_registry_id" {
  value       = aws_ecr_repository.meicm_bookmanager.registry_id
  description = "ECR ID"
}
output "aws_container_repository_url" {
  value       = aws_ecr_repository.meicm_bookmanager.repository_url
  description = "ECR URL"
}
