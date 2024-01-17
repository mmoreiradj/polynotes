import { Select } from 'flowbite-react'
import { CellProps } from './cell-props.type'
import { Column } from './column.type'

export const EnumCell = ({ value, column, ...props }: CellProps & { column: Column }) => {
  if (!column.meta) throw new Error('EnumCell requires column.meta.options to be defined')

  const handleOnChange = (value: string) => {
    props.onChange(value)
  }

  return (
    <Select onChange={(e) => handleOnChange(e.target.value)} value={value}>
      {column.meta.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Select>
  )
}
