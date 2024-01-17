import { Card, Label, TextInput, Textarea, Select } from 'flowbite-react'
import { FormField, FormFieldKind } from '../../../../../shared/enum/form-field.enum'
import { FormFieldAnswer } from '../../../../../shared/types/form-field-answer.type'

export const AnswerField = ({ field, answer }: { field: FormField; answer: FormFieldAnswer }) => {
  return (
    <Card className="w-full">
      <h5>{field.label}</h5>
      <p className="text-s" />
      <p>{answer.value}</p>
    </Card>
  )
}
