import { IsOptional } from 'class-validator'

export class CreateBlockDto {
  @IsOptional()
  blocks: any[]
}
