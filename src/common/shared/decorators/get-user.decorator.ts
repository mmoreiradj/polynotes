import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JWTPayload, JwtUser } from '../types'

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): JwtUser => {
  const request = ctx.switchToHttp().getRequest()
  const user: JWTPayload = request.user

  if (!user) {
    return {
      id: null,
      name: null,
      email: null,
      isAnonymous: true,
    }
  }

  return {
    id: user.sub,
    name: user.name,
    email: user.email,
  }
})
