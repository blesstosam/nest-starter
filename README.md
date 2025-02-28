# nest-starter

### start
1. pnpm install
2. touch file .env and set config
```shell
DATABASE_URL=xxx
JWT_SECRET=xxx
```
3. exec `npx prisma generate`
4. exec `pnpm run start:dev`


### framework
nestjs(base fastify)<br>

### db & orm
- mysql+prisma([prisma docs](https://www.prisma.io/docs/orm))
- generate prisma types: `npx prisma generate`


### db migrate & push
1. set `DATABASE_URL=xxx` in .env
2. exec `npx prisma migrate dev` to create migration and apply to the db
2. exec `npx prisma migrate deploy` to apply all pending migrations to the db
4. exec `prisma db push` to Push the Prisma schema state to the database

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
