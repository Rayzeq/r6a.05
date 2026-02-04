# Projet JS

## Installation

1. Clonez le dépot: `git clone https://github.com/Rayzeq/r6a.05.git`
2. Installez les dépendences: `npm install`
3. Mettez en place les variables d'environnement (voir ci-dessous)
4. Appliquez les migrations de la base de données: `npx knex migrate:latest`
5. Démarrez le serveur: `npm start`

## Variables d'environnement

Créez un fichier `server/.env` avec le contenu suivant (remplacez les valeurs par les votres):

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_DATABASE=user
DB_PORT=3307

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre_login_mail
SMTP_PASS=votre_mdp_mail
SMTP_FROM="Projet JS" <noreply@projet-js.com>

PORT=3000
```