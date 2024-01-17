import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JWTPayload } from 'src/common/shared/types'

@Injectable()
export class JwtMailStrategy extends PassportStrategy(Strategy, 'jwt-mail') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET_MAIL'),
    })
  }

  async validate(payload: Pick<JWTPayload, 'sub'>): Promise<Pick<JWTPayload, 'sub'>> {
    return { sub: payload.sub }
  }
}
