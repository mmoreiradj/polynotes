import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { FileDocument } from 'src/schema/file.schema'
import { CreateBlockDto } from './dto/create-block.dto'
import { UpdateBlockDto } from './dto/udpate-block.dto'

export class BlocksService {
  constructor(@InjectModel('File') private readonly fileModel: Model<FileDocument>) {}

  findMany(fileId: string, userId: string) {
    return this.fileModel.findOne({ _id: fileId, userId }).exec()
  }

  write(userId: string, fileId: string, createBlockDto: CreateBlockDto) {
    return this.fileModel
      .findOneAndUpdate(
        {
          _id: fileId,
          userId,
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

  createOneLayout(userId: string, fileId: string, createBlockDto: CreateBlockDto) {
    // const pushedBlock: any = {
    //   $each: [
    //     {
    //       kind: 'layout',
    //       blocks: [
    //         {
    //           _id: new mongoose.Types.ObjectId(),
    //           kind: 'paragraph',
    //           content: '',
    //         },
    //         {
    //           _id: new mongoose.Types.ObjectId(),
    //           kind: 'paragraph',
    //           content: '',
    //         },
    //       ],
    //     },
    //   ],
    // }
    // let filter: any
    // if (createBlockDto.position != undefined) {
    //   pushedBlock.$position = createBlockDto.position
    //   filter = { $slice: [createBlockDto.position, 1] }
    // } else {
    //   filter = { $slice: -1 }
    // }
    // return this.fileModel
    //   .findOneAndUpdate(
    //     {
    //       userId,
    //       _id: fileId,
    //     },
    //     {
    //       $push: {
    //         blocks: pushedBlock,
    //       },
    //     },
    //     {
    //       new: true,
    //     },
    //   )
    //   .select({ blocks: filter })
    //   .orFail()
    //   .exec()
    //   .then((file) => file.blocks[0])
  }

  updateOne(userId: string, fileId: string, blockId: string, data: UpdateBlockDto) {
    const newData = {}

    if (data.kind) {
      newData['blocks.$.kind'] = data.kind
    }

    if (data.content) {
      newData['blocks.$.content'] = data.content
    }

    return this.fileModel
      .findOneAndUpdate(
        {
          userId,
          _id: fileId,
          $or: [
            {
              'blocks._id': blockId,
            },
            {
              $exists: 'blocks.blocks',
              'blocks.blocks._id': blockId,
            },
          ],
        },
        {
          $set: newData,
        },
        {
          new: true,
        },
      )
      .select({ blocks: { $elemMatch: { _id: blockId } } })
      .orFail()
      .exec()
      .then((file) => file.blocks[0])
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
