import { useEffect, useState } from 'react'
import { SummaryField } from '.'
import { TagCloud } from '../../../../../../shared/types/tag-cloud.type'
import { formAnswerService } from '../../../../../../services/form-answer.service'
import { TagCloud as ReactTagCloud } from 'react-tagcloud'
import { CustomTagRenderer } from './custom-tag-renderer'
import { TextAnswerStats } from '../../../../../../shared/types/text-answer-stats.type'
import { FormFieldKind } from '../../../../../../shared/enum/form-field.enum'

export const TinyTextSummary = ({ field, formId }: SummaryField) => {
  const [answers, setAnswers] = useState<TagCloud[]>([])
  const [averageWordCount, setAverageWordCount] = useState<number>()

  useEffect(() => {
    const init = async () => {
      const response = await formAnswerService.findAllStatsForField(formId, field._id)
      if ((response.data as TextAnswerStats).averageWordCount !== undefined) {
        setAnswers((response.data as TextAnswerStats).occurences)
        setAverageWordCount((response.data as TextAnswerStats).averageWordCount)
      } else {
        setAnswers(response.data as TagCloud[])
      }
    }

    init()
  }, [])

  return (
    <div className="flex justify-center items-center flex-col">
      <div>{field.kind === FormFieldKind.TEXT && <h6>Mots les plus récurrents</h6>}</div>

      <ReactTagCloud
        style={{ textAlign: 'center' }}
        tags={answers.map((answer: TagCloud) => {
          return { value: answer._id, count: answer.count }
        })}
        maxSize={35}
        minSize={12}
        renderer={function (tag: any, size: any, color: any) {
          return <CustomTagRenderer key={tag.value} tag={tag} size={size} color={color} />
        }}
      />
      {field.kind === FormFieldKind.TEXT && (
        <p>
          Nombre moyen de mots par réponse : {averageWordCount !== undefined ? Math.floor(averageWordCount) : '...'}
        </p>
      )}
    </div>
  )
}
