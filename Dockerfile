# Tahap 1: Install
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Tahap 2: Hasil Akhir
FROM node:20-alpine
WORKDIR /app
# Hanya ambil node_modules yang sudah bersih
COPY --from=builder /app/node_modules ./node_modules
COPY . .

EXPOSE 3000
CMD ["node", "server.js"]