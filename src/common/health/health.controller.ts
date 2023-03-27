import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { PrismaHealthIndicator } from '../prisma/prisma.check'
import { Public } from '../shared/decorators/is-public.decorator'

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
