export enum FormFieldKind {
  TINYTEXT = 'tinytext',
  TEXT = 'text',
  INTEGER = 'integer',
  SELECT = 'select',
}

export type FormField = {
  _id: string
  label: string
  description?: string
  isRequired?: boolean
  kind: FormFieldKind
  options?: string[]
}
