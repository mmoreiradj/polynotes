import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon from 'argon2'
import { UsersService } from 'src/core/services/users.service'
import { MailService } from '../mail/mail.service'
import { JWTPayload } from '../shared/types'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email)

      if (!user.active) {
        throw new UnauthorizedException({
          code: 'PN0',
          message: 'User not active',
        })
      }

      if (!(await argon.verify(user.password, loginDto.password))) {
        throw new UnauthorizedException()
      }

      const payload: JWTPayload = { sub: user.id, name: user.name, email: user.email }

      const access_token = this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: '3d',
      })

      return {
        access_token,
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

      const user = await this.usersService.create(registerDto)

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
    const updatedUser = await this.usersService.activate(user.id)

    if (!updatedUser) {
      throw new UnauthorizedException()
    }

    return {
      success: true,
    }
  }

  async resendMail(email: string) {
    try {
      const user = await this.usersService.findByEmail(email)
      if (user.active) return
      this.sendMail(user)
      return
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        return
      }
      throw error
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
