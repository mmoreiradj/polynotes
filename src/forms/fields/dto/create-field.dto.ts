import { IsNotEmpty, IsOptional } from 'class-validator'
import { FormField } from 'src/forms/schema/form-field.schema'

export class CreateFieldDto {
  @IsNotEmpty()
  formField: FormField
  @IsOptional()
  addAfter?: string
}
