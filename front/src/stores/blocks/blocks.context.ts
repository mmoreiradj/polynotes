import { createContext, Dispatch } from 'react'
import { Block } from '../../components/blocks/block.type'
import { BlockAction } from './blocks.reducer'

export const BlocksContext = createContext<Block[]>([])
export const BlocksDispatchContext = createContext<Dispatch<BlockAction>>({} as Dispatch<BlockAction>)
