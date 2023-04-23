import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { FormField } from './form-field.schema'

export type FormFieldAnswerDocument = HydratedDocument<FormFieldAnswer>

@Schema({ _id: false })
export class FormFieldAnswer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: FormField.name, required: true })
  formField: FormField

  @Prop({ type: String, required: true })
  value: string
}

export const FormFieldAnswerSchema = SchemaFactory.createForClass(FormFieldAnswer)
