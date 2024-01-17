import { Card, Label, Pagination, Select } from 'flowbite-react'
import { Form_ } from '../../../../../shared/types/form.type'
import { useEffect, useState } from 'react'
import { FormFieldAnswer } from '../../../../../shared/types/form-field-answer.type'
import { formAnswerService } from '../../../../../services/form-answer.service'

export const FieldAnswerView = ({ form }: { form: Form_ }) => {
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [selectedField, setSelectedField] = useState<string>(form.fields[0]._id)
  const [answers, setAnswers] = useState<FormFieldAnswer[]>()
  const [totalAnswers, setTotalAnswers] = useState<number>(-1)

  const loadMore = async (page: number) => {
    const response = await formAnswerService.findAllForField(form._id, selectedField, 10, page * 10)
    setAnswers(response.data.answers)
    setTotalAnswers(response.data.count)
    setCurrentPage(page)
    document.getElementById('field-answer-view-top')?.scrollIntoView()
  }

  useEffect(() => {
    loadMore(0)
  }, [selectedField])

  return (
    <div className="flex flex-col w-full" id="field-answer-view-top">
      <Card className="flex flex-row mb-2">
        <div className="max-w-xs">
          <Label htmlFor="selectedField">
            <h5>Question</h5>
          </Label>
          <Select id="selectedField" value={selectedField} onChange={(e) => setSelectedField(e.target.value)}>
            {form.fields.map((field) => (
              <option key={field._id} value={field._id}>
                {field.label}
              </option>
            ))}
          </Select>
          <br />
          <p>{totalAnswers ?? '...'} Answers received</p>
        </div>
      </Card>
      {totalAnswers > 0 && (
        <>
          {answers?.map((answer, index) => (
            <Card key={index} className="mb-2">
              {answer.value}
            </Card>
          ))}
          <div className="w-full flex flex-col items-center">
            <p>You're on page {currentPage + 1}</p>
            <Pagination
              className="pagination"
              currentPage={currentPage + 1}
              totalPages={totalAnswers / 10}
              showIcons
              onPageChange={(page) => loadMore(page - 1)}
            />
          </div>
        </>
      )}
      {totalAnswers === 0 && <Card>No answers yet</Card>}
    </div>
  )
}
