import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { SearchWorkspaceDto } from './dto/search-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'
import { Workspace, WorkspaceDocument } from './schema/workspace.schema'

@Injectable()
export class WorkspacesService {
  constructor(@InjectModel(Workspace.name) private workspaceModel: Model<WorkspaceDocument>) {}

  create(createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceDocument> {
    const createdWorkspace = new this.workspaceModel(createWorkspaceDto)
    return createdWorkspace.save()
  }

  findAll(workspaceDto: SearchWorkspaceDto): Promise<WorkspaceDocument[]> {
    return this.workspaceModel.find(workspaceDto).exec()
  }

  findOne(id: ObjectId): Promise<WorkspaceDocument> {
    return this.workspaceModel.findById(id).exec()
  }

  update(id: ObjectId, updateWorkspaceDto: UpdateWorkspaceDto): Promise<WorkspaceDocument> {
    return this.workspaceModel
      .findOneAndUpdate(
        {
          _id: id,
        },
        updateWorkspaceDto,
      )
      .exec()
  }

  async remove(id: ObjectId) {
    return this.workspaceModel
      .findOneAndRemove({
        _id: id,
      })
      .exec()
  }
}
