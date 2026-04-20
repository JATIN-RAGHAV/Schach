variable "aws_region"{
  type = string
  description = "AWS Region"
  default = "ap-south-1"
}

variable "instance_type"{
  type = string
  description = "Instance Type"
  default = "t3.micro"
}

variable "ami_id" {
  type = string
  description = "AMI ID"
  default = "ami-05d2d839d4f73aafb"
}

variable "acme_server_url" {
  type = string
  description = "ACME Server URL"
  default = "https://acme-v02.api.letsencrypt.org/directory"
}

variable "namecom_username" {
  sensitive = true
  type = string
}

variable "namecom_api_token" {
  sensitive = true
  type = string
}

variable "private_key_ssh"{
  description = "SSH private key for the aws instance"
  sensitive = true
  type = string
}

variable "ssh_public_key"{
  description = "SSH public key for the aws instance"
  sensitive = true
  type = string
}
