import { useEffect, useState } from 'react'
import { FormField } from '../../../../../../shared/enum/form-field.enum'
import { formAnswerService } from '../../../../../../services/form-answer.service'

type Props = {
  formId: string
  field: FormField
  onChange: (answerCount: number) => void
}

export const TotalAnswers = ({ formId, field, onChange }: Props) => {
  const [answerCount, setAnswerCount] = useState<number>()

  useEffect(() => {
    const init = async () => {
      const response = await formAnswerService.findAllForField(formId, field._id, 1)
      onChange(response.data.count)
      setAnswerCount(response.data.count)
    }

    init()
  }, [])

  return <p className="text-xs">This field reveived {answerCount ?? '...'} responses</p>
}
