import { CheckboxCell } from './checkbox-cell'
import { Column, ColumnKind } from './column.type'
import { DateCell } from './date-cell'
import { EnumCell } from './enum-cell'
import { TextCell } from './text-cell'

type Props = {
  column: Column
  value: string
  rowId: string
  onChange: (newValue: string, columnName: string) => void
}

export const DatabaseCell = ({ column, value, ...props }: Props) => {
  const handleOnChange = (newValue: string) => {
    props.onChange(newValue, column.name)
  }

  const attributes = {
    value,
    onChange: handleOnChange,
  }

  return (
    <>
      {column.kind === ColumnKind.Text && <TextCell {...attributes} />}
      {column.kind === ColumnKind.Date && <DateCell {...attributes} />}
      {column.kind === ColumnKind.Enum && <EnumCell {...attributes} column={column} />}
      {column.kind === ColumnKind.Checkbox && <CheckboxCell {...attributes} />}
    </>
  )
}
