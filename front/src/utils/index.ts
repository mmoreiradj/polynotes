import { Block, BlockKind } from '../components/blocks/block.type'

export const placeholder = (type: BlockKind): string => {
  switch (type) {
    case BlockKind.PARAGRAPH:
      return "Press '/' for commands or start typing..."
    default:
      return ''
  }
}

export const getNextBlockId = (blocks: Block[], block: Block, parent?: Block): string => {
  let idToFind = block._id
  if (parent) {
    const index = (parent.content as Block[]).findIndex((b) => b._id === block._id)
    if (index === -1) return ''

    if (index === 0) {
      return (parent.content as Block[])[1]._id
    }
    idToFind = parent._id
  }

  const index = blocks.findIndex((b) => b._id === idToFind)

  if (index === -1) return ''
  if (index < blocks.length - 1) {
    if (blocks[index + 1].kind === BlockKind.LAYOUT) {
      return (blocks[index + 1].content as Block[])[0]._id
    }
    return blocks[index + 1]._id
  }
  return ''
}

export const getPreviousBlockId = (blocks: Block[], block: Block, parent?: Block): string => {
  let idToFind = block._id
  if (parent) {
    const index = (parent.content as Block[]).findIndex((b) => b._id === block._id)
    if (index === -1) return ''

    if (index === 1) {
      return (parent.content as Block[])[0]._id
    }
    idToFind = parent._id
  }

  const index = blocks.findIndex((b) => b._id === idToFind)
  if (index === -1) return ''
  if (index > 0) {
    if (blocks[index - 1].kind === BlockKind.LAYOUT) {
      return (blocks[index - 1].content as Block[])[1]._id
    }
    return blocks[index - 1]._id
  }
  return ''
}
