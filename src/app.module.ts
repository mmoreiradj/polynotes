import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { HealthModule } from './health/health.module'
import { PrismaService } from './prisma/prisma.service'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard'
import { AuthModule } from './auth/auth.module'
import { MailModule } from './mail/mail.module'
import { UsersModule } from './users/users.module'
import { WorkspacesModule } from './workspaces/workspaces.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev.local', '.env.dev', '.env'],
      isGlobal: true,
    }),
    WorkspacesModule,
    HealthModule,
    // FilesModule,
    AuthModule,
    MailModule,
    UsersModule,
  ],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
