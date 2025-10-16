# Stage 1: Build
FROM node:20.17 AS builder
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

COPY /root/dipoassist-api/src/config/serviceAccountKey.json ./src/config/serviceAccountKey.json

RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20.17
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 9000
CMD ["node", "dist/server.js"]
