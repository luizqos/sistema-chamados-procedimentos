FROM node:20-alpine

WORKDIR /app

# Copia manifestos e instala dependências
COPY package*.json ./
RUN npm ci

# Copia o código-fonte e o schema do Prisma
COPY . .

# Gera o cliente do Prisma
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]