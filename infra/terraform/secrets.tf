resource "random_password" "mongo_root_password" {
  length  = 16
  special = false
}

resource "random_password" "mongo_user_password" {
  length  = 16
  special = false
}

resource "random_password" "mongo_user_username" {
  length  = 16
  special = false
}

resource "kubernetes_secret" "mongodb-url" {
  metadata {
    name      = "mongodb-url"
    namespace = kubernetes_namespace.polynotes.metadata[0].name
  }

  data = {
    "url" = "mongodb://${random_password.mongo_user_username.result}:${random_password.mongo_user_password.result}@mongodb:27017/polynotes"
  }
}

resource "random_password" "jwt-access" {
  length  = 32
  special = false
}

resource "random_password" "jwt-mail" {
  length  = 32
  special = false
}

resource "kubernetes_secret" "jwt" {
  metadata {
    name      = "jwt"
    namespace = kubernetes_namespace.polynotes.metadata[0].name
  }

  data = {
    "access" = random_password.jwt-access.result
    "mail"   = random_password.jwt-mail.result
  }
}
