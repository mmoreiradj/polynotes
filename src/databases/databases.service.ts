import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { DatabaseDocument } from 'src/schema/database.schema'
import { CreateDatabaseDto } from './dto/create-database.dto'
import { UpdateDatabaseDto } from './dto/update-database.dto'

@Injectable()
export class DatabasesService {
  constructor(@InjectModel('Database') private readonly databaseModel: Model<DatabaseDocument>) {}

  create(userId: string, createDatabaseDto: CreateDatabaseDto) {
    const newDatabase = new this.databaseModel({
      ...createDatabaseDto,
      userId,
    })
    return newDatabase.save()
  }

  findAll(userId: string) {
    return this.databaseModel
      .find({
        userId: new mongoose.Types.ObjectId(userId),
      })
      .select('-columns -rows')
      .exec()
  }

  findOne(id: string, userId: string) {
    return this.databaseModel
      .findOne({
        _id: id,
        userId,
      })
      .orFail()
      .exec()
  }

  update(id: string, userId: string, updateDatabaseDto: UpdateDatabaseDto) {
    return this.databaseModel
      .findOneAndUpdate(
        {
          _id: id,
          userId,
        },
        updateDatabaseDto,
        {
          new: true,
        },
      )
      .orFail()
      .exec()
  }

  remove(id: string, userId: string) {
    return this.databaseModel
      .findOneAndDelete({
        _id: id,
        userId,
      })
      .orFail()
      .exec()
  }
}
