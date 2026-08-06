FROM node:22-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN chmod +x entrypoint.sh

RUN npx prisma generate

EXPOSE 3001

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["npm", "start"]