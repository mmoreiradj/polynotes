import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export enum FormFieldKind {
  TINYTEXT = 'tinytext',
  TEXT = 'text',
  INTEGER = 'integer',
  SELECT = 'select',
}

export type FormFieldDocument = HydratedDocument<FormField>

@Schema({ strict: true })
export class FormField {
  @Prop({ type: String, required: true, minlength: 1, maxlength: 50 })
  label: string

  @Prop({ type: String, required: false, maxlength: 500 })
  description: string

  @Prop({ type: Boolean, default: false })
  isRequired: boolean

  @Prop({
    type: String,
    required: true,
    enum: Object.values(FormFieldKind),
  })
  kind: FormFieldKind

  @Prop({
    type: Array(String),
    required: function (this: FormField) {
      return this.kind === FormFieldKind.SELECT
    },
    default: undefined,
    maxlength: 10,
    validate: [
      {
        validator: function (this: FormField, value: string[]) {
          return this.kind !== FormFieldKind.SELECT || value.length > 1
        },
        message: 'Select fields must have at least two options',
      },
      {
        validator: function (this: FormField, value: string[]) {
          if (this.kind !== FormFieldKind.SELECT && value !== undefined) {
            return false
          }
          return true
        },
        message: 'Only select fields can have options',
      },
      {
        validator: function (this: FormField, value: string[]) {
          return this.kind !== FormFieldKind.SELECT || value.length === new Set(value).size
        },
        message: 'Options must be unique',
      },
    ],
  })
  options?: string[]

  @Prop({ type: Number, default: 0 })
  version: number
}

export const FormFieldSchema = SchemaFactory.createForClass(FormField)
