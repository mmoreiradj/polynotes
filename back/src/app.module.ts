import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from './common/auth/auth.module'
import { MailModule } from './common/mail/mail.module'
import { JwtAuthGuard } from './common/shared/guards/jwt-auth.guard'
import { UsersModule } from './users/users.module'
import { FilesModule } from './files/files.module'
import { DatabasesModule } from './databases/databases.module'
import { HealthModule } from './common/health/health.module'
import { FormsModule } from './forms/forms.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev.local', '.env.dev', '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MailModule,
    UsersModule,
    FilesModule,
    DatabasesModule,
    HealthModule,
    FormsModule,
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
