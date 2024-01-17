import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, Min } from 'class-validator'

export class SearchAnswerDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit = 10

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset = 0
}
