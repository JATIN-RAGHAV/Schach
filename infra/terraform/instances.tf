resource "aws_instance" "walrus"{

  depends_on = [
    local_sensitive_file.walrus_certificate,
    local_sensitive_file.walrus_key,
    local_sensitive_file.schach_walrus_certificate,
    local_sensitive_file.schach_walrus_key,
    local_sensitive_file.backend_walrus_certificate,
    local_sensitive_file.backend_walrus_key
  ]

  ami = var.ami_id
  instance_type = var.instance_type
  subnet_id = aws_subnet.main.id
  vpc_security_group_ids = [aws_security_group.ssh.id]

  associate_public_ip_address = true

  key_name = aws_key_pair.aws_key.key_name


  root_block_device {
    volume_type = "gp3"
    delete_on_termination = true
    volume_size = 20
    
    tags = {
      Name = "main"
    }
  }


  user_data = file("./initial.sh")

  tags = {
    Name = "walrus"
  }

  # Putting the certificates on the instance
  connection{
    type = "ssh"
    user = "ubuntu"
    host = self.public_ip
    private_key = var.private_key_ssh
    port = 4321
  }

  provisioner "file"{
    source = local_sensitive_file.walrus_certificate.filename
    destination = "/home/ubuntu/walrus.codes.crt"
  }

  provisioner "file"{
    source = local_sensitive_file.walrus_key.filename
    destination = "/home/ubuntu/walrus.codes.key"
  }

  provisioner "file"{
    source = local_sensitive_file.schach_walrus_certificate.filename
    destination = "/home/ubuntu/schach.walrus.codes.crt"
  }

  provisioner "file"{
    source = local_sensitive_file.schach_walrus_key.filename
    destination = "/home/ubuntu/schach.walrus.codes.key"
  }

  provisioner "file"{
    source = local_sensitive_file.backend_walrus_certificate.filename
    destination = "/home/ubuntu/backend-schach.walrus.codes.crt"
  }

  provisioner "file"{
    source = local_sensitive_file.backend_walrus_key.filename
    destination = "/home/ubuntu/backend-schach.walrus.codes.key"
  }

  provisioner "remote-exec"{
    inline = [
      "sudo mv /home/ubuntu/walrus.codes.crt /etc/ssl/certs/walrus.codes.crt",
      "sudo mv /home/ubuntu/walrus.codes.key /etc/ssl/certs/walrus.codes.key",
      "sudo mv /home/ubuntu/schach.walrus.codes.crt /etc/ssl/certs/schach.walrus.codes.crt",
      "sudo mv /home/ubuntu/schach.walrus.codes.key /etc/ssl/certs/schach.walrus.codes.key",
      "sudo mv /home/ubuntu/backend-schach.walrus.codes.crt /etc/ssl/certs/backend-schach.walrus.codes.crt",
      "sudo mv /home/ubuntu/backend-schach.walrus.codes.key /etc/ssl/certs/backend-schach.walrus.codes.key"
    ]
  }
}
