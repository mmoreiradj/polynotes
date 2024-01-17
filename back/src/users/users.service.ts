import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateUserDto } from 'src/common/auth/dto/create-user.dto'
import { User, UserDocument } from 'src/schema/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel({
      ...createUserDto,
      // NOTE: This is for demonstration purposes only and to save on smtp costs and calls
      active: true,
    })
    return user.save()
  }

  findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).orFail().exec()
  }

  findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).orFail().exec()
  }

  activate(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(id, { active: true }).orFail().exec()
  }
}
