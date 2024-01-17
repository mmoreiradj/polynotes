import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus'
import { Public } from '../shared/decorators/is-public.decorator'

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private readonly mongooseHealth: MongooseHealthIndicator) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([async () => this.mongooseHealth.pingCheck('mongoose')])
  }
}
