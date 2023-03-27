import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { CreateFileDto } from '../dto/create-file.dto'
import { FilesService } from '../services/files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('')
  findAll(@GetUser() user: User, @Query('parent_id') parentId: number | undefined) {
    return this.filesService.findMany(user.id, parentId)
  }

  @Post('')
  createOne(@GetUser() user: User, @Body() createFileDto: CreateFileDto) {
    return this.filesService.createOne(user.id, createFileDto)
  }

  @Get(':id')
  async findOne(@GetUser() user: User, @Param('id') id: number) {
    const file = await this.filesService.findOne(id)
    if (file.userId !== user.id) {
      throw new NotFoundException()
    }
    return file
  }

  @Patch(':id')
  updateOne(@GetUser() user: User, @Param('id') id: number, @Body() data: CreateFileDto) {
    return this.filesService.updateOne(user.id, id, data)
  }

  @Delete(':id')
  deleteOne(@GetUser() user: User, @Param('id') id: number) {
    return this.filesService.deleteOne(user.id, id)
  }
}
