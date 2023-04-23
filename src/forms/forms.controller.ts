import { Controller, Post, Body, Param, Delete, Get, Patch } from '@nestjs/common'
import { FormsService } from './forms.service'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { CreateFormDto } from './dto/create-form.dto'
import { JwtUser } from 'src/common/shared/types'
import { UpdateFormDto } from './dto/update-form.dto'
import { FieldsService } from './fields/fields.service'
import { MoveFieldDto } from './fields/dto/swap-fields.dto'

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService, private readonly fieldsService: FieldsService) {}

  @Post()
  create(@GetUser() user: JwtUser, @Body() createFormDto: CreateFormDto) {
    return this.formsService.create(user.id, createFormDto)
  }

  @Get()
  findAll(@GetUser() user: JwtUser) {
    return this.formsService.findAll(user.id)
  }

  @Get(':id')
  async findOne(@GetUser() user: JwtUser, @Param('id') id: string) {
    const form = await this.formsService.findOne(id)
    if (form.owner._id.toString() !== user.id) {
      return form
    }
    return form
  }

  @Patch(':id')
  update(@GetUser() user: JwtUser, @Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
    return this.formsService.update(id, updateFormDto, user.id)
  }

  @Delete(':id')
  remove(@GetUser() user: JwtUser, @Param('id') id: string) {
    return this.formsService.remove(id, user.id)
  }
}
