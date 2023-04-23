import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateFormDto {
  @IsNotEmpty()
  name: string

  @IsOptional()
  description: string
}
