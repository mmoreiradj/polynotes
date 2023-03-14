import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon from 'argon2'
import { MailService } from 'src/mail/mail.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from 'src/shared/types'
import { UsersService } from 'src/users/users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.getOne({ email: loginDto.email, active: true })

      if (!(await argon.verify(user.password, loginDto.password))) {
        throw new UnauthorizedException()
      }

      if (!user.active) {
        throw new UnauthorizedException({
          code: 'PN0',
          message: 'User not active',
        })
      }

      const payload = { sub: user.id }

      return {
        access_token: this.jwtService.sign(payload),
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException()
      }
      throw error
    }
  }

  async register(registerDto: CreateUserDto) {
    try {
      const hashedPassword = await argon.hash(registerDto.password)
      registerDto.password = hashedPassword
      const user = await this.prisma.users.create({
        data: {
          ...registerDto,
        },
      })

      delete user.password

      this.sendMail(user)

      return user
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException({
          code: 'PN1',
          field: 'email',
          message: 'Email already taken',
        })
      }
      throw error
    }
  }

  async validate(user: User) {
    const updatedUser = await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        active: true,
      },
    })

    if (!updatedUser) {
      throw new UnauthorizedException()
    }

    return {
      success: true,
    }
  }

  async resendMail(email: string) {
    try {
      const user = await this.usersService.getOne({ email })
      this.sendMail(user)
      return
    } catch (error) {
      if (error instanceof NotFoundException) {
        return
      }
    }
  }

  async sendMail(user: User) {
    const payload = { sub: user.id }

    const token = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('JWT_SECRET_MAIL'),
      expiresIn: '1d',
    })

    this.mailService.sendRegistrationMail(user, token)
  }
}
