import { Card } from 'flowbite-react'
import { FormFieldKind } from '../../../../../../shared/enum/form-field.enum'
import { Form_ } from '../../../../../../shared/types/form.type'
import { IntegerSummary } from './integer-summary'
import { SelectSummary } from './select-summary'
import { TextSummary } from './text-summary'
import { TinyTextSummary } from './tinytext-summary'
import { useState } from 'react'
import { SummaryField } from '.'
import { TotalAnswers } from '../shared/total-answers'

type Props = {
  form: Form_
  answerCount: number
}

export const SummaryView = ({ form, answerCount }: Props) => {
  const [answerCountForField, setAnswerCountForField] = useState<{ [key: string]: number }>({})

  return (
    <div className="w-full">
      {form.fields.map((field) => (
        <Card key={field._id} className="mb-2">
          <h5>{field.label}</h5>
          <TotalAnswers
            formId={form._id}
            field={field}
            onChange={(value) => setAnswerCountForField((answerCount) => ({ ...answerCount, [field._id]: value }))}
          />
          {answerCountForField[field._id] > 0 && (
            <SummaryElement
              formId={form._id}
              field={field}
              formAnswerCount={answerCount}
              fieldAnswerCount={answerCountForField[field._id]}
            />
          )}
        </Card>
      ))}
    </div>
  )
}

const SummaryElement = ({ ...props }: SummaryField) => {
  switch (props.field.kind) {
    case FormFieldKind.TINYTEXT:
      return <TinyTextSummary {...props} />
    case FormFieldKind.INTEGER:
      return <IntegerSummary {...props} />
    case FormFieldKind.SELECT:
      return <SelectSummary {...props} />
    case FormFieldKind.TEXT:
      return <TextSummary {...props} />
    default:
      return <p>Something went wrong</p>
  }
}
