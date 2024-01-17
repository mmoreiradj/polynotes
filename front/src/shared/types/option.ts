import { BlockType } from '../enum'

export type Option = {
  label: string
  type: BlockType
  attr?: { level: number }
}
