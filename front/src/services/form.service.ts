import { AxiosPromise } from 'axios'
import { client } from '.'
import { Form_ } from '../shared/types/form.type'

export const formService = {
  createOne(): AxiosPromise<Form_> {
    return client.post<Form_>(`forms`, {
      name: 'Untitled Form',
      description: '',
    })
  },
  getOne(formId: string): AxiosPromise<Form_> {
    return client.get<Form_>(`forms/${formId}`)
  },
}
