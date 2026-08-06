FROM node:22-slim

WORKDIR /app

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]