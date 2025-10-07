# Stage 1: Build
FROM node:20.17 AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20.17
WORKDIR /usr/src/app

# Copy hasil build dan node_modules
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

# Copy script wait-for-db.sh
COPY wait-for-db.sh ./wait-for-db.sh
RUN chmod +x ./wait-for-db.sh

EXPOSE 9000
CMD ["sh", "./wait-for-db.sh"]
