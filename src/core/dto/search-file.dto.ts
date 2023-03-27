import { Transform } from 'class-transformer'
import { IsOptional } from 'class-validator'
import { toBoolean } from 'src/common/shared/helpers'

export class SearchFileDto {
  @IsOptional()
  name?: string

  @IsOptional()
  @Transform(({ value }) => toBoolean(value))
  isDirectory?: boolean

  @IsOptional()
  parent?: string

  @IsOptional()
  workspace?: string
}
