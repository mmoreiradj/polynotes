import { Controller, Get, Param } from '@nestjs/common'
import { UsersService } from './users.service'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { UserDocument } from 'src/schema/user.schema'
import { Public } from 'src/common/shared/decorators/is-public.decorator'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@GetUser() user: UserDocument) {
    const result = await this.usersService.findById(user.id)
    result.password = undefined
    return result
  }

  @Public()
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.usersService.findById(id)
  }
}
