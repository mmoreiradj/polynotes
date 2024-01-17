export enum ColumnKind {
  Text = 'text',
  Date = 'date',
  Enum = 'enum',
  Checkbox = 'checkbox',
}

export const defaultFor = (column: Column) => {
  switch (column.kind) {
    case ColumnKind.Text:
      return ''
    case ColumnKind.Date:
      return new Date()
    case ColumnKind.Enum:
      return column.meta?.[0] ?? 'default'
    case ColumnKind.Checkbox:
      return false
  }
}

export type Column = {
  key: string
  name: string
  kind: ColumnKind
  meta?: string[]
}
