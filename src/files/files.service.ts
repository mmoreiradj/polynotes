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

  findMany(userId: string, parentId?: string): Promise<FileDocument[]> {
    return this.fileModel
      .find({
        userId,
        parentId,
      })
      .select('-blocks')
      .exec()
  }

  findOne(id: string) {
    return this.fileModel.findById(id).orFail().exec()
  }

  updateOne(id: string, userId: string, updateFileDto: UpdateFileDto) {
    return this.fileModel.findOneAndUpdate({ _id: id, userId }, updateFileDto).setOptions({ new: true }).orFail().exec()
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
