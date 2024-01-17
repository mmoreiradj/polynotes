import { Button, Table } from 'flowbite-react'
import { useCallback, useEffect, useState } from 'react'
import { Column, defaultFor } from './cells/column.type'
import { Database } from './cells/database.type'
import { Row } from './cells/row.type'
import { ColumnForm } from './column-form'
import { DatabaseRow } from './database-row'
import { v4 as uuid } from 'uuid'
import { databaseService } from '../../../services'
import { TrashIcon } from '@heroicons/react/24/outline'

type Props = {
  database: Database
  onChange: (database: Database) => void
}

const generateRow = (columns: Column[]): Row => {
  const row: Row = {
    key: uuid(),
  }

  columns.forEach((column) => {
    row[column.name] = defaultFor(column)
  })

  return row
}

export const TableView = ({ database }: Props) => {
  const [isAddColFormOpen, setIsAddColFormOpen] = useState<boolean>(false)
  const [columns, setColumns] = useState<Column[]>([])
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    setRows(database.rows)
    setColumns(database.columns)
  }, [database])

  const handleOnAddRow = () => {
    const newRows = [...rows, generateRow(database.columns)]

    setRows(newRows)

    databaseService.updateOne(database._id, {
      ...database,
      rows: newRows,
    })
  }

  const handleOnAddColumn = (column: Column) => {
    const newColumns = [...columns, column]
    const newRows = rows.map((row) => ({
      ...row,
      [column.name]: '',
    }))

    const newDatabase = {
      ...database,
      columns: newColumns,
      rows: newRows,
    }

    setColumns(newColumns)
    setRows(newRows)

    databaseService.updateOne(database._id, newDatabase)
  }

  const handleOnAddRowAbove = (row: Row) => {
    const newRow = generateRow(columns)

    const index = rows.findIndex((r) => r.key === row.key)
    const newRows = [...rows]
    newRows.splice(index, 0, newRow)

    setRows(newRows)
  }

  const handleOnAddRowBelow = (row: Row) => {
    const newRow = generateRow(columns)

    const index = rows.findIndex((r) => r.key === row.key)
    const newRows = [...rows]
    newRows.splice(index + 1, 0, newRow)

    setRows(newRows)

    databaseService.updateOne(database._id, {
      ...database,
      rows: newRows,
    })
  }

  const handleOnDeleteRow = (row: Row) => {
    const index = rows.findIndex((r) => r.key === row.key)
    const newRows = [...rows]
    newRows.splice(index, 1)

    setRows(newRows)

    databaseService.updateOne(database._id, {
      ...database,
      rows: newRows,
    })
  }

  const handleOnChange = (row: Row) => {
    const index = rows.findIndex((r) => r.key === row.key)
    const newRows = [...rows]
    newRows[index] = row

    setRows(newRows)

    databaseService.updateOne(database._id, {
      ...database,
      rows: newRows,
    })
  }

  const handleOnDeleteColumn = (index: number) => {
    const newColumns = [...columns]
    newColumns.splice(index, 1)

    const newRows = rows.map((row) => {
      const newRow = { ...row }
      delete newRow[columns[index].name]
      return newRow
    })

    setColumns(newColumns)
    setRows(newRows)

    databaseService.updateOne(database._id, {
      ...database,
      columns: newColumns,
      rows: newRows,
    })
  }
  return (
    <div>
      <div className="flex flex-row mt-2 mb-2">
        <Button color="purple" className="mr-2" onClick={() => handleOnAddRow()} disabled={columns.length === 0}>
          Add Row
        </Button>
        <Button color="purple" onClick={() => setIsAddColFormOpen(true)}>
          Add Column
        </Button>
      </div>
      <ColumnForm onClose={() => setIsAddColFormOpen(false)} onCreate={handleOnAddColumn} isShown={isAddColFormOpen} />
      <Table>
        <Table.Head>
          <Table.HeadCell />
          {columns.map((column, i) => (
            <Table.HeadCell key={i}>
              <div className="flex flex-row">
                <span>{column.name}</span>
                <TrashIcon onClick={() => handleOnDeleteColumn(i)} className="h-4 w-4" />
              </div>
            </Table.HeadCell>
          ))}
        </Table.Head>
        <Table.Body className="divide-y">
          {rows.map((row) => (
            <DatabaseRow
              key={row.key}
              row={row}
              columns={columns}
              onAddRowAbove={handleOnAddRowAbove}
              onAddRowBelow={handleOnAddRowBelow}
              onDeleteRow={handleOnDeleteRow}
              onChange={(row) => handleOnChange(row)}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
