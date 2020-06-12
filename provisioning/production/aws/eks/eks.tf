resource "aws_eks_cluster" "meicm_bookmanager_eks" {
  name     = var.cluster
  role_arn = aws_iam_role.meicm_cluster.arn

  vpc_config {
    security_group_ids = [aws_security_group.meicm.id]
    subnet_ids         = aws_subnet.meicm[*].id
  }

  depends_on = [
    aws_iam_role_policy_attachment.meicm-AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.meicm-AmazonEKSServicePolicy,
  ]
}

resource "aws_eks_node_group" "meicm" {
  cluster_name    = aws_eks_cluster.meicm_bookmanager_eks.name
  node_group_name = "meicm"
  node_role_arn   = aws_iam_role.meicm_worker_nodes.arn
  subnet_ids      = aws_subnet.meicm[*].id

  scaling_config {
    desired_size = 1
    max_size     = 1
    min_size     = 1
  }

  tags = {
    "kubernetes.io/cluster/meicm_bookmanager_eks" = "owned"
  }

  depends_on = [
    aws_iam_role_policy_attachment.meicm-AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.meicm-AmazonEKS_CNI_Policy,
    aws_iam_role_policy_attachment.meicm-AmazonEC2ContainerRegistryReadOnly
  ]
}



resource "aws_iam_role" "meicm_cluster" {
  name = "meicm_cluster"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "eks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}


resource "aws_iam_role" "meicm_worker_nodes" {
  name = "meicm_worker_nodes"

  assume_role_policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
POLICY
}


resource "aws_iam_role_policy_attachment" "meicm-AmazonEKSClusterPolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.meicm_cluster.name
}

resource "aws_iam_role_policy_attachment" "meicm-AmazonEKSServicePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSServicePolicy"
  role       = aws_iam_role.meicm_cluster.name
}

resource "aws_iam_role_policy_attachment" "meicm-AmazonEKSWorkerNodePolicy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.meicm_worker_nodes.name
}

resource "aws_iam_role_policy_attachment" "meicm-AmazonEKS_CNI_Policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.meicm_worker_nodes.name
}

resource "aws_iam_role_policy_attachment" "meicm-AmazonEC2ContainerRegistryReadOnly" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.meicm_worker_nodes.name
}


resource "aws_security_group" "meicm" {
  name = "meicm"
  description = "MEICM Security Group"

  vpc_id      = aws_vpc.meicm.id
  
  ingress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["144.64.111.7/32"]
  }
  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

locals {
  config_map_aws_auth = <<CONFIGMAPAWSAUTH
apiVersion: v1
kind: ConfigMap
metadata:
  name: aws-auth
  namespace: kube-system
data:
  mapRoles: |
    - rolearn: ${aws_iam_role.meicm_worker_nodes.arn}
      username: system:node:{{EC2PrivateDNSName}}
      groups:
        - system:bootstrappers
        - system:nodes
CONFIGMAPAWSAUTH

  kubeconfig = <<KUBECONFIG
apiVersion: v1
clusters:
- cluster:
    server: ${aws_eks_cluster.meicm_bookmanager_eks.endpoint}
    certificate-authority-data: ${aws_eks_cluster.meicm_bookmanager_eks.certificate_authority.0.data}
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: aws
  name: aws
current-context: aws
kind: Config
preferences: {}
users:
- name: aws
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1alpha1
      command: aws-iam-authenticator
      args:
        - "token"
        - "-i"
        - "${var.cluster}"
KUBECONFIG
}

output "endpoint" {
  value = aws_eks_cluster.meicm_bookmanager_eks.endpoint
}

output "kubeconfig-certificate-authority-data" {
  value = aws_eks_cluster.meicm_bookmanager_eks.certificate_authority.0.data
}

output "config_map_aws_auth" {
  value = local.config_map_aws_auth
}

output "kubeconfig" {
  value = local.kubeconfig
}
