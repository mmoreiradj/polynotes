import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { UserDocument } from 'src/schema/user.schema'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('')
  findAll(@GetUser() user: UserDocument, @Query('parent_id') parentId?: string) {
    return this.filesService.findMany(user.id, parentId)
  }

  @Post('')
  createOne(@GetUser() user: UserDocument, @Body() createFileDto: CreateFileDto) {
    return this.filesService.createOne(user.id, createFileDto)
  }

  @Get('recent')
  findRecent(@GetUser() user: UserDocument, @Query('limit') limit = 10) {
    return this.filesService.findRecent(user.id, limit)
  }

  @Get(':id')
  async findOne(@GetUser() user: UserDocument, @Param('id') id: string) {
    const file = await this.filesService.findOne(id)
    if (file.userId !== user.id) {
      throw new NotFoundException()
    }
    this.filesService.markAsRead(id, userId)
    return file
  }

  @Patch(':id')
  updateOne(@GetUser() user: UserDocument, @Param('id') id: string, @Body() data: UpdateFileDto) {
    return this.filesService.updateOne(id, user.id, data)
  }

  @Delete(':id')
  deleteOne(@GetUser() user: UserDocument, @Param('id') id: string) {
    return this.filesService.deleteOne(user.id, id)
  }
}
