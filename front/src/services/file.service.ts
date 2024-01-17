import { client } from '.'
import { _File } from '../shared/types'

export const fileService = {
  getAll(file: Partial<_File>) {
    return client.get<_File[]>('files', {
      params: {
        parent_id: file.parentId,
      },
    })
  },
  getRecent() {
    return client.get<_File[]>('files/recent')
  },
  getChildrenOf(id: string) {
    return client.get<_File[]>('files', {
      params: {
        parent_id: id,
      },
    })
  },
  get(id: string) {
    return client.get<_File>(`files/${id}`)
  },
  create(file: Pick<_File, 'name' & 'isDirectory' & 'parentId'>) {
    return client.post<_File>('files', file)
  },
  update(id: string, file: Partial<_File>) {
    if (!file.parentId) delete file.parentId
    return client.patch<_File>(`files/${id}`, file)
  },
  updateAccessLevel(id: string, accessLevel: _File['accessLevel']) {
    return client.patch<_File>(`files/${id}/access-level`, { accessLevel })
  },
  delete(id: string) {
    return client.delete<any>(`files/${id}`)
  },
}
