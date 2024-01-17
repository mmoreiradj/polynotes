import { ChartBarSquareIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Button } from 'flowbite-react'

export enum FormView {
  QUESTIONS = 'questions',
  ANSWERS = 'responses',
}

type Props = {
  selectedView: FormView
  onChangeView: (view: FormView) => void
}

export const FormHeader = ({ selectedView, onChangeView }: Props) => {
  return (
    <div className="w-full flex justify-center mb-2">
      <Button.Group className="flex-item">
        <Button
          color={selectedView === FormView.QUESTIONS ? 'purple' : 'gray'}
          onClick={() => onChangeView(FormView.QUESTIONS)}
        >
          <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
          Questions
        </Button>
        <Button
          color={selectedView === FormView.ANSWERS ? 'purple' : 'gray'}
          onClick={() => onChangeView(FormView.ANSWERS)}
        >
          <ChartBarSquareIcon className="w-5 h-5 mr-2" />
          Answers
        </Button>
      </Button.Group>
    </div>
  )
}
