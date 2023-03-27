import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { CreateFileDto } from '../dto/create-file.dto'
import { UpdateFileDto } from '../dto/update-file.dto'

@Injectable()
export class FilesService {
  constructor(private readonly prisma: PrismaService) {}

  createOne(userId: number, createFileDto: CreateFileDto) {
    return this.prisma.file.create({
      data: {
        ...createFileDto,
        userId,
      },
    })
  }

  findMany(userId: number, parentId: number | null) {
    return this.prisma.file.findMany({
      where: {
        parentId: parentId || null,
        userId,
      },
    })
  }

  findOne(id: number) {
    return this.prisma.file.findFirstOrThrow({
      where: { id },
    })
  }

  updateOne(userId: number, fileId: number, updateFileDto: UpdateFileDto) {
    return this.prisma.file.updateMany({
      where: {
        id: fileId,
        userId,
      },
      data: {
        ...updateFileDto,
      },
    })
  }

  deleteOne(userId: number, fileId: number) {
    return this.prisma.file.deleteMany({
      where: {
        id: fileId,
        userId,
      },
    })
  }
}
