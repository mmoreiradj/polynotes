import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JWTPayload } from '../types'

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: JWTPayload = request.user
  return {
    id: user.sub,
    name: user?.name,
    email: user?.email,
  }
})
