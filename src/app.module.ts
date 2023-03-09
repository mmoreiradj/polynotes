import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FilesModule } from './files/files.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { WorkspacesModule } from './workspaces/workspaces.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGOOSE_URL'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.dev.local', '.env.dev', '.env'],
    }),
    WorkspacesModule,
    HealthModule,
    FilesModule,
  ],
})
export class AppModule {}
