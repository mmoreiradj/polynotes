import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FilesModule } from './files/files.module'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.getOrThrow('MONGOOSE_URL'),
      }),
      inject: [ConfigService],
    }),
    FilesModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.dev.local', '.env.dev', '.env'],
    }),
  ],
})
export class AppModule {}
