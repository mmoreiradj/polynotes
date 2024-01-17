import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FileSchema } from 'src/schema/file.schema'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'
import { BlocksController } from './blocks/block.controller'
import { BlocksService } from './blocks/block.service'
import { FormsModule } from 'src/forms/forms.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'File',
        schema: FileSchema,
      },
    ]),
    FormsModule,
  ],
  controllers: [FilesController, BlocksController],
  providers: [FilesService, BlocksService],
})
export class FilesModule {}
