provider "aws"{
  region = var.aws_region
}

provider "acme"{
  server_url = var.acme_server_url
}

provider "namedotcom" {
  username = var.namecom_username
  token = var.namecom_api_token
}
