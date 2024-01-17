import { AxiosPromise, AxiosResponse } from 'axios'
import { client } from '.'
import { FormAnswer } from '../shared/types/form-answer.type'
import { FormFieldAnswer } from '../shared/types/form-field-answer.type'
import { TagCloud } from '../shared/types/tag-cloud.type'
import { TextAnswerStats } from '../shared/types/text-answer-stats.type'
import { IntegerAnswerStats } from '../shared/types/integer-answer-stats.type'

type FormFieldAnswerResponse = {
  count: number
  answers: FormFieldAnswer[]
}

type FormAnswerResponse = {
  count: number
  answers: FormAnswer[]
}

export const formAnswerService = {
  create(formAnswer: FormAnswer) {
    return client.post(`/forms/${formAnswer.form}/answers`, formAnswer)
  },
  findAllForForm(formId: string, limit?: number, offset?: number): AxiosPromise<FormAnswerResponse> {
    return client.get<FormAnswerResponse>(`/forms/${formId}/answers`, {
      params: {
        limit,
        offset,
      },
    })
  },
  findAllForField(
    formId: string,
    fieldId: string,
    limit?: number,
    offset?: number,
  ): AxiosPromise<FormFieldAnswerResponse> {
    return client.get<FormFieldAnswerResponse>(`/forms/${formId}/fields/${fieldId}/answers`, {
      params: {
        limit,
        offset,
      },
    })
  },
  findAllStatsForField(
    formId: string,
    fieldId: string,
  ): AxiosPromise<TagCloud[] | TextAnswerStats | IntegerAnswerStats> {
    return client.get<TagCloud[] | TextAnswerStats | IntegerAnswerStats>(`/forms/${formId}/fields/${fieldId}/stats`)
  },
}
