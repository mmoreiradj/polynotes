import { Breadcrumb } from 'flowbite-react'
import { _File } from '../../shared/types/file.type'

type Props = {
  history: _File[]
  onSelectFilePath: (file: _File) => void
  onGoToRoot: () => void
  workspaceName?: string
}

export const FilesPath = ({ history, onSelectFilePath, onGoToRoot, workspaceName }: Props) => {
  return (
    <Breadcrumb aria-label="Default breadcrumb example">
      <Breadcrumb.Item onClick={() => onGoToRoot()}>
        <button>/</button>
      </Breadcrumb.Item>
      {history.map((file) => {
        return (
          <Breadcrumb.Item key={file._id} onClick={() => onSelectFilePath(file)}>
            <button>{file.name}</button>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}
