import { createContext, Dispatch } from 'react'
import { FileAction } from './files.reducer'
import { _File } from '../../shared/types'

export const FilesContext = createContext<_File[]>([])
export const FilesDispatchContext = createContext<Dispatch<FileAction>>({} as Dispatch<FileAction>)
