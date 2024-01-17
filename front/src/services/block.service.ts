import { AxiosPromise } from 'axios'
import { client } from '.'
import { Block } from '../components/blocks/block.type'

export const blockService = {
  getAll(fileId: string): AxiosPromise<Block[]> {
    return client.get<Block[]>(`files/${fileId}/blocks`)
  },
  create(fileId: string, block: Omit<Block, '_id'>, position?: number) {
    return client.post<Block>(`files/${fileId}/blocks`, { ...block, position })
  },
  update(fileId: string, blockId: string, block: Omit<Block, '_id'>) {
    return client.patch<Block>(`files/${fileId}/blocks/${blockId}`, block)
  },
  delete(fileId: string, blockId: string) {
    return client.delete<any>(`files/${fileId}/blocks/${blockId}`)
  },
}
