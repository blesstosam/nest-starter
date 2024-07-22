# mmp-server

### framework
nestjs(base fastify)<br>

### db & orm
mysql+prisma<br>
[prisma docs](https://www.prisma.io/docs/orm)

### db migrate
1. touch file .env and set DATABASE_URL=xxx
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
pnpm@8
