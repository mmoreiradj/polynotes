import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common'
import { FilesService } from './files.service'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { ObjectId } from 'mongoose'
import { ParseObjectIdPipe } from 'src/shared/pipes/object-id.pipe'
import { SearchFileDto } from './dto/search-file.dto'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Body() createFolderDto: CreateFileDto) {
    return this.filesService.create(createFolderDto)
  }

  @Get()
  findAll(@Query() fileDto: SearchFileDto) {
    return this.filesService.findAll(fileDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const file = await this.filesService.findOne(id)
    if (!file) {
      throw new NotFoundException('File not found')
    }
    return file
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateFileDto: UpdateFileDto) {
    const file = await this.filesService.update(id, updateFileDto)
    if (!file) {
      throw new NotFoundException('File not found')
    }
    return file
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const res = await this.filesService.remove(id)
    if (!res) {
      throw new NotFoundException('File not found')
    }
    return res
  }
}
