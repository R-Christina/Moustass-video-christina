# Dockerfile
FROM node:20

WORKDIR /app

# Copier package.json et installer dépendances
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port de l'app
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]