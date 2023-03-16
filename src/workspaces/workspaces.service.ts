import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from 'src/shared/types'
import { CreateWorkspaceDto } from './dto/create-workspace.dto'
import { UpdateWorkspaceDto } from './dto/update-workspace.dto'

@Injectable()
export class WorkspacesService {
  constructor(private readonly prisma: PrismaService) {}

  create(user: Partial<User>, createWorkspaceDto: CreateWorkspaceDto) {
    return this.prisma.workspaces.create({
      data: {
        ...createWorkspaceDto,
        owner: user.id,
      },
    })
  }

  findAll(user: Partial<User>) {
    return this.prisma.workspaces.findMany({
      where: {
        owner: user.id,
      },
    })
  }

  findOne(id: string) {
    return this.prisma.workspaces.findUniqueOrThrow({
      where: {
        id,
      },
    })
  }

  update(id: string, updateWorkspaceDto: UpdateWorkspaceDto) {
    return this.prisma.workspaces.update({
      where: {
        id,
      },
      data: {
        ...updateWorkspaceDto,
      },
    })
  }

  async remove(id: string) {
    return this.prisma.workspaces.delete({
      where: {
        id,
      },
    })
  }
}
