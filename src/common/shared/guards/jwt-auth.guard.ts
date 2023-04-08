import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator'
import { IS_OPTIONAL_AUTH } from '../decorators/is-optional-auth.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt-auth') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const isOptional = this.reflector.getAllAndOverride<boolean>(IS_OPTIONAL_AUTH, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isOptional) {
      const req = context.switchToHttp().getRequest()
      if (!req.cookies?.access_token) {
        return true
      }
    }

    return super.canActivate(context)
  }
}
