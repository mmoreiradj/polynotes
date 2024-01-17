import { IsOptional } from 'class-validator'

export class UpdateBlockDto {
  @IsOptional()
  kind: string

  @IsOptional()
  content?: string
}
