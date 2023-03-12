import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator'

export class LoginDto {
  @IsNotEmpty()
  @MaxLength(100)
  password: string

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(512)
  email: string
}
