#!/bin/sh
# wait-for-db.sh

# Wait for MySQL to be ready
until mysql -h db -u root -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; do
  echo "Waiting for MySQL..."
  sleep 2
done

echo "MySQL ready!"

# Run Prisma migrations if not already done
if [ ! -f "/var/lib/mysql/.migrated" ]; then
  echo "Running Prisma migrate deploy..."
  npx prisma migrate deploy
  touch /var/lib/mysql/.migrated
fi

# Start the Node.js application
exec node dist/server.js
