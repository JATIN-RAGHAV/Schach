# VPC
resource "aws_vpc" "main"{
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "main"
  }
}

# Subnet
resource "aws_subnet" "main"{
  vpc_id = aws_vpc.main.id
  cidr_block = "10.0.0.0/24"

  tags = {
    Name = "main"
  }
}

# Gateway
resource "aws_internet_gateway" "internet_gw"{
   vpc_id = aws_vpc.main.id

  tags = {
    Name = "internet_gw"
  }
}

# Route
resource "aws_route_table" "internet" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.internet_gw.id
  }
}

# Add route table to the main subnet
resource "aws_route_table_association" "internet" {
  subnet_id = aws_subnet.main.id
  route_table_id = aws_route_table.internet.id
}

# Security groups
resource "aws_security_group" "ssh" { 
  name = "ssh"
  description = "allows ssh connection"
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "ssh"
  }
}

resource "aws_vpc_security_group_ingress_rule" "ssh"{
  security_group_id = aws_security_group.ssh.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port = 22
  to_port = 22
}

resource "aws_vpc_security_group_ingress_rule" "http"{
  security_group_id = aws_security_group.ssh.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port = 80
  to_port = 80
}

resource "aws_vpc_security_group_ingress_rule" "https"{
  security_group_id = aws_security_group.ssh.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port = 443
  to_port = 443
}

resource "aws_vpc_security_group_ingress_rule" "new_ssh"{
  security_group_id = aws_security_group.ssh.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "tcp"
  from_port = 4321
  to_port = 4321
}

resource "aws_vpc_security_group_egress_rule" "ssh"{
  security_group_id = aws_security_group.ssh.id
  cidr_ipv4 = "0.0.0.0/0"
  ip_protocol = "-1"
}
