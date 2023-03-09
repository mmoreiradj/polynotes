import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { FileSchema } from './schema/file.schema'
import { File } from './schema/file.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: File.name, schema: FileSchema }])],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
