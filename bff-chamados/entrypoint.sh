#!/bin/sh
set -e

echo "Aguardando o PostgreSQL inicializar..."

# Tenta aplicar as migrações (se falhar em dev por falta de pasta de migration, usa o db push)
echo "Executando migrações do banco de dados..."
npx prisma migrate deploy || npx prisma db push

echo "Iniciando a aplicação..."
exec "$@"