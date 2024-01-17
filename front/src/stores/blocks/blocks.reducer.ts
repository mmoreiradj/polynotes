import { Block } from '../../components/blocks/block.type'
import { client } from '../../services'

export enum BlockActionType {
  RESET = 'reset',
  ADD = 'add',
  ADD_BEFORE = 'addBefore',
  ADD_AFTER = 'addAfter',
  CHANGED = 'changed',
  DELETE = 'delete',
}

export interface BlockAction {
  type: BlockActionType
  payload: Block[]
  id?: string
  fileId: string
  parentId?: string
}

const save = (fileId: string, blocks: Block[]) => {
  return client.put<Block[]>(`files/${fileId}/blocks`, {
    blocks,
  })
}

export const blocksReducer = (blocks: Block[], action: BlockAction): Block[] => {
  const { type, payload, id, parentId } = action
  let newBlocks = []
  switch (type) {
    case BlockActionType.RESET:
      newBlocks = payload
      break
    case BlockActionType.ADD:
      newBlocks = [...blocks.filter((block) => !payload.some((newBlock) => block._id !== newBlock._id)), ...payload]
      break
    case BlockActionType.ADD_AFTER:
      if (payload.length === 0 || !id) return blocks
      if (id === 'root') return [...payload, ...blocks]
      const fileToAddAfter = payload[0]
      const index = blocks.findIndex((file) => file._id === id)
      if (index === -1) return blocks
      newBlocks = [...blocks.slice(0, index + 1), fileToAddAfter, ...blocks.slice(index + 1)]
      break
    case BlockActionType.ADD_BEFORE:
      if (payload.length === 0 || !id) return blocks
      const fileToAddBefore = payload[0]
      const indexToAddBefore = blocks.findIndex((file) => file._id === id)
      if (indexToAddBefore === -1) return blocks
      newBlocks = [...blocks.slice(0, indexToAddBefore), fileToAddBefore, ...blocks.slice(indexToAddBefore)]
      break
    case BlockActionType.DELETE:
      if (!id) return blocks
      newBlocks = blocks.filter((file) => file._id !== id)
      break
    case BlockActionType.CHANGED:
      if (payload.length === 0) return blocks
      if (parentId) {
        const parentBlock = blocks.find((block) => block._id === parentId)

        if (!parentBlock) {
          return blocks
        }

        newBlocks = blocks.map((block) => {
          if (block._id === parentId) {
            return {
              ...parentBlock,
              content: (parentBlock.content as Block[]).map((child) =>
                child._id === payload[0]._id ? payload[0] : child,
              ),
            }
          }
          return block
        })
        break
      }
      const blockToChange = payload[0]
      newBlocks = blocks.map((block) => (block._id === blockToChange._id ? blockToChange : block))
      break
    default:
      throw new Error('Not supported')
  }

  if (type !== BlockActionType.RESET) {
    save(action.fileId, newBlocks)
  }
  return newBlocks
}
