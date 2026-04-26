resource "namedotcom_record" "walrus_codes"{
  domain_name = "walrus.codes"
  host = ""
  record_type = "A"
  answer = aws_instance.walrus.public_ip
}

resource "namedotcom_record" "walrus_schach_FE"{
  domain_name = "walrus.codes"
  host = "schach"
  record_type = "A"
  answer = aws_instance.walrus.public_ip
}

resource "namedotcom_record" "walrus_schach_BE"{
  domain_name = "walrus.codes"
  host = "schach-backend"
  record_type = "A"
  answer = aws_instance.walrus.public_ip
}

resource "namedotcom_record" "walrus_schach_BE"{
  domain_name = "walrus.codes"
  host = "tui"
  record_type = "A"
  answer = aws_instance.walrus.public_ip
}
