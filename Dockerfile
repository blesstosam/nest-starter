FROM node:18-alpine AS base

RUN npm i -g pnpm@8.15.7

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
# generate prisma type
RUN npx prisma generate && pnpm run build
RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app
COPY --from=build /app/ ./
COPY --from=build /app/node_modules ./node_modules

RUN apk add --no-cache tzdata
ENV TZ Asia/Shanghai

EXPOSE 8010

# 使用pnpm安装方式 间接依赖也需要显示安装 否则找不到包 比如expres
CMD ["node", "dist/main.js"]
