import { Module } from '@nestjs/common'
import { DatabasesService } from './databases.service'
import { DatabasesController } from './databases.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { DatabaseSchema } from 'src/schema/database.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Database',
        schema: DatabaseSchema,
      },
    ]),
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService],
})
export class DatabasesModule {}
