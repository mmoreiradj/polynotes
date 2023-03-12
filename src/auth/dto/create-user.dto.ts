import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(25)
  name: string

  @IsNotEmpty()
  @MaxLength(100)
  password: string

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(512)
  email: string
}
