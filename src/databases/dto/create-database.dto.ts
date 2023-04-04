import { IsNotEmpty } from 'class-validator'
import { ColumnDocument } from 'src/schema/column.schema'

export class CreateDatabaseDto {
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  columns: ColumnDocument[]
  @IsNotEmpty()
  rows: any[]
}
