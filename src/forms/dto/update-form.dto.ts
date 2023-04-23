import { IsOptional } from 'class-validator'
import { FormField } from '../schema/form-field.schema'

export class UpdateFormDto {
  @IsOptional()
  name?: string

  @IsOptional()
  description?: string

  // @IsOptional()
  // fields?: FormField[]
}
