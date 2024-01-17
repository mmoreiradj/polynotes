import { _File } from '../../shared/types'

export enum FileActionType {
  ADD = 'add',
  CHANGED = 'changed',
  DELETE = 'delete',
}

export interface FileAction {
  type: FileActionType
  payload: _File[]
}

export const filesReducer = (files: _File[], action: FileAction): _File[] => {
  const { type, payload } = action
  switch (type) {
    case FileActionType.ADD:
      const additions: _File[] = []
      payload.forEach((file) => {
        if (!files.some((_file) => _file._id === file._id)) {
          additions.push(file)
        }
      })
      return [...files, ...additions]
    case FileActionType.DELETE:
      const fileToDelete = files[0]
      if (!fileToDelete) return files
      return files.filter((file) => file._id !== fileToDelete._id)
    case FileActionType.CHANGED:
      if (payload.length === 0) return files
      const changedFile = payload[0]
      return files.map((file) => {
        if (file._id === changedFile._id) {
          return changedFile
        }
        return file
      })
    default:
      throw new Error('Not supported')
  }
}
