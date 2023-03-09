import { Controller, Get, Post, Query, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common'
import { WorkspacesService } from './workspaces.service'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { ParseObjectIdPipe } from 'src/shared/pipes/object-id.pipe'
import { ObjectId } from 'mongoose'
import { SearchWorkspaceDto } from './dto/search-workspace.dto'

@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspaceService: WorkspacesService) {}

  @Post()
  create(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return this.workspaceService.create(createWorkspaceDto)
  }

  @Get()
  findAll(@Query() workspaceDto: SearchWorkspaceDto) {
    return this.workspaceService.findAll(workspaceDto)
  }

  @Get(':id')
  async findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const workspace = await this.workspaceService.findOne(id)
    if (!workspace) {
      throw new NotFoundException('File not found')
    }
    return workspace
  }

  @Patch(':id')
  async update(@Param('id', ParseObjectIdPipe) id: ObjectId, @Body() updateWorkspaceDto: UpdateWorkspaceDto) {
    const workspace = await this.workspaceService.update(id, updateWorkspaceDto)
    if (!workspace) {
      throw new NotFoundException('File not found')
    }
    return workspace
  }

  @Delete(':id')
  async remove(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const res = await this.workspaceService.remove(id)
    if (!res) {
      throw new NotFoundException('Workspace not found')
    }
    return res
  }
}
