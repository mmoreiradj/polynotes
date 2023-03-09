import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, MaxLength, ValidateIf } from 'class-validator'
import { ObjectId } from 'mongoose'
import { toObjectId } from 'src/shared/helpers'

export class CreateFileDto {
  @IsNotEmpty()
  @MaxLength(25)
  name: string

  @IsNotEmpty()
  @IsBoolean()
  isDirectory: boolean

  @IsNotEmpty()
  @ValidateIf((o) => !o.isDirectory)
  @Transform(({ value }) => toObjectId(value))
  parent?: ObjectId
}
