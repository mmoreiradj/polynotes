import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FileDocument } from 'src/schema/file.schema'
import { CreateBlockDto } from './dto/create-block.dto'

export class BlocksService {
  constructor(@InjectModel('File') private readonly fileModel: Model<FileDocument>) {}

  findMany(fileId: string, userId: string) {
    return this.fileModel.findOne({ _id: fileId, userId }).exec()
  }

  write(fileId: string, createBlockDto: CreateBlockDto) {
    return this.fileModel
      .findOneAndUpdate(
        {
          _id: fileId,
        },
        {
          blocks: createBlockDto.blocks,
        },
        {
          new: true,
        },
      )
      .orFail()
      .exec()
      .then((file) => file.blocks)
  }

  deleteOne(userId: string, fileId: string, blockId: string) {
    this.fileModel
      .findOneAndUpdate(
        {
          userId,
          _id: fileId,
        },
        {
          $pull: {
            blocks: {
              _id: blockId,
            },
          },
        },
      )
      .orFail()
      .exec()
  }
}
