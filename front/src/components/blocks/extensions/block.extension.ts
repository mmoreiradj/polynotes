import { CharacterCount, CharacterCountOptions, CharacterCountStorage } from '@tiptap/extension-character-count'

type BlockExtentionoptions = {
  onAddBlock: Function
  onRemoveBlock: Function
  onOpenMenu: Function
  onCloseMenu: Function
  onMenuUp: Function
  onMenuDown: Function
  isMenuOpen: Function
  onSelectOption: Function
  onSelectNextBlock: Function
  onSelectPreviousBlock: Function
}

type ExtendedCharacterCountOptions = CharacterCountOptions & BlockExtentionoptions

export const BlockExtension = CharacterCount.extend<ExtendedCharacterCountOptions, CharacterCountStorage>({
  name: 'block',
  addOptions() {
    return {
      ...this.parent?.(),
      onAddBlock: () => true,
      onRemoveBlock: () => true,
      onOpenMenu: () => true,
      onCloseMenu: () => true,
      onMenuUp: () => true,
      onMenuDown: () => true,
      isMenuOpen: () => true,
      onSelectOption: () => true,
      onSelectNextBlock: () => true,
      onSelectPreviousBlock: () => true,
    }
  },
  addKeyboardShortcuts() {
    return {
      'Shift-Enter': () => {
        this.options.onAddBlock()
        return true
      },
      Backspace: () => {
        if (this.editor.isEmpty) {
          this.options.onRemoveBlock()
          return true
        }
        return false
      },
      '/': () => {
        if (this.editor.isEmpty) {
          this.options.onOpenMenu()
        }
        return false
      },
      ArrowUp: () => {
        if (this.options.isMenuOpen()) {
          this.options.onMenuUp()
          return true
        } else if (this.editor.state.selection.$anchor.pos === 1) {
          this.options.onSelectPreviousBlock()
          return true
        }
        return false
      },
      ArrowDown: () => {
        if (this.options.isMenuOpen()) {
          this.options.onMenuDown()
        } else if (this.editor.state.selection.$anchor.pos >= this.editor.state.doc.nodeSize - 3) {
          this.options.onSelectNextBlock()
        }

        return false
      },
      Escape: () => {
        this.options.onCloseMenu()
        return true
      },
      Enter: () => {
        if (this.options.isMenuOpen()) {
          this.editor.commands.clearContent()
          this.options.onSelectOption()
          return true
        }
        return false
      },
    }
  },
})
