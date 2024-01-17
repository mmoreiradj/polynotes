import { useEffect, useState } from 'react'
import { SummaryField } from '.'
import { formAnswerService } from '../../../../../../services/form-answer.service'
import { IntegerAnswerStats } from '../../../../../../shared/types/integer-answer-stats.type'

export const IntegerSummary = ({ field, formId }: SummaryField) => {
  const [fieldStats, setFieldStats] = useState<IntegerAnswerStats>()

  useEffect(() => {
    const init = async () => {
      const response = await formAnswerService.findAllStatsForField(formId, field._id)
      setFieldStats(response.data as IntegerAnswerStats)
    }
    init()
  }, [])

  return (
    <div className="flex flex-col">
      {fieldStats ? (
        <>
          <p>Min: {fieldStats.min}</p>
          <p>Max: {fieldStats.max}</p>
          <p>Median: {fieldStats.median}</p>
          <p>Average: {fieldStats.average}</p>
        </>
      ) : (
        <p>Calculating...</p>
      )}
    </div>
  )
}
