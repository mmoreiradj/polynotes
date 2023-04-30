import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateFieldDto } from './dto/create-field.dto'
import { FormsService } from '../forms.service'
import { AccessLevel, Form, FormDocument } from '../schema/form.schema'
import { FormFieldDocument, FormFieldKind } from '../schema/form-field.schema'
import { UpdateFieldDto } from './dto/update-field.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

@Injectable()
export class FieldsService {
  constructor(
    private readonly formsService: FormsService,
    @InjectModel(Form.name) private readonly formModel: Model<FormDocument>,
  ) {}

  async create(formId: string, createFieldDto: CreateFieldDto, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    if (createFieldDto.addAfter) {
      const foundIndex = (form.fields as FormFieldDocument[]).findIndex(
        (field) => field._id.toString() === createFieldDto.addAfter,
      )

      if (foundIndex === -1) {
        throw new NotFoundException('Field to add after not found')
      }

      form.fields.splice(foundIndex + 1, 0, createFieldDto.formField)

      form.validateSync()

      return form.save().then((form) => form.fields)
    }
    if (createFieldDto.addAfter) {
    } else {
      return this.formModel
        .updateOne(
          {
            id: formId,
          },
          {
            $push: {
              fields: createFieldDto.formField,
            },
          },
          {
            runValidators: true,
            new: true,
          },
        )
        .orFail()
        .select('+fields')
        .exec()
    }
  }

  async update(formId: string, fieldId: string, updateFieldDto: UpdateFieldDto, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    const foundIndex = form.fields.findIndex((field) => (field as FormFieldDocument)._id.toString() === fieldId)

    if (foundIndex === -1) {
      throw new NotFoundException('Field to update not found')
    }

    const field = form.fields[foundIndex] as FormFieldDocument
    let version = field.version
    if (updateFieldDto.formField.kind !== undefined && updateFieldDto.formField.kind !== field.kind) {
      if (
        !(
          (updateFieldDto.formField.kind === FormFieldKind.SELECT && field.kind === FormFieldKind.TINYTEXT) ||
          (updateFieldDto.formField.kind === FormFieldKind.TINYTEXT && field.kind === FormFieldKind.SELECT)
        )
      ) {
        ++version
      }
    }

    form.fields[foundIndex] = {
      ...field.toObject(),
      ...updateFieldDto.formField,
      version,
    }

    if (updateFieldDto.formField.kind !== FormFieldKind.SELECT) {
      form.fields[foundIndex].options = undefined
    }

    await form.validate()

    return (await form.save()).fields
  }

  async remove(formId: string, fieldId: string, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    return form
      .updateOne({
        $pull: {
          fields: {
            _id: fieldId,
          },
        },
      })
      .orFail()
      .select('+fields')
      .exec()
  }

  async move(formId: string, fieldId: string, moveToId: string, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    const foundIndex = form.fields.findIndex((field) => (field as FormFieldDocument)._id.toString() === fieldId)

    if (foundIndex === -1) {
      throw new NotFoundException('Field to switch not found')
    }

    const withIndex = form.fields.findIndex((field) => (field as FormFieldDocument)._id.toString() === moveToId)

    if (withIndex === -1) {
      throw new NotFoundException('Field to switch with not found')
    }

    const field = form.fields[foundIndex] as FormFieldDocument
    const withField = form.fields[withIndex] as FormFieldDocument

    form.fields[foundIndex] = withField
    form.fields[withIndex] = field

    return form.save()
  }
}
