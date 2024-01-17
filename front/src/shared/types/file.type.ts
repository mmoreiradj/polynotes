import { Block } from '../../components/blocks/block.type'
import { AccessLevel } from './access-level.type'

export type _File = {
  _id: string
  name: string
  isDirectory: boolean
  parentId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  lastAccessed?: string
  accessLevel: AccessLevel
  blocks: Block[]
  children?: _File[]
}
