FROM node:20-bookworm-slim

# better-sqlite3 需要原生编译
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV DATABASE_URL=file:./prisma/data/initial.db
RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "scripts/railway-start.mjs"]
