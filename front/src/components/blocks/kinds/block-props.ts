import { _File } from '../../../shared/types'
import { Block } from '../block.type'

export interface BlockProps {
  block: Block
  isMenuOpen?: boolean
  onChange(c: any): void
  onAddBlock(): void
  onRemoveBlock?(): void
  onOpenMenu?(): void
  onCloseMenu?(): void
  onMenuUp?(): void
  onMenuDown?(): void
  onSelectOption?(): void
  onSelectNextBlock?(): void
  onSelectPreviousBlock?(): void
  file: _File
}
