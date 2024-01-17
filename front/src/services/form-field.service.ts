import { AxiosPromise } from 'axios'
import { client } from '.'
import { FormField, FormFieldKind } from '../shared/enum/form-field.enum'
import { Form_ } from '../shared/types/form.type'

export const formFieldService = {
  createOneAfter(formId: string, fieldId: string): AxiosPromise<FormField[]> {
    return client.post<FormField[]>(`forms/${formId}/fields`, {
      formField: {
        label: 'Untitled Field',
        kind: FormFieldKind.TEXT,
      },
      addAfter: fieldId,
    })
  },
  deleteOne(formId: string, fieldId: string): AxiosPromise<FormField> {
    return client.delete<FormField>(`forms/${formId}/fields/${fieldId}`)
  },
  moveOne(formId: string, fieldId: string, moveToId: string): AxiosPromise<FormField[]> {
    return client.patch<FormField[]>(`forms/${formId}/fields/${fieldId}/move`, {
      moveToId,
    })
  },
  update: (formId: string, fieldId: string, field: Partial<FormField>) => {
    return client.patch<FormField>(`forms/${formId}/fields/${fieldId}`, {
      formField: field,
    })
  },
}
