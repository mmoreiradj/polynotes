import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { Table, Dropdown } from 'flowbite-react'
import { memo, useContext, useMemo } from 'react'
import { DatabaseCell } from './cells/base-cell'
import { Column } from './cells/column.type'
import type { Row } from './cells/row.type'

type Props = {
  columns: Column[]
  row: Row
  onChange: (row: Row) => void
  onAddRowAbove: (row: Row) => void
  onAddRowBelow: (row: Row) => void
  onDeleteRow: (row: Row) => void
}

export const DatabaseRow = ({ columns, row, onChange, onAddRowAbove, onAddRowBelow, onDeleteRow }: Props) => {
  const handleOnChange = (newValue: string, columnName: string) => {
    onChange({
      ...row,
      [columnName]: newValue,
    })
  }

  return (
    <Table.Row>
      <Table.Cell>
        <Dropdown arrowIcon={false} inline label={<EllipsisVerticalIcon className={'w-6 h-6'} />}>
          <Dropdown.Item onClick={() => onAddRowAbove(row)}>Add above</Dropdown.Item>
          <Dropdown.Item onClick={() => onAddRowBelow(row)}>Add below</Dropdown.Item>
          <Dropdown.Item onClick={() => onDeleteRow(row)}>Delete</Dropdown.Item>
        </Dropdown>
      </Table.Cell>
      {columns.map((column, i) => (
        <Table.Cell key={i}>
          <DatabaseCell value={row[column.name]} column={column} rowId={row.key} onChange={handleOnChange} />
        </Table.Cell>
      ))}
    </Table.Row>
  )
}
