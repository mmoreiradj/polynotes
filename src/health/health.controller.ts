import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { PrismaService } from 'src/prisma/prisma.service'
import { Public } from 'src/shared/decorators/is-public.decorator'
import { PrismaHealthIndicator } from './prisma.check'

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private readonly prismaService: PrismaHealthIndicator) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.prismaService.isHealthy('db')])
  }
}
