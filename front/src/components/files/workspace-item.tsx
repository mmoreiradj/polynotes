import { useContext, useEffect, useState } from 'react'
import { _File } from '../../shared/types'
import { FilesContext, FilesDispatchContext } from '../../stores/files/files.context'
import { fileService } from '../../services'
import { FileActionType } from '../../stores/files/files.reducer'
import './style/workspace-item.scss'
import { ArrowDownIcon, ChevronDownIcon, ChevronUpIcon, DocumentIcon, FolderIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'

type Props = {
  file: _File
  depth: number
}

export const WorkspaceItem = ({ file, depth }: Props) => {
  const dispatch = useContext(FilesDispatchContext)
  const files = useContext(FilesContext)

  const navigate = useNavigate()

  const [isShown, setShown] = useState<boolean>(false)

  useEffect(() => {
    const loadChildren = async () => {
      const response = await fileService.getAll({
        parentId: file._id,
      })
      dispatch({
        type: FileActionType.ADD,
        payload: response.data,
      })
    }

    if (isShown) {
      loadChildren()
    }
  }, [isShown])

  const handleOnClick = async () => {
    setShown(!isShown)
    if (isShown) {
      const response = await fileService.getAll({
        parentId: file._id,
      })
      dispatch({
        type: FileActionType.ADD,
        payload: response.data,
      })
    }
  }

  return (
    <>
      {file.isDirectory && (
        <>
          <button
            onClick={handleOnClick}
            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            style={{ marginLeft: `${depth * 10}px` }}
          >
            <FolderIcon className="w-6 h-6" />
            <span className="ml-3">{file.name}</span>
          </button>
          {isShown && (
            <ul>
              {files
                .filter((f) => f.parentId === file._id)
                .map((f) => (
                  <li key={f._id}>
                    <WorkspaceItem file={f} depth={depth + 1} />
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
      {!file.isDirectory && (
        <Link
          to={`/home/${file._id}`}
          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          style={{ marginLeft: `${depth * 10}px` }}
        >
          <DocumentIcon className="w-6 h-6" />
          <span className="ml-3">{file.name}</span>
        </Link>
      )}
    </>
  )
}
