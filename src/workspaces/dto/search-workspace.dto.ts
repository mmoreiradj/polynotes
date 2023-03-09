import { IsOptional } from 'class-validator'

export class SearchWorkspaceDto {
  @IsOptional()
  name?: string
}
