import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { UserDocument } from 'src/schema/user.schema'
import { DatabasesService } from './databases.service'
import { CreateDatabaseDto } from './dto/create-database.dto'
import { UpdateDatabaseDto } from './dto/update-database.dto'

@Controller('databases')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}

  @Post()
  create(@GetUser() user: UserDocument, @Body() createDatabaseDto: CreateDatabaseDto) {
    return this.databasesService.create(user.id, createDatabaseDto)
  }

  @Get()
  findAll(@GetUser() userId: string) {
    return this.databasesService.findAll(userId)
  }

  @Get(':id')
  findOne(@GetUser() user: UserDocument, @Param('id') id: string) {
    return this.databasesService.findOne(id, user.id)
  }

  @Put(':id')
  update(@GetUser() user: UserDocument, @Param('id') id: string, @Body() updateDatabaseDto: UpdateDatabaseDto) {
    return this.databasesService.update(id, user.id, updateDatabaseDto)
  }

  @Delete(':id')
  remove(@GetUser() user: UserDocument, @Param('id') id: string) {
    return this.databasesService.remove(id, user.id)
  }
}
