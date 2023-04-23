import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { AnswersService } from './answers.service'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { JwtUser } from 'src/common/shared/types'
import { FormFieldAnswer } from '../schema/form-field-answer.schema'

@Controller('forms/:form_id/answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Get()
  async getAnswers(@Param('form_id') formId: string, @GetUser() user: JwtUser) {
    return await this.answersService.findAll(formId, user.id)
  }

  @Put()
  async createAnswer(
    @Param('form_id') formId: string,
    @GetUser() user: JwtUser,
    @Body('answers') answers: FormFieldAnswer[],
  ) {
    return await this.answersService.create(formId, answers, user.id)
  }
}
