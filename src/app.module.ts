import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { AuthModule } from './common/auth/auth.module'
import { MailModule } from './common/mail/mail.module'
import { PrismaModule } from './common/prisma/prisma.module'
import { JwtAuthGuard } from './common/shared/guards/jwt-auth.guard'
import { CoreModule } from './core/core.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev.local', '.env.dev', '.env'],
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    MailModule,
    CoreModule,
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
