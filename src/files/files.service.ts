import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { CreateFileDto } from './dto/create-file.dto'
import { SearchFileDto } from './dto/search-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { File, FileDocument } from './schema/file.schema'

@Injectable()
export class FilesService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  create(createFileDto: CreateFileDto): Promise<FileDocument> {
    const createdFile = new this.fileModel(createFileDto)
    return createdFile.save()
  }

  findAll(fileDto: SearchFileDto): Promise<FileDocument[]> {
    return this.fileModel.find(fileDto).exec()
  }

  findOne(id: ObjectId): Promise<FileDocument> {
    return this.fileModel.findById(id).exec()
  }

  update(id: ObjectId, updateFileDto: UpdateFileDto): Promise<FileDocument> {
    return this.fileModel
      .findOneAndUpdate(
        {
          _id: id,
        },
        updateFileDto,
      )
      .exec()
  }

  remove(id: ObjectId) {
    return this.fileModel
      .findOneAndRemove({
        _id: id,
      })
      .exec()
  }
}
