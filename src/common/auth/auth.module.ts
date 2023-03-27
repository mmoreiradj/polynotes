import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersService } from 'src/core/services/users.service'
import { MailModule } from '../mail/mail.module'
import { PrismaService } from '../prisma/prisma.service'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt-auth.strategy'
import { JwtMailStrategy } from './strategies/jwt-mail.strategy'

@Module({
  imports: [PassportModule, MailModule, JwtModule],
  providers: [AuthService, PrismaService, JwtStrategy, JwtMailStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
