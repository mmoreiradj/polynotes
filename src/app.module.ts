import { Module } from '@nestjs/common'
// import { FilesModule } from './files/files.module'
import { ConfigModule } from '@nestjs/config'
// import { WorkspacesModule } from './workspaces/workspaces.module'
import { HealthModule } from './health/health.module'
import { PrismaService } from './prisma/prisma.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.dev.local', '.env.dev', '.env'],
      isGlobal: true,
    }),
    // WorkspacesModule,
    HealthModule,
    // FilesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
