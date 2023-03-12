import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as argon from 'argon2'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.users.findUniqueOrThrow({
        where: {
          email: loginDto.email,
        },
      })

      if (!(await argon.verify(user.password, loginDto.password))) {
        throw new UnauthorizedException()
      }

      delete user.password

      const payload = { sub: user.id }

      return {
        access_token: this.jwtService.sign(payload),
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log(error)
      }
      throw error
    }
  }

  async register(registerDto: CreateUserDto) {
    try {
      const hashedPassword = await argon.hash(registerDto.password)
      registerDto.password = hashedPassword
      return await this.prisma.users.create({
        data: {
          ...registerDto,
        },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('Email already taken')
      }
    }
  }
}
