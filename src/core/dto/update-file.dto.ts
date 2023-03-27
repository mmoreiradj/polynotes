import { IsNumber, IsOptional } from 'class-validator'

export class UpdateFileDto {
  @IsOptional()
  name?: string

  @IsOptional()
  @IsNumber()
  parentId?: number
}
