import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'
import { Form } from './form.schema'
import { FormFieldAnswer, FormFieldAnswerSchema } from './form-field-answer.schema'

export type FormAnswerDocument = HydratedDocument<FormAnswer>

@Schema()
export class FormAnswer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Form.name, required: true })
  form: Form

  @Prop({ type: Array(FormFieldAnswerSchema), required: true, maxlength: 50 })
  answers: FormFieldAnswer[]
}

export const FormAnswerSchema = SchemaFactory.createForClass(FormAnswer)
