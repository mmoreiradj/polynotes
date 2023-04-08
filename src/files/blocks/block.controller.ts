import { Body, Controller, Delete, Get, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { UserDocument } from 'src/schema/user.schema'
import { BlocksService } from './block.service'
import { CreateBlockDto } from './dto/create-block.dto'
import { Public } from 'src/common/shared/decorators/is-public.decorator'
import { FilesService } from '../files.service'
import { OptionalAuth } from 'src/common/shared/decorators/is-optional-auth.decorator'
import { OptionalJwtAuthGuard } from 'src/common/shared/guards/optional-jwt-auth.guard'

@Controller('files/:file_id/blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService, private readonly filesService: FilesService) {}

  @Get('')
  findAll(@GetUser() user: UserDocument, @Param('file_id') fileId: string) {
    return this.blocksService.findMany(user.id, fileId)
  }

  @OptionalAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Put('')
  async updateOne(
    @GetUser() user: UserDocument,
    @Param('file_id') fileId: string,
    @Body() createBlockDto: CreateBlockDto,
  ) {
    const file = await this.filesService.findOne(fileId)

    if (file.userId !== user.id && file.accessLevel !== 'w') {
      throw new NotFoundException()
    }

    return this.blocksService.write(fileId, createBlockDto)
  }

  @Delete(':id')
  deleteOne(@GetUser() user: UserDocument, @Param('id') blockId: string, @Param('file_id') fileId: string) {
    return this.blocksService.deleteOne(user.id, fileId, blockId)
  }
}
