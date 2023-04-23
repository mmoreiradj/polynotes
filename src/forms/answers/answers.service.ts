import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { FormsService } from '../forms.service'
import { AccessLevel } from '../schema/form.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FormAnswer, FormAnswerDocument } from '../schema/form-answer.schema'
import { Model } from 'mongoose'
import { FormFieldDocument, FormFieldKind } from '../schema/form-field.schema'
import { FormFieldAnswer } from '../schema/form-field-answer.schema'

@Injectable()
export class AnswersService {
  constructor(
    private readonly formsService: FormsService,
    @InjectModel(FormAnswer.name) private readonly formAnswerModel: Model<FormAnswerDocument>,
  ) {}

  async findAll(formId: string, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    return this.formAnswerModel.find({ form: formId }).exec()
  }

  async create(formId: string, answers: FormFieldAnswer[], userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    const formAnswer = new this.formAnswerModel({ form: formId, answers: answers })

    await formAnswer.validate()

    // check if all required fields are present
    const requiredFieldIds = (form.fields as FormFieldDocument[])
      .filter((field) => field.isRequired)
      .map((field) => field._id.toString())
    const answerFieldIds = answers.map((answer) => answer.formField.toString())

    for (const requiredFieldId of requiredFieldIds) {
      if (!answerFieldIds.includes(requiredFieldId)) {
        throw new BadRequestException(`Required field ${requiredFieldId} not present`)
      }
    }

    const fieldSet = new Map<string, FormFieldDocument>()
    ;(form.fields as FormFieldDocument[]).forEach((field) => fieldSet.set(field._id.toString(), field))

    for (const answer of formAnswer.answers) {
      const field = fieldSet.get(answer.formField.toString())

      if (!field) {
        throw new BadRequestException(`Form field for answer ${JSON.stringify(answer)} not found`)
      }

      if (field.kind === FormFieldKind.SELECT && !field.options.includes(answer.value)) {
        throw new BadRequestException(`Invalid answer for field ${field.label}`)
      }

      if (field.kind === FormFieldKind.INTEGER && isNaN(parseInt(answer.value))) {
        throw new BadRequestException(`Invalid answer for field ${field.label}`)
      }
    }

    return formAnswer.save()
  }
}
