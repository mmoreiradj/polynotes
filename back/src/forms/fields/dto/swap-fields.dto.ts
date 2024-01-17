import { IsNotEmpty } from 'class-validator'

export class MoveFieldDto {
  @IsNotEmpty()
  moveToId: string
}
