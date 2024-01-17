import { Column } from './column.type'
import { Row } from './row.type'

export type Database = {
  _id: string
  name: string
  columns: Column[]
  rows: Row[]
}
