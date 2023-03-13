import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../types'

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: Partial<User> = {
    id: request.user.userId,
  }
  return user
})
