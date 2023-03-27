import { Module } from '@nestjs/common'
import { PrismaModule } from 'src/common/prisma/prisma.module'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { BlocksController } from './controllers/blocks.controller'
import { FilesController } from './controllers/files.controller'
import { BlocksService } from './services/blocks.service'
import { FilesService } from './services/files.service'
import { UsersService } from './services/users.service'

@Module({
  imports: [PrismaModule],
  controllers: [BlocksController, FilesController],
  providers: [FilesService, UsersService, BlocksService, PrismaService],
})
export class CoreModule {}
