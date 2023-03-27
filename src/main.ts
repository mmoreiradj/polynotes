import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const PORT = configService.getOrThrow('PORT')
  const CORS_ORIGIN = configService.getOrThrow('CORS_ORIGIN')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  app.setGlobalPrefix('/v0')

  app.enableCors({
    origin: CORS_ORIGIN,
    credentials: true,
  })

  await app.listen(PORT)
}
bootstrap()
