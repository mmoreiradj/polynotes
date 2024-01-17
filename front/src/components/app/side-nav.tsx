import { Sidebar } from 'flowbite-react'
import { ClockIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import SidebarItemGroup from 'flowbite-react/lib/esm/components/Sidebar/SidebarItemGroup'
import { WorkspaceTree } from '../files/workspace-tree'
import { useContext } from 'react'
import { FilesDispatchContext } from '../../stores/files/files.context'
import { fileService } from '../../services'
import { FileActionType } from '../../stores/files/files.reducer'
import { useNavigate } from 'react-router-dom'

export function AppSideBar() {
  const dispatch = useContext(FilesDispatchContext)

  const navigate = useNavigate()

  const createFileAndAccess = async () => {
    const newFile = await fileService.create({
      name: 'New file',
      isDirectory: false,
    })

    dispatch({
      type: FileActionType.ADD,
      payload: [newFile.data],
    })

    navigate(`/home/${newFile.data._id}`, { replace: true })
  }

  return (
    <div className="w-fit h-full grid-cols-3 border-r">
      <Sidebar aria-label="Sidebar with multi-level dropdown example">
        <Sidebar.Items>
          <SidebarItemGroup className="mb-2">
            <Sidebar.Item href={'#'} icon={PlusIcon} onClick={() => createFileAndAccess()}>
              Create file
            </Sidebar.Item>
          </SidebarItemGroup>
          <WorkspaceTree />
          <SidebarItemGroup>
            <Sidebar.Item href={'#'} icon={ClockIcon}>
              Recent
            </Sidebar.Item>
            <Sidebar.Item href={'#'} icon={TrashIcon}>
              Trashed
            </Sidebar.Item>
          </SidebarItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  )
}
