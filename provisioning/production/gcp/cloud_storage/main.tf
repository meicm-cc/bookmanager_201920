provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_storage_bucket" "bookmananger-meicm-frontend" {
  name          = var.bucket
  location      = var.location
  storage_class = "STANDARD"
  force_destroy = true

  bucket_policy_only = false

  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  cors {
    origin          = ["*"]
    method          = ["GET"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  provisioner "local-exec" {
    command = <<EOT
gsutil iam ch allUsers:objectViewer gs://${var.bucket}
gsutil cp ${var.frontend_folder}/*.html gs://${var.bucket}
gsutil cp -r ${var.frontend_folder}/css/* gs://${var.bucket}/css/
gsutil cp -r ${var.frontend_folder}/js/* gs://${var.bucket}/js/
gsutil cp -r ${var.frontend_folder}/vendor/* gs://${var.bucket}/vendor/
EOT
  }
}

resource "google_storage_bucket_access_control" "public_rule" {
  bucket = google_storage_bucket.bookmananger-meicm-frontend.name
  role   = "READER"
  entity = "allUsers"
}

output "self_link" {
  value       = replace(replace(google_storage_bucket.bookmananger-meicm-frontend.self_link,"storage/v1/b/",""),"www","storage")
  description = "Bucket Self Link"
}



