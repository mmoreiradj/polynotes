import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'

export type FileDocument = HydratedDocument<File>

@Schema({ timestamps: true })
export class File {
  @Prop({ required: true })
  name: string
  @Prop({ required: true, default: true })
  isDirectory: boolean
  @Prop({ type: Types.ObjectId, ref: 'File', required: false })
  parent?: Types.ObjectId
}

export const FileSchema = SchemaFactory.createForClass(File)
