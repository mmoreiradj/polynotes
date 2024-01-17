import { FormField } from '../enum/form-field.enum'
import { AccessLevel } from './access-level.type'

export type Form_ = {
  _id: string
  owner: string
  name: string
  description: string
  accessLevel: AccessLevel
  fields: FormField[]
}
