# nest-starter

### start
1. pnpm install
1. touch file .env and set `DATABASE_URL=xxx`
2. exec `npx prisma generate`
3. exec `pnpm run start:dev`


### framework
nestjs(base fastify)<br>

### db & orm
- mysql+prisma([prisma docs](https://www.prisma.io/docs/orm))
- generate prisma types: `npx prisma generate`


### db migrate
1. set `DATABASE_URL=xxx` in .env
2. exec `npx prisma migrate deploy`

### logger
pino<br>
[pino docs](https://getpino.io/#/)

### file stroage
minio<br>
[minio js sdk](https://min.io/docs/minio/linux/developers/javascript/API.html)

### deploy
docker or docker-compose

### package manager
pnpm
