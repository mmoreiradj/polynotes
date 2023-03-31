import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { UserDocument } from 'src/schema/user.schema'
import { GetUser } from '../shared/decorators/get-user.decorator'
import { Public } from '../shared/decorators/is-public.decorator'
import { JwtMailGuard } from '../shared/guards/jwt-mail.guard'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
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
