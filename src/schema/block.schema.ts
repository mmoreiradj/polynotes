import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type BlockDocument = HydratedDocument<Block>

@Schema()
export class Block {
  @Prop({ type: String, required: true })
  kind!: string

  @Prop({ type: String, required: true })
  content?: string

  @Prop({ type: Array })
  blocks: any[]
}

export const BlockSchema = SchemaFactory.createForClass(Block)
