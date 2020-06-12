# AWS EKS Configuration

## Worker node EC2 Role
https://docs.aws.amazon.com/eks/latest/userguide/worker_node_IAM_role.html



## Policy to add to your user 

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "eksadministrator",
            "Effect": "Allow",
            "Action": "eks:*",
            "Resource": "*"
        }
    ]
}
```

## After EKS Builds

run get_kubectl_context.sh

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-0.32.0/deploy/static/provider/aws/deploy.yaml

kubectl create -f <path_to_folder> --save-config
