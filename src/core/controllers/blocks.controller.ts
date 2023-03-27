import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { CreateBlockDto } from '../dto/create-block.dto'
import { UpdateBlockDto } from '../dto/update-block.dto'
import { BlocksService } from '../services/blocks.service'
import { FilesService } from '../services/files.service'

@Controller('files/:file_id/blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService, private readonly filesService: FilesService) {}

  @Post('')
  async createOne(@GetUser() user: User, @Param('file_id') fileId: number, @Body() createBlockDto: CreateBlockDto) {
    const file = await this.filesService.findOne(fileId)
    if (file.userId !== user.id) {
      throw new NotFoundException()
    }
    return this.blocksService.create(fileId, createBlockDto)
  }

  @Get('')
  async findAll(@GetUser() user: User, @Param('file_id') fileId: number) {
    const file = await this.filesService.findOne(fileId)
    if (file.userId !== user.id) {
      throw new NotFoundException()
    }
    return this.blocksService.findMany(fileId)
  }

  @Patch(':block_id')
  async updateOne(
    @GetUser() user: User,
    @Param('file_id') fileId: number,
    @Param('block_id') blockId: number,
    @Body() updateBlockDto: UpdateBlockDto,
  ) {
    const file = await this.filesService.findOne(fileId)
    if (file.userId !== user.id) {
      throw new NotFoundException()
    }
    return this.blocksService.updateOne(blockId, updateBlockDto)
  }

  @Delete(':block_id')
  async deleteOne(@GetUser() user: User, @Param('file_id') fileId: number, @Param('block_id') blockId: number) {
    const file = await this.filesService.findOne(fileId)
    if (file.userId !== user.id) {
      throw new NotFoundException()
    }
    return this.blocksService.deleteOne(blockId)
  }
}
