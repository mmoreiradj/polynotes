import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { AccessLevel } from 'src/forms/schema/form.schema'

export type BlockDocument = HydratedDocument<Block>

export enum BlockKind {
  PARAGRAPH = 'paragraph', // paragraph, bullet list
  HEADING = 'heading', // headings only
  IMAGE = 'image', // images, gifs, videos, etc
  LAYOUT = 'layout', // split blocks in two
  CODE_BLOCK = 'code', // code blocks
  DATABASE_VIEW = 'database', // database view
  FORM = 'form', // form
}

@Schema()
export class Block {
  @Prop({ type: String, required: true })
  kind!: string

  @Prop({ type: String, required: true })
  content?: string

  @Prop({ type: Array })
  blocks: any[]

  @Prop({ type: Object })
  meta?: any
}

export const BlockSchema = SchemaFactory.createForClass(Block)
