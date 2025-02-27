import { join } from 'node:path'
import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { ResourceModule } from './resource/resource.module'
import { FileModule } from './file/file.module'
import { AuthModule } from './auth/auth.module'
import { TagModule } from './tag/tag.module'
import { getInstance } from './minio'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/static/',
      rootPath: join(__dirname, '../public'),
      exclude: ['/api*'],
    }),
    AuthModule,
    UserModule,
    ResourceModule,
    FileModule,
    TagModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  async onApplicationBootstrap() {
    // await getInstance().ensureBucket()
  }
}
