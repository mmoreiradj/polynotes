import { IsBoolean, IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class CreateFileDto {
  @IsNotEmpty()
  @MaxLength(25)
  name: string

  @IsNotEmpty()
  @IsBoolean()
  isDirectory: boolean

  @IsOptional()
  parentId?: number
}
