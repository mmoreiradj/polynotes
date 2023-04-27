import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common'
import { AnswersService } from './answers.service'
import { GetUser } from 'src/common/shared/decorators/get-user.decorator'
import { JwtUser } from 'src/common/shared/types'
import { FormFieldAnswer } from '../schema/form-field-answer.schema'
import { OptionalAuth } from 'src/common/shared/decorators/is-optional-auth.decorator'
import { OptionalJwtAuthGuard } from 'src/common/shared/guards/optional-jwt-auth.guard'
import { SearchAnswerDto } from './dto/search-answer.dto'

@Controller('')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Get('forms/:form_id/answers')
  getAnswers(@Param('form_id') formId: string, @GetUser() user: JwtUser, @Query() queryParams: SearchAnswerDto) {
    return this.answersService.findAll(formId, queryParams.offset, queryParams.limit, user.id)
  }

  @Get('forms/:form_id/fields/:field_id/answers')
  getAnswersForFIeld(
    @Param('form_id') formId: string,
    @Param('field_id') fieldId: string,
    @GetUser() user: JwtUser,
    @Query() queryParams: SearchAnswerDto,
  ) {
    return this.answersService.fieldAnswers(formId, fieldId, queryParams.offset, queryParams.limit, user.id)
  }

  @Get('forms/:form_id/fields/:field_id/stats')
  getStatsForField(
    @Param('form_id') formId: string,
    @Param('field_id') fieldId: string,
    @GetUser() user: JwtUser,
    @Query() queryParams: SearchAnswerDto,
  ) {
    return this.answersService.fieldStats(formId, fieldId, queryParams.offset, queryParams.limit, user.id)
  }

  @OptionalAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Post('forms/:form_id/answers')
  createAnswer(@Param('form_id') formId: string, @Body('answers') answers: FormFieldAnswer[]) {
    return this.answersService.create(formId, answers)
  }
}
