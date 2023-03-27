import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateBlockDto {
  @IsNotEmpty()
  kind: string
  @IsOptional()
  content: string
}
