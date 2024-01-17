import { IsEmail, IsNotEmpty, IsStrongPassword, MaxLength, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(25)
  @MinLength(3)
  name: string

  @IsNotEmpty()
  @MaxLength(100)
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(512)
  email: string
}
