import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'
import { MailModule } from '../mail/mail.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtStrategy } from './strategies/jwt-auth.strategy'
import { JwtMailStrategy } from './strategies/jwt-mail.strategy'

@Module({
  imports: [PassportModule, MailModule, JwtModule, UsersModule],
  providers: [AuthService, JwtStrategy, JwtMailStrategy, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
