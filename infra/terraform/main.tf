resource "kubernetes_namespace" "polynotes" {
  metadata {
    name = "polynotes"
  }
}

resource "helm_release" "mongo" {
  name             = "mongodb"
  repository       = "https://charts.bitnami.com/bitnami"
  chart            = "mongodb"
  namespace        = kubernetes_namespace.polynotes.metadata[0].name
  version          = "14.6.0"
  create_namespace = false

  set_sensitive {
    name  = "auth.rootPassword"
    value = random_password.mongo_root_password.result
  }

  set_sensitive {
    name  = "auth.username"
    value = random_password.mongo_user_username.result
  }

  set_sensitive {
    name  = "auth.password"
    value = random_password.mongo_user_password.result
  }

  set {
    name  = "auth.database"
    value = "polynotes"
  }
}

resource "helm_release" "front" {
  name             = "front"
  chart            = "front"
  repository       = "../charts"
  version          = "0.1.3"
  namespace        = kubernetes_namespace.polynotes.metadata[0].name
  create_namespace = false
  wait             = false

  values = [
    file("../values/front.yaml")
  ]
}

resource "helm_release" "back" {
  name             = "back"
  chart            = "back"
  repository       = "../charts"
  version          = "0.1.3"
  namespace        = kubernetes_namespace.polynotes.metadata[0].name
  create_namespace = false
  wait             = false

  values = [
    file("../values/back.yaml")
  ]

  set {
    name  = "jwtSecretName"
    value = kubernetes_secret.jwt.metadata[0].name
  }

  set {
    name  = "mongo.secretName"
    value = kubernetes_secret.mongodb-url.metadata[0].name
  }
}
