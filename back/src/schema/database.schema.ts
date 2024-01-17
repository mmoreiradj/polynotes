import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { ColumnDocument, ColumnSchema } from './column.schema'
import { User } from './user.schema'

export type DatabaseDocument = HydratedDocument<Database>

@Schema()
export class Database {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: Array(ColumnSchema), default: [] })
  columns: ColumnDocument[]

  @Prop({ type: Array, default: [] })
  rows: any[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  userId: string
}

export const DatabaseSchema = SchemaFactory.createForClass(Database)
