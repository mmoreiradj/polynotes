import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { ObjectId } from 'mongodb'

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, ObjectId | undefined> {
  transform(value: string): ObjectId | undefined {
    if (value === undefined) return undefined

    const validObjectId = ObjectId.isValid(value)

    if (!validObjectId) {
      throw new BadRequestException('Invalid ObjectId')
    }

    return ObjectId.createFromHexString(value)
  }
}
