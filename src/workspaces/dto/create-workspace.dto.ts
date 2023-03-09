import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreateWorkspaceDto {
  @IsNotEmpty()
  @MaxLength(25)
  name: string
}
