import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument, Types } from 'mongoose'
import { BlockDocument, BlockSchema } from './block.schema'
import { User } from './user.schema'

export type FileDocument = HydratedDocument<_File>

@Schema({ timestamps: true })
export class _File {
  @Prop({ type: String, required: true })
  name!: string

  @Prop({ type: Boolean, default: false, required: true })
  isDirectory: boolean

  @Prop({ default: Date.now })
  createdAt!: Date

  @Prop({ default: Date.now })
  updatedAt!: Date

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: User

  @Prop({ type: Types.ObjectId, ref: _File.name })
  parentId: _File

  @Prop({ type: Array })
  blocks: any[]
}

export const FileSchema = SchemaFactory.createForClass(_File)
