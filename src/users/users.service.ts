import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { PrismaService } from 'src/prisma/prisma.service'
import { User } from 'src/shared/types'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOne(user: Partial<User>): Promise<User> {
    try {
      return await this.prisma.users.findFirstOrThrow({
        where: {
          ...user,
        },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException()
      }
      throw error
    }
  }
}
