import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { User, UserDocument } from 'src/schema/user.schema'
import { FormField, FormFieldSchema } from './form-field.schema'

export enum AccessLevel {
  PUBLIC_READ = 'r',
  PUBLIC_WRITE = 'w',
  PRIVATE = 'private',
}

export type FormDocument = HydratedDocument<Form>

@Schema()
export class Form {
  @Prop({ type: String, enum: Object.values(AccessLevel), default: AccessLevel.PRIVATE })
  accessLevel: AccessLevel

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  owner: UserDocument

  @Prop({ type: Array(FormFieldSchema), required: true, maxlength: 50 })
  fields: FormField[]
}

export const FormSchema = SchemaFactory.createForClass(Form)
