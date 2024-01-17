import { useEffect, useState } from 'react'
import { Form_ } from '../../../../../shared/types/form.type'
import { FormAnswer } from '../../../../../shared/types/form-answer.type'
import { formAnswerService } from '../../../../../services/form-answer.service'
import { Button, Card } from 'flowbite-react'

export const FormAnswerView = ({ form }: { form: Form_ }) => {
  const [answer, setAnswer] = useState<FormAnswer>()
  const [totalAnswers, setTotalAnswers] = useState<number>(-1)
  const [offset, setOffset] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const loadNextAnswer = async () => {
    setIsLoading(true)
    const response = await formAnswerService.findAllForForm(form._id, 1, offset)
    setAnswer(response.data.answers[0])
    setTotalAnswers(response.data.count)
    setIsLoading(false)
  }

  useEffect(() => {
    loadNextAnswer()
  }, [])

  return (
    <div className="w-full">
      {answer?.answers.map((answer, index) => (
        <Card key={index} className="mb-2">
          <h5>{form.fields.filter((field) => field._id === answer.formField)[0].label}</h5>
          <p className="text-xs">{answer.value}</p>
        </Card>
      ))}
      {totalAnswers > 0 && (
        <Card>
          <div className="flex items-center justify-center text-center">
            <Button
              color="purple"
              className="mr-2"
              disabled={offset === 0 && !isLoading}
              onClick={() => {
                setOffset(offset - 1)
                loadNextAnswer()
              }}
            >
              Previous
            </Button>
            <p className="mr-2">
              {offset + 1} / {totalAnswers}
            </p>
            <Button
              color="purple"
              disabled={offset === totalAnswers - 1 && !isLoading}
              onClick={() => {
                setOffset(offset + 1)
                loadNextAnswer()
              }}
            >
              Next
            </Button>
          </div>
        </Card>
      )}
      {totalAnswers === 0 && <Card>No answers yet</Card>}
    </div>
  )
}
