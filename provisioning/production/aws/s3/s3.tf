resource "aws_s3_bucket" "meicm_bookmanager_frontend" {
  bucket = var.bucket
  region = var.region
  acl    = "public-read"
  force_destroy = true
  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::bookmananger-meicm-frontend/*"
            ]
        }
    ]
}
EOF

  website {
    index_document = "index.html"
    error_document = "error.html"
  }

  provisioner "local-exec" {
    command = <<EOT
aws s3 cp ${var.frontend_folder}/ s3://${var.bucket} --recursive --exclude "Docker*" --exclude "proxy*" 
EOT
  }
}

output "aws_s3_website_endpoint" {
  value       = aws_s3_bucket.meicm_bookmanager_frontend.website_endpoint
  description = "ECR URL"
}
