#!/bin/sh
set -e

echo "🔄 Atualizando o esquema do banco de dados..."
# Aplica as migrations existentes ou atualiza o banco se estiver em dev
npx prisma migrate deploy || npx prisma db push

echo "🌱 Executando seed das Roles..."
npx prisma db seed

echo "🚀 Iniciando a aplicação..."
exec "$@"