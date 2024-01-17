import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { FieldsService } from './fields.service'
import { CreateFieldDto } from './dto/create-field.dto'
import { UpdateFieldDto } from './dto/update-field.dto'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { JwtUser } from 'src/common/shared/types'
import { MoveFieldDto } from './dto/swap-fields.dto'

@Controller('forms/:form_id/fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  create(@GetUser() user: JwtUser, @Param('form_id') formId: string, @Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(formId, createFieldDto, user.id)
  }

  @Patch(':field_id')
  update(
    @Param('field_id') fieldId: string,
    @Param('form_id') formId: string,
    @GetUser() user: JwtUser,
    @Body() updateFieldDto: UpdateFieldDto,
  ) {
    return this.fieldsService.update(formId, fieldId, updateFieldDto, user.id)
  }

  @Delete(':field_id')
  remove(@Param('field_id') fieldId: string, @Param('form_id') formId: string, @GetUser() user: JwtUser) {
    return this.fieldsService.remove(formId, fieldId, user.id)
  }

  @Patch(':field_id/move')
  moveOne(
    @Param('form_id') formId: string,
    @Param('field_id') fieldId: string,
    @Body() dto: MoveFieldDto,
    @GetUser() user: JwtUser,
  ) {
    return this.fieldsService.move(formId, fieldId, dto.moveToId, user.id)
  }
}
