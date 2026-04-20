terraform {
  backend "s3"{
    bucket = "terraformstatehellotherewalrusherewithtfstate"
    dynamodb_table = "terraform-db-hellotherewalrusherewithtfstate"
    key = "infra/terraform/terraform."
    region = "ap-south-1"
    encrypt = true
  }

  required_version = ">=1.13.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }

    acme = {
      source  = "vancluever/acme"
      version = "~> 2.0"
    }

    tls = {
      source = "hashicorp/tls"
      version = "~> 4.0"
    }
    
    namedotcom = {
      source = "lexfrei/namedotcom"
      version = "~>1.1.6"
    }

    local = {
      source = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}
