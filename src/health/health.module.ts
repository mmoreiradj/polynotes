import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { TerminusModule } from '@nestjs/terminus'
import { PrismaService } from 'src/prisma/prisma.service'
import { HealthController } from './health.controller'
import { PrismaHealthIndicator } from './prisma.check'

@Module({
  imports: [TerminusModule, HttpModule],
  providers: [PrismaService, PrismaHealthIndicator],
  controllers: [HealthController],
})
export class HealthModule {}
