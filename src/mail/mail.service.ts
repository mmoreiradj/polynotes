import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/shared/types'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private readonly configService: ConfigService) {}

  async sendRegistrationMail(user: User, token: string) {
    const to =
      this.configService.getOrThrow('NODE_ENV') === 'production'
        ? user.email
        : this.configService.getOrThrow('SMTP_USER')

    await this.mailerService.sendMail({
      to: to,
      subject: 'Polynotes: Validate your email',
      template: './validation-mail',
      context: {
        username: user.name,
        link: `${this.configService.getOrThrow('CORS_ORIGIN')}/confirm-email?token=${token}`,
      },
    })
  }
}
