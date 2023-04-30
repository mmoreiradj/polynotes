import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { FormsService } from '../forms.service'
import { AccessLevel } from '../schema/form.schema'
import { InjectModel } from '@nestjs/mongoose'
import { FormAnswer, FormAnswerDocument } from '../schema/form-answer.schema'
import mongoose, { Model, Error } from 'mongoose'
import { FormFieldDocument, FormFieldKind } from '../schema/form-field.schema'
import { FormFieldAnswer } from '../schema/form-field-answer.schema'

@Injectable()
export class AnswersService {
  constructor(
    private readonly formsService: FormsService,
    @InjectModel(FormAnswer.name) private readonly formAnswerModel: Model<FormAnswerDocument>,
  ) {}

  async findAll(formId: string, offset: number, limit: number, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    const stage2 = []

    if (offset !== undefined) {
      stage2.push({ $skip: offset })
    }

    if (limit !== undefined) {
      stage2.push({ $limit: limit })
    }

    return this.formAnswerModel
      .aggregate()
      .match({ form: new mongoose.Types.ObjectId(formId) })
      .facet({
        stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],
        stage2,
      })
      .unwind({
        path: '$stage1',
      })
      .project({
        count: '$stage1.count',
        answers: '$stage2',
      })
      .exec()
      .then((result) => {
        if (result.length === 0) {
          return {
            count: 0,
            answers: [],
          }
        }
        return {
          count: result[0].count,
          answers: result[0].answers,
        }
      })
  }

  async create(formId: string, answers: FormFieldAnswer[]) {
    try {
      const form = await this.formsService.findOne(formId)

      const formAnswer = new this.formAnswerModel({ form: formId, answers: answers })

      await formAnswer.validate()

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

      formAnswer.answers = formAnswer.answers.map((answer) => {
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

        answer.version = field.version

        return answer
      })

      return formAnswer.save()
    } catch (error) {
      if (error instanceof Error && error.name === Error.CastError.name) {
        throw new NotFoundException(400, 'Specified form does not exist')
      }

      throw error
    }
  }

  async fieldAnswers(formId: string, answerId: string, offset: number, limit: number, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    const found = (form.fields as FormFieldDocument[]).filter((field) => field._id)

    if (!found) {
      throw new NotFoundException()
    }

    const field = found[0]

    return this.formAnswerModel
      .aggregate()
      .match({
        form: new mongoose.Types.ObjectId(formId),
        'answers.formField': new mongoose.Types.ObjectId(answerId),
        'answers.version': field.version,
      })
      .project({
        answers: {
          $filter: {
            input: '$answers',
            as: 'answer',
            cond: {
              $eq: ['$$answer.formField', new mongoose.Types.ObjectId(answerId)],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .replaceRoot('$answers')
      .facet({
        stage1: [{ $group: { _id: null, count: { $sum: 1 } } }],
        stage2: [{ $skip: offset }, { $limit: limit }],
      })
      .project({
        count: '$stage1.count',
        answers: '$stage2',
      })
      .exec()
      .then((result) => {
        if (result[0].count?.length === 0) {
          return {
            count: 0,
            answers: [],
          }
        }
        return {
          count: result[0].count[0],
          answers: result[0].answers,
        }
      })
  }

  async fieldStats(formId: string, fieldId: string, offset: number, limit: number, userId?: string) {
    const form = await this.formsService.findOne(formId)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    const found = (form.fields as FormFieldDocument[]).filter((field) => field._id.toString() === fieldId)

    if (found.length === 0) {
      throw new NotFoundException()
    }

    const field = found[0]

    switch (field.kind) {
      case FormFieldKind.SELECT:
      case FormFieldKind.TINYTEXT:
        return this.fieldStatsForTinyTextOrSelect(fieldId, field.version, offset, limit)
      case FormFieldKind.TEXT:
        return this.fieldStatsForText(fieldId, field.version, offset, limit)
      case FormFieldKind.INTEGER:
        return this.fieldStatsForInteger(fieldId, field.version)
      default:
        throw new BadRequestException(`Unsupported field kind ${field.kind}`)
    }
  }

  fieldStatsForText(fieldId: string, version: number, offset: number, limit: number) {
    return this.formAnswerModel
      .aggregate()
      .match({
        'answers.formField': new mongoose.Types.ObjectId(fieldId),
        'answers.version': version,
      })
      .project({
        answers: {
          $filter: {
            input: '$answers',
            as: 'answer',
            cond: {
              $eq: ['$$answer.formField', new mongoose.Types.ObjectId(fieldId)],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .replaceRoot('$answers')
      .project({
        wc: {
          $size: {
            $regexFindAll: {
              input: '$value',
              regex: /\b\w+\b/,
            },
          },
        },
        occurences: {
          $regexFindAll: {
            input: '$value',
            regex: /\b\w+\b/,
          },
        },
      })
      .facet({
        averageWordCount: [
          {
            $group: {
              _id: null,
              avg: {
                $avg: '$wc',
              },
            },
          },
        ],
        occurences: [
          {
            $unwind: '$occurences',
          },
          {
            $group: {
              _id: '$occurences.match',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
          {
            $skip: offset,
          },
          {
            $limit: limit,
          },
        ],
      })
      .exec()
      .then((result) => {
        return {
          averageWordCount: result[0].averageWordCount[0].avg,
          occurences: result[0].occurences,
        }
      })
  }

  async fieldStatsForInteger(fieldId: string, version: number) {
    return this.formAnswerModel
      .aggregate()
      .match({
        'answers.formField': new mongoose.Types.ObjectId(fieldId),
        'answers.version': version,
      })
      .project({
        answers: {
          $filter: {
            input: '$answers',
            as: 'answer',
            cond: {
              $eq: ['$$answer.formField', new mongoose.Types.ObjectId(fieldId)],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .replaceRoot('$answers')
      .facet({
        averageStage: [
          {
            $group: {
              _id: null,
              average: {
                $avg: '$value',
              },
            },
          },
        ],
        medianStage: [
          {
            $sort: {
              sortedValues: 1,
            },
          },
          {
            $group: {
              _id: null,
              median: {
                $accumulator: {
                  lang: 'js',
                  accumulateArgs: ['$value'],
                  init: function () {
                    return []
                  },
                  accumulate: function (values, value) {
                    return values.concat(value)
                  },
                  merge: function (value1, value2) {
                    return value1.concat(value2)
                  },
                  finalize: function (values) {
                    values.sort(function (a, b) {
                      return a - b
                    })
                    const mid = values.length / 2
                    return mid % 1 ? values[mid - 0.5] : (values[mid - 1] + values[mid]) / 2
                  },
                },
              },
            },
          },
        ],
        minStage: [
          {
            $group: {
              _id: null,
              min: { $min: '$value' },
            },
          },
        ],
        maxStage: [
          {
            $group: {
              _id: null,
              max: { $max: '$value' },
            },
          },
        ],
      })
      .project({
        average: {
          $reduce: {
            input: '$averageStage',
            initialValue: 0,
            in: {
              $sum: ['$$value', '$$this.average'],
            },
          },
        },
        median: {
          $reduce: {
            input: '$medianStage',
            initialValue: 0,
            in: {
              $sum: ['$$value', '$$this.median'],
            },
          },
        },
        min: {
          $reduce: {
            input: '$minStage',
            initialValue: 0,
            in: {
              $sum: ['$$value', '$$this.min'],
            },
          },
        },
        max: {
          $reduce: {
            input: '$maxStage',
            initialValue: 0,
            in: {
              $sum: ['$$value', '$$this.max'],
            },
          },
        },
      })
      .exec()
      .then((result) => {
        return {
          average: result[0].average,
          median: result[0].median,
          min: result[0].min,
          max: result[0].max,
        }
      })
  }

  async fieldStatsForTinyTextOrSelect(fieldId: string, version: number, offset: number, limit: number) {
    return this.formAnswerModel
      .aggregate()
      .match({
        'answers.formField': new mongoose.Types.ObjectId(fieldId),
        'answers.version': version,
      })
      .project({
        answers: {
          $filter: {
            input: '$answers',
            as: 'answer',
            cond: {
              $eq: ['$$answer.formField', new mongoose.Types.ObjectId(fieldId)],
            },
          },
        },
      })
      .unwind({
        path: '$answers',
      })
      .replaceRoot('$answers')
      .group({
        _id: '$value',
        count: {
          $count: {},
        },
      })
      .sort({
        count: -1,
      })
      .skip(offset)
      .limit(limit)
      .exec()
  }
}
