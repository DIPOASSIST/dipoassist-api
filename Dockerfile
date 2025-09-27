FROM node:20.17 AS builder
WORKDIR /app

COPY . .
RUN npm install

RUN npx prisma generate
RUN npm run build

FROM node:20.17
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./.env

EXPOSE 9000
CMD ["node", "dist/server.js"]
