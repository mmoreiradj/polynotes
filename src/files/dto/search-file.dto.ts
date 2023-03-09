import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { ObjectId } from 'mongodb'
import { toBoolean, toNullOrObjectId } from 'src/shared/helpers'

export class SearchFileDto {
  @IsOptional()
  name?: string

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  isDirectory?: boolean

  @IsOptional()
  @Transform(({ value }) => toNullOrObjectId(value))
  parent?: ObjectId | null
}
