import { useContext, useEffect, useState } from 'react'
import { _File } from '../../shared/types'
import { FilesContext, FilesDispatchContext } from '../../stores/files/files.context'
import { BriefcaseIcon, DocumentIcon, ExclamationCircleIcon, FolderIcon } from '@heroicons/react/24/outline'
import { fileService } from '../../services'
import { FileActionType } from '../../stores/files/files.reducer'
import { WorkspaceItem } from './workspace-item'

export const WorkspaceTree = () => {
  const [openWorkspace, setOpenWorkspace] = useState<boolean>(false)
  const [openShared, setOpenShared] = useState<boolean>(false)

  const files = useContext<_File[]>(FilesContext)
  const dispatch = useContext(FilesDispatchContext)

  const [sharedFiles, setSharedFiles] = useState<_File[]>([])

  useEffect(() => {
    const init = async () => {
      const response = await fileService.getAll({
        parentId: undefined,
      })
      dispatch({
        type: FileActionType.ADD,
        payload: response.data,
      })
    }

    if (openWorkspace) {
      init()
    }
  }, [openWorkspace])

  return (
    <ul className="space-y-2 font-medium">
      <li>
        <button
          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setOpenWorkspace(!openWorkspace)}
        >
          <BriefcaseIcon className="w-6 h-6" />
          <span className="ml-3">My Workspace</span>
        </button>
        <ul>
          {openWorkspace &&
            files
              .filter((f) => !f.parentId)
              .map((f) => (
                <li key={f._id}>
                  <WorkspaceItem file={f} depth={1} />
                </li>
              ))}
          {openWorkspace && files.length === 0 && (
            <li
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              style={{ marginLeft: '10px' }}
            >
              <ExclamationCircleIcon className="w-6 h-6" />
              <span className="ml-3">Empty !</span>
            </li>
          )}
        </ul>
      </li>
      <li>
        <button
          className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setOpenShared(!openShared)}
        >
          <BriefcaseIcon className="w-6 h-6" />
          <span className="ml-3">Shared with me</span>
        </button>
        <ul />
      </li>
    </ul>
  )
}
