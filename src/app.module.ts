import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './common/auth/auth.module'
import { MailModule } from './common/mail/mail.module'
import { JwtAuthGuard } from './common/shared/guards/jwt-auth.guard'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev.local', '.env.dev', '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb+srv://martinmoreiradj:EV51LUhtZrgclHdx@polynotes.jitim8w.mongodb.net/?retryWrites=true&w=majority',
    ),
    AuthModule,
    MailModule,
    UsersModule,
    FilesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [],
})
export class AppModule {}
