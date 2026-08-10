FROM node:22-slim AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MS_CLIENT_ID
ARG NEXT_PUBLIC_MS_TENANT_ID

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MS_CLIENT_ID=$NEXT_PUBLIC_MS_CLIENT_ID
ENV NEXT_PUBLIC_MS_TENANT_ID=$NEXT_PUBLIC_MS_TENANT_ID

ENV NODE_OPTIONS="--max-old-space-size=2048"

COPY package*.json ./
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
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "run", "start"]