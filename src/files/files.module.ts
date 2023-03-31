import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileSchema } from 'src/schema/file.schema'
import { BlocksModule } from './blocks/block.module'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'File',
        schema: FileSchema,
      },
    ]),
    BlocksModule,
  ],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
