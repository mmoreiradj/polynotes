import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { HealthController } from './health.controller'
import { PrismaHealthIndicator } from '../prisma/prisma.check'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
  imports: [TerminusModule, HttpModule, PrismaModule],
  providers: [PrismaHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
