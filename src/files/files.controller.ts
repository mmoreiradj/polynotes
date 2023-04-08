import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { UserDocument } from 'src/schema/user.schema'
import { CreateFileDto } from './dto/create-file.dto'
import { UpdateFileDto } from './dto/update-file.dto'
import { FilesService } from './files.service'
import { JwtAuthGuard } from 'src/common/shared/guards/jwt-auth.guard'
import { OptionalJwtAuthGuard } from 'src/common/shared/guards/optional-jwt-auth.guard'
import { OptionalAuth } from 'src/common/shared/decorators/is-optional-auth.decorator'

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

  @OptionalAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async findOne(@GetUser() user: UserDocument, @Param('id') id: string) {
    const file = await this.filesService.findOne(id)

    if (file.userId === user.id) {
      this.filesService.markAsRead(id, user.id)
      return file
    }

    if (file.accessLevel != 'none') {
      return file
    }

    throw new NotFoundException()
  }

  @Patch(':id/access-level')
  updateAccess(
    @GetUser() user: UserDocument,
    @Param('id') id: string,
    @Body('accessLevel') accessLevel: 'r' | 'w' | 'none',
  ) {
    return this.filesService.updateAccess(id, user.id, accessLevel)
  }

  @Patch(':id')
  async updateOne(@GetUser() user: UserDocument, @Param('id') id: string, @Body() data: UpdateFileDto) {
    const file = await this.filesService.findOne(id)
    if (file.userId !== user.id) {
      throw new NotFoundException()
    }

    return this.filesService.updateOne(id, data)
  }

  @Delete(':id')
  deleteOne(@GetUser() user: UserDocument, @Param('id') id: string) {
    return this.filesService.deleteOne(user.id, id)
  }
}
