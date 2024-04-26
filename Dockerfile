
####################################################
# Install dependencies only when needed
FROM node:19-alpine AS deps
RUN #apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN #yarn install --frozen-lockfile
RUN npm   install

# Rebuild the source code only when needed
FROM node:19-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run  build

EXPOSE 8081

ENV PORT 8081

CMD ["npm", "run","dev:host"]

