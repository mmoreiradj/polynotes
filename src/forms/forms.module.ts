import { Module } from '@nestjs/common'
import { FormsService } from './forms.service'
import { FormsController } from './forms.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Form, FormSchema } from './schema/form.schema'
import { FieldsService } from './fields/fields.service'
import { FieldsController } from './fields/fields.controller'
import { AnswersService } from './answers/answers.service'
import { AnswersController } from './answers/answers.controller'
import { FormAnswer, FormAnswerSchema } from './schema/form-answer.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Form.name,
        schema: FormSchema,
      },
      {
        name: FormAnswer.name,
        schema: FormAnswerSchema,
      },
    ]),
  ],
  controllers: [FormsController, FieldsController, AnswersController],
  providers: [FormsService, FieldsService, AnswersService],
  exports: [FormsService],
})
export class FormsModule {}
