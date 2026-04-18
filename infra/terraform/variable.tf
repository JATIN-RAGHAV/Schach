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
