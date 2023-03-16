import { Controller, Get, Post, Query, Body, Patch, Param, Delete } from '@nestjs/common'
import { WorkspacesService } from './workspaces.service'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { SearchWorkspaceDto } from './dto/search-workspace.dto'
import { GetUser } from 'src/shared/decorators/get-user.decorator'
import { User } from 'src/shared/types'

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspaceService: WorkspacesService) {}

  @Post()
  create(@GetUser() user: User, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(user, createWorkspaceDto)
  }

  @Get()
  findAll(@Query() workspaceDto: SearchWorkspaceDto) {
    return this.workspaceService.findAll(workspaceDto)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.workspaceService.findOne(id)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.workspaceService.update(id, updateWorkspaceDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.workspaceService.remove(id)
  }
}
