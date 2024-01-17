import { useEffect, useState } from 'react'
import { formAnswerService } from '../../../../../services/form-answer.service'
import { Form_ } from '../../../../../shared/types/form.type'
import { SummaryView } from './summary/summary-view'
import { Breadcrumb, Button, Card } from 'flowbite-react'
import { QuestionMarkCircleIcon, ChartBarSquareIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { FormView } from '../form-header'
import { FieldAnswerView } from './field-answer-view'
import { FormAnswerView } from './form-answer-view'

type Props = {
  form: Form_
}

enum AnswerViewMode {
  SUMMARY = 'SUMMARY',
  FIELD = 'FIELD',
  ANSWER = 'ANSWER',
}

export const AnswerView = ({ form }: Props) => {
  const [answerCount, setAnswerCount] = useState<number>(0)

  const [selectedView, setViewMode] = useState<AnswerViewMode>(AnswerViewMode.SUMMARY)

  useEffect(() => {
    const init = async () => {
      const response = await formAnswerService.findAllForForm(form._id, 1)
      setAnswerCount(response.data.count)
    }

    init()
  }, [])

  return (
    <div className="flex items-center flex-col">
      <Card className="w-full mb-2">
        <h3>{answerCount} Réponses recues</h3>
        <div className="w-full flex justify-center mb-2">
          <Button.Group className="flex-item">
            <Button
              color={selectedView === AnswerViewMode.SUMMARY ? 'purple' : 'gray'}
              onClick={() => setViewMode(AnswerViewMode.SUMMARY)}
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
              Summary
            </Button>
            <Button
              color={selectedView === AnswerViewMode.FIELD ? 'purple' : 'gray'}
              onClick={() => setViewMode(AnswerViewMode.FIELD)}
            >
              <ChartBarSquareIcon className="w-5 h-5 mr-2" />
              Field Answers
            </Button>
            <Button
              color={selectedView === AnswerViewMode.ANSWER ? 'purple' : 'gray'}
              onClick={() => setViewMode(AnswerViewMode.ANSWER)}
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5 mr-2" />
              Full Answers
            </Button>
          </Button.Group>
        </div>
      </Card>
      <AnswerViewElement selectedView={selectedView} form={form} answerCount={answerCount} />
    </div>
  )
}

const AnswerViewElement = ({
  selectedView,
  form,
  answerCount,
}: {
  selectedView: AnswerViewMode
  form: Form_
  answerCount: number
}) => {
  switch (selectedView) {
    case AnswerViewMode.SUMMARY:
      return <SummaryView form={form} answerCount={answerCount} />
    case AnswerViewMode.FIELD:
      return <FieldAnswerView form={form} />
    case AnswerViewMode.ANSWER:
      return <FormAnswerView form={form} />
    default:
      return <p>Something went wrong</p>
  }
}
