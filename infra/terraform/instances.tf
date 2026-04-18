resource "aws_instance" "walrus"{
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
}
