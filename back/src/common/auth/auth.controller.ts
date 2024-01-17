import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common'
import { UserDocument } from 'src/schema/user.schema'
import { GetUser } from '../shared/decorators/get-user.decorator'
import { Public } from '../shared/decorators/is-public.decorator'
import { JwtMailGuard } from '../shared/guards/jwt-mail.guard'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      domain: this.configService.getOrThrow('COOKIE_DOMAIN'),
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: 'strict',
    })
    return {
      message: 'Logout successful',
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.authService.login(loginDto)

    response.cookie('access_token', result.access_token, {
      domain: this.configService.getOrThrow('COOKIE_DOMAIN'),
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      httpOnly: true,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
      sameSite: 'strict',
    })

    return {
      message: 'Login successful',
    }
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto)
  }

  @UseGuards(JwtMailGuard)
  @Post('validate')
  validate(@GetUser() user: UserDocument) {
    return this.authService.validate(user)
  }

  @Post('resend')
  resend(@Body('email') email: string) {
    this.authService.resendMail(email)
  }
}
