# Creates an account on Let's Encrypt
resource "acme_registration" "walrus"{
  account_key_pem = tls_private_key.main_key.private_key_pem
  email_address = "jrag137@gmail.com"
}

resource "acme_certificate" "walrus"{
  account_key_pem = acme_registration.walrus.account_key_pem
  common_name = "walrus.codes"

  dns_challenge {
    provider = "namedotcom"

    config = {
      NAMECOM_USERNAME = var.namecom_username
      NAMECOM_API_TOKEN = var.namecom_api_token
    }
  }
}

resource "acme_certificate" "schach_walrus"{
  account_key_pem = acme_registration.walrus.account_key_pem
  common_name = "schach.walrus.codes"

  dns_challenge {
    provider = "namedotcom"

    config = {
      NAMECOM_USERNAME = var.namecom_username
      NAMECOM_API_TOKEN = var.namecom_api_token
    }
  }
}

resource "acme_certificate" "backend_walrus"{
  account_key_pem = acme_registration.walrus.account_key_pem
  common_name = "backend-schach.walrus.codes"

  dns_challenge {
    provider = "namedotcom"

    config = {
      NAMECOM_USERNAME = var.namecom_username
      NAMECOM_API_TOKEN = var.namecom_api_token
    }
  }
}
