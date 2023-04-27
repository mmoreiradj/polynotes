import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateFormDto } from './dto/update-form.dto'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AccessLevel, Form, FormDocument } from './schema/form.schema'
import { CreateFormDto } from './dto/create-form.dto'

@Injectable()
export class FormsService {
  constructor(@InjectModel(Form.name) private readonly formModel: Model<FormDocument>) {}

  async create(userId: string, createFormDto: CreateFormDto) {
    const form = new this.formModel({
      ...createFormDto,
      owner: userId,
      fields: [
        {
          label: 'Small text',
          kind: 'tinytext',
          description: 'A small text field',
        },
      ],
    })

    form.validateSync()

    return form.save()
  }

  findAll(userId: string) {
    return this.formModel
      .find({
        owner: userId,
      })
      .select('-owner -__v -fields')
      .exec()
  }

  findOne(id: string) {
    return this.formModel.findById(id).orFail().exec()
  }

  async update(id: string, updateFormDto: UpdateFormDto, userId?: string | undefined) {
    const form = await this.findOne(id)
    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }

    form.set(updateFormDto)

    form.validateSync()

    return form.save()
  }

  updateAccessLevel(id: string, accessLevel: AccessLevel, userId: string) {
    return this.formModel.updateOne(
      {
        _id: id,
        owner: userId,
      },
      {
        accessLevel,
      },
      {
        runValidators: true,
        new: true,
      },
    )
  }

  async remove(id: string, userId?: string | undefined) {
    const form = await this.findOne(id)

    if (form.owner._id.toString() !== userId && form.accessLevel !== AccessLevel.PUBLIC_WRITE) {
      throw new NotFoundException()
    }
    return form.deleteOne()
  }
}
