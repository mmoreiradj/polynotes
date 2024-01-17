import { Module } from '@nestjs/common'
import { FieldsService } from './fields.service'
import { FieldsController } from './fields.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Form, FormSchema } from '../schema/form.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Form.name,
        schema: FormSchema,
      },
    ]),
  ],
  controllers: [FieldsController],
  providers: [FieldsService],
})
export class FieldsModule {}
