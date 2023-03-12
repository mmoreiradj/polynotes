import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus'
import { Public } from 'src/shared/decorators/is-public.decorator'

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService, private mongoose: MongooseHealthIndicator) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.mongoose.pingCheck('mongoose')])
  }
}
