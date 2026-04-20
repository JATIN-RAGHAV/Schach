resource "tls_private_key" "main_key"{
  algorithm = "RSA"
  rsa_bits = 4096
}

resource "aws_key_pair" "aws_key"{
  key_name = "aws_key"
  public_key = var.ssh_public_key
}
