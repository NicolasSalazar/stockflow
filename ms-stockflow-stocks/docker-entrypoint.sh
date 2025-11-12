#!/bin/sh
set -e

echo "Waiting for database to be ready..."
# Wait for database to be ready
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database is unavailable - waiting..."
  sleep 2
done

echo "Database is ready. Running migrations..."
npx prisma migrate deploy || npx prisma db push --accept-data-loss

echo "Starting application..."
exec node dist/main.js
