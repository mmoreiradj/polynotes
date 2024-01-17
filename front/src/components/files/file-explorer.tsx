import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowNav, FilesTable } from '.'
import { fileService } from '../../services'
import { _File } from '../../shared/types/file.type'
import { FilesContext, FilesDispatchContext } from '../../stores/files/files.context'
import { FileActionType } from '../../stores/files/files.reducer'
import { FilesPath } from './files-path'

export const FileExplorer = () => {
  const files = useContext(FilesContext)

  const filesDispatch = useContext(FilesDispatchContext)

  const navigate = useNavigate()

  const [path, setPath] = useState<_File[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)

  const filterFiles = (): _File[] => {
    if (path.length === 0) {
      return files.filter((file) => !file.parentId)
    } else {
      return files.filter((file) => file.parentId === path[path.length - 1]._id)
    }
  }

  const needsFetching = (): boolean => {
    if (path.length === 0) {
      return files.filter((file) => !file.parentId).length === 0
    } else {
      return files.filter((file) => file.parentId === path[path.length - 1]._id).length === 0
    }
  }

  const loadContent = async () => {
    try {
      setIsLoading(true)
      const filter: Partial<_File> = {}

      if (path.length > 0) {
        filter.parentId = path[path.length - 1]._id
      }

      const response = await fileService.getAll(filter)

      filesDispatch({
        type: FileActionType.ADD,
        payload: response.data,
      })
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const reloadFiles = useRef(false)
  useEffect(() => {
    if (!reloadFiles.current || !needsFetching()) return
    reloadFiles.current = false
    loadContent()
  }, [path])

  const needsInit = useRef(true)
  useEffect(() => {
    if (!needsInit.current) return
    needsInit.current = false
    loadContent()
  }, [])

  const handleOnSelectFile = async (file: _File) => {
    if (!file.isDirectory) {
      navigate(`/home/${file._id}`, {
        replace: true,
      })
      return
    }
    reloadFiles.current = true
    setPath([...path, file])
  }

  const handleOnGoBackwards = async () => {
    reloadFiles.current = true
    const cp = [...path]
    cp.pop()
    setPath(cp)
  }

  const handleOnGoToRoot = () => {
    reloadFiles.current = true
    setPath([])
  }

  const handleOnSelectFilePath = async (file: _File) => {
    if (path.length === 0) return
    const indexOfFile = path.findIndex((_file) => _file._id === file._id)
    if (indexOfFile === path.length) return
    setPath(path.slice(0, indexOfFile - 1))
  }

  const handleOnRefresh = () => {
    loadContent()
  }

  const handleOnAddFile = async (name: string, isDirectory: boolean) => {
    const file: Partial<_File> = {
      name,
      isDirectory,
    }

    if (path.length > 0) {
      file.parentId = path[path.length - 1]._id
    }

    const response = await fileService.create(file)
    filesDispatch({
      type: FileActionType.ADD,
      payload: [response.data],
    })
  }

  const handleOnEditFile = async (file: _File) => {
    const response = await fileService.update(file._id, file)
    filesDispatch({
      type: FileActionType.CHANGED,
      payload: [response.data],
    })
  }

  const handleOnDeleteFile = async (file: _File) => {
    const response = await fileService.delete(file._id)
    if (response.data?.count === 0) throw Error('could not delete file')
    filesDispatch({
      type: FileActionType.DELETE,
      payload: [file],
    })
  }

  return (
    <>
      <h2>My Files</h2>
      <div className="flex">
        <div className={'mr-5'}>
          <ArrowNav onGoBackwards={handleOnGoBackwards} isRoot={path.length === 0} />
        </div>
        <FilesPath history={path} onSelectFilePath={handleOnSelectFilePath} onGoToRoot={handleOnGoToRoot} />
      </div>
      <FilesTable
        files={filterFiles()}
        isLoading={isLoading}
        onSelectFile={handleOnSelectFile}
        onRefresh={handleOnRefresh}
        onAddFile={handleOnAddFile}
        onDeleteFile={handleOnDeleteFile}
        onEditFile={handleOnEditFile}
      />
    </>
  )
}
