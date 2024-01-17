import { useEffect, useState } from 'react'
import { SummaryField } from '.'
import { Chart } from 'react-google-charts'
import { formAnswerService } from '../../../../../../services/form-answer.service'
import { TagCloud } from '../../../../../../shared/types/tag-cloud.type'
import { Checkbox, Label } from 'flowbite-react'

export const SelectSummary = ({
  field,
  formId,
  formAnswerCount,
  fieldAnswerCount,
}: SummaryField & { fieldAnswerCount?: number }) => {
  const [fetchedData, setFetchedData] = useState<(string | number)[][]>([])
  const [data, setData] = useState<(string | number)[][]>()
  const [loading, setLoading] = useState<boolean>(true)
  const [includeMissing, setIncludeMissing] = useState<boolean>(false)

  useEffect(() => {
    if (!fieldAnswerCount) return
    if (includeMissing) {
      setData([['Answer', 'Answer Count'], ...fetchedData, ['Missing answers', formAnswerCount - fieldAnswerCount]])
    } else {
      setData([['Answer', 'Answer Count'], ...fetchedData])
    }
  }, [includeMissing])

  useEffect(() => {
    const init = async () => {
      const response = await formAnswerService.findAllStatsForField(formId, field._id)
      const answers = (response.data as TagCloud[]).map((answer) => [answer._id, answer.count])
      setData([['Answer', 'Answer Count'], ...answers])
      setFetchedData(answers)
      setLoading(false)
    }
    init()
  }, [])
  return (
    <div>
      {!loading && <Chart chartType="PieChart" data={data} height="400px" width="100%" />}
      {formAnswerCount !== undefined && fieldAnswerCount !== undefined && fieldAnswerCount < formAnswerCount && (
        <>
          <Label htmlFor="includeMissing" className="mr-2">
            Include missing answers
          </Label>
          {fieldAnswerCount !== undefined && (
            <Checkbox
              id="includeMissing"
              checked={includeMissing}
              onChange={() => setIncludeMissing(!includeMissing)}
            />
          )}
        </>
      )}
    </div>
  )
}
