import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ObjectId } from 'mongoose'
import { toObjectId } from 'src/shared/helpers'

export class UpdateFileDto {
  @IsOptional()
  name?: string

  @IsOptional()
  @Transform(({ value }) => toObjectId(value))
  parent?: ObjectId
}
