import { FormField } from '../../../../../../shared/enum/form-field.enum'

export type SummaryField = {
  formAnswerCount: number
  fieldAnswerCount: number
  formId: string
  field: FormField
}
