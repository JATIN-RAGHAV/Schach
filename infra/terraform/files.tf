# walrus.codes
resource "local_sensitive_file" "walrus_certificate"{
  content = join("",[
    acme_certificate.walrus.certificate_pem,
    acme_certificate.walrus.issuer_pem
  ])
  filename = "./walrus.codes.crt"
}

resource "local_sensitive_file" "walrus_key"{
  content = acme_certificate.walrus.private_key_pem
  filename = "./walrus.codes.key"
}

# schach.walrus.codes
resource "local_sensitive_file" "schach_walrus_certificate"{
  content = join("",[
    acme_certificate.schach_walrus.certificate_pem,
    acme_certificate.schach_walrus.issuer_pem
  ])
  filename = "./schach.walrus.codes.crt"
}

resource "local_sensitive_file" "schach_walrus_key"{
  content = acme_certificate.schach_walrus.private_key_pem
  filename = "./schach.walrus.codes.key"
}

# backend-schach.walrus.codes
resource "local_sensitive_file" "backend_walrus_certificate"{
  content = join("",[
    acme_certificate.backend_walrus.certificate_pem,
    acme_certificate.backend_walrus.issuer_pem
  ])
  filename = "./backend-schach.walrus.codes.crt"
}

resource "local_sensitive_file" "backend_walrus_key"{
  content = acme_certificate.backend_walrus.private_key_pem
  filename = "./backend-schach.walrus.codes.key"
}
