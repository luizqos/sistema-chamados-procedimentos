FROM node:22-slim AS builder

WORKDIR /app

# Limita a memória máxima do Heap do Node para não estourar a RAM do Docker
ENV NODE_OPTIONS="--max-old-space-size=2048"

COPY package*.json ./

# Aumenta o timeout de rede do NPM para conexões instáveis
RUN npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retries 5

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Copia os node_modules do builder em vez de rodar npm ci novamente
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]