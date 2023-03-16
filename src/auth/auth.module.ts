import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { PrismaService } from 'src/prisma/prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt-auth.strategy'
import { PassportModule } from '@nestjs/passport'
import { MailModule } from 'src/mail/mail.module'
import { JwtMailStrategy } from './strategies/jwt-mail.strategy'
import { UsersService } from 'src/users/users.service'

@Module({
  imports: [PassportModule, MailModule, JwtModule],
  providers: [AuthService, PrismaService, JwtStrategy, JwtMailStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
