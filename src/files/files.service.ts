import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FileDocument } from 'src/schema/file.schema'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'

@Injectable()
export class FilesService {
  constructor(@InjectModel('File') private readonly fileModel: Model<FileDocument>) {}

  createOne(userId: string, createFileDto: CreateFileDto): Promise<FileDocument> {
    const file = new this.fileModel({
      ...createFileDto,
      userId,
    })
    return file.save()
  }

  markAsRead(fileId: string, userId: number) {
    return this.fileModel
      .findOneAndUpdate(
        {
          userId,
          _id: fileId,
        },
        {
          $set: {
            lastAccessed: new Date(),
          },
        },
      )
      .exec()
  }

  findMany(userId: string, parentId?: string): Promise<FileDocument[]> {
    return this.fileModel
      .find({
        userId,
        parentId,
      })
      .select('-blocks')
      .exec()
  }

  findRecent(userId: string, limit: number): Promise<FileDocument[]> {
    return this.fileModel
      .find({
        userId,
      })
      .sort({ lastAccessed: -1 })
      .limit(limit)
      .select('-blocks')
      .exec()
  }

  findOne(id: string) {
    return this.fileModel.findById(id).orFail().exec()
  }

  updateAccess(id: string, userId: string, accessLevel: 'r' | 'w' | 'none') {
    return this.fileModel
      .findOneAndUpdate({ _id: id, userId }, { accessLevel: accessLevel })
      .setOptions({ new: true })
      .select('-blocks')
      .orFail()
      .exec()
  }

  updateOne(id: string, updateFileDto: UpdateFileDto) {
    return this.fileModel.findOneAndUpdate({ _id: id }, updateFileDto).setOptions({ new: true }).orFail().exec()
  }

  deleteOne(userId: string, fileId: string) {
    return this.fileModel
      .findOneAndDelete({
        _id: fileId,
        userId,
      })
      .orFail()
      .exec()
  }
}
