FROM node:22-alpine

WORKDIR /app

# Copia só os ficheiros de dependências primeiro: o Docker guarda esta camada
# em cache e só reinstala se o package.json mudar
COPY package*.json ./
RUN npm ci --omit=dev

# Copia o resto do código
COPY . .

EXPOSE 3000

CMD ["npm", "start"]