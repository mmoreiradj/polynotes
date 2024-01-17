import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as cookieParser from 'cookie-parser'
import { MongoExceptionFilter } from './common/shared/filters/mongo-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  })
  const configService = app.get(ConfigService)
  const PORT = configService.getOrThrow('PORT')
  const CORS_ORIGIN = configService.getOrThrow('CORS_ORIGIN')

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  app.useGlobalFilters(new MongoExceptionFilter())

  app.setGlobalPrefix('/v0')

  app.enableCors({
    origin: CORS_ORIGIN,
    credentials: true,
  })

  await app.listen(PORT)
}
bootstrap()
