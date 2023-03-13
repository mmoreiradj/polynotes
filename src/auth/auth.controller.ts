import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { MailService } from 'src/mail/mail.service'
import { GetUser } from 'src/shared/decorators/get-user.decorator'
import { Public } from 'src/shared/decorators/is-public.decorator'
import { JwtMailGuard } from 'src/shared/guards/jwt-mail.guard'
import { User } from 'src/shared/types'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly mailService: MailService) {}

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
  validate(@GetUser() user: User) {
    return this.authService.validate(user)
  }
}
