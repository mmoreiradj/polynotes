import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ColumnDocument = HydratedDocument<Column>

@Schema()
export class Column {
  @Prop({ type: String, required: true })
  key: string

  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  kind: string

  @Prop({ type: Object, required: false })
  meta: any
}

export const ColumnSchema = SchemaFactory.createForClass(Column)
