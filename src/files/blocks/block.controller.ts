import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { UserDocument } from 'src/schema/user.schema'
import { BlocksService } from './block.service'
import { CreateBlockDto } from './dto/create-block.dto'

@Controller('files/:file_id/blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Get('')
  findAll(@GetUser() user: UserDocument, @Param('file_id') fileId: string) {
    return this.blocksService.findMany(user.id, fileId)
  }

  @Put('')
  updateOne(@GetUser() user: UserDocument, @Param('file_id') fileId: string, @Body() createBlockDto: CreateBlockDto) {
    return this.blocksService.write(user.id, fileId, createBlockDto)
  }

  @Delete(':id')
  deleteOne(@GetUser() user: UserDocument, @Param('id') blockId: string, @Param('file_id') fileId: string) {
    return this.blocksService.deleteOne(user.id, fileId, blockId)
  }
}
