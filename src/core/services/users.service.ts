import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { CreateUserDto } from 'src/common/auth/dto/create-user.dto'
import { PrismaService } from 'src/common/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: createUserDto,
    })
  }

  findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  activate(id: number): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { active: true },
    })
  }
}
