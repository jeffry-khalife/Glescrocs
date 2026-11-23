# Glescrocs

## Déploiement

Le projet est composé d'un frontend React servi par Nginx, d'une API
Node.js et d'une base de données MySQL. Le déploiement est réalisé avec
Docker Compose à partir des images publiées dans GitHub Container Registry
(GHCR).

### Prérequis

- Docker et Docker Compose v2 installés sur la machine de déploiement ;
- un accès en lecture aux paquets du dépôt GitHub ;

### Déploiement avec les images GHCR

Depuis le répertoire du projet sur la machine cible :

```bash

echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GITHUB_USER" --password-stdin
docker compose pull
docker compose up -d
```

`IMAGE_TAG=dev` utilise les images produites depuis la branche `main`.
Pour une version stable, utiliser le nom du tag Git publié, par exemple :

```bash
export IMAGE_TAG=v1.0.0
docker compose pull
docker compose up -d
```

L'application est alors accessible sur le port `5173` de la machine cible.
Le frontend transmet les requêtes `/api/` et les connexions Socket.IO au
backend. Les données MySQL sont conservées dans le volume Docker
`mysql_data`.

Pour arrêter les services sans supprimer les données :

```bash
docker compose down
```

Pour supprimer également le volume de données, uniquement si cela est
volontaire :

```bash
docker compose down -v
```

### Pipeline CI/CD

Le workflow [`.github/workflows/main.yml`](.github/workflows/main.yml) se
déclenche :

- sur les pull requests vers `main` : installation, lint backend, tests
  backend/frontend et build frontend ;
- sur `main` et les tags `v*` : les mêmes contrôles, puis construction et
  publication des images :
  - `ghcr.io/jeffry-khalife/glescrocs-backend`
  - `ghcr.io/jeffry-khalife/glescrocs-frontend`

Les commits sur `main` publient l'étiquette `dev`. Un tag Git `v*` publie
l'étiquette correspondante, par exemple `v1.0.0`. Le workflow utilise
automatiquement `GITHUB_TOKEN` pour publier dans GHCR.

La notification Google Chat est facultative. Pour l'activer, ajouter le
secret GitHub Actions `CHAT_WEBHOOK`. Le secret `JWT_SECRET` doit rester
configuré dans l'environnement de la machine de déploiement et ne doit pas
être commité dans le dépôt.