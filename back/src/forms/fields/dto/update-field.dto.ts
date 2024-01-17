import { IsNotEmpty } from 'class-validator'
import { FormField } from 'src/forms/schema/form-field.schema'

export class UpdateFieldDto {
  @IsNotEmpty()
  formField: FormField
}
