import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileSchema } from 'src/schema/file.schema'
import { BlocksController } from './block.controller'
import { BlocksService } from './block.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: 'File', schema: FileSchema }])],
  controllers: [BlocksController],
  providers: [BlocksService],
})
export class BlocksModule {}
