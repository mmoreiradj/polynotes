import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { CreateBlockDto } from '../dto/create-block.dto'
import { UpdateBlockDto } from '../dto/update-block.dto'

@Injectable()
export class BlocksService {
  constructor(private readonly prisma: PrismaService) {}

  create(fileId: number, createBlockDto: CreateBlockDto) {
    return this.prisma.block.create({
      data: {
        fileId,
        ...createBlockDto,
      },
    })
  }

  findMany(fileId: number) {
    return this.prisma.block.findMany({
      where: {
        fileId,
      },
    })
  }

  updateOne(id: number, data: UpdateBlockDto) {
    return this.prisma.block.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    })
  }

  deleteOne(blockId: number) {
    return this.prisma.block.delete({
      where: {
        id: blockId,
      },
    })
  }
}
