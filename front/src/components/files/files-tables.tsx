import {
  ArrowPathIcon,
  CheckIcon,
  DocumentIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Checkbox, Dropdown, Label, Table, TextInput } from 'flowbite-react'
import { useState } from 'react'
import { _File } from '../../shared/types'

type Props = {
  files: _File[]
  isLoading: boolean
  onSelectFile: (file: _File) => void
  onRefresh: () => void
  onAddFile: (name: string, isDirectory: boolean) => void
  onDeleteFile: (file: _File) => void
  onEditFile: (file: _File) => void
}

export const FilesTable = ({
  files,
  isLoading,
  onSelectFile,
  onRefresh,
  onAddFile,
  onDeleteFile,
  onEditFile,
}: Props) => {
  const [isCreateFormShown, setCreateFormShown] = useState<boolean>(false)

  const [isFolder, setFolder] = useState<boolean>(false)

  const [newFileName, setFileName] = useState<string>('')

  const [fileToEdit, setFileToEdit] = useState<_File | undefined>()

  const handleOnAddNewFileClicked = () => {
    setCreateFormShown(!isCreateFormShown)
    setFileToEdit(undefined)
    setFolder(false)
  }

  const handleNewFileSubmit = () => {
    if (newFileName === '') return
    setCreateFormShown(false)
    onAddFile(newFileName, isFolder)
    setFileName('')
  }

  const handleOnEditFile = (file: _File) => {
    setCreateFormShown(false)
    setFileToEdit(file)
  }

  const handleOnEditFileSubmit = (file: _File) => {
    if (newFileName === '') return
    setFileToEdit(undefined)
    file.name = newFileName
    onEditFile(file)
    setFileName('')
  }

  const handleOnSelectFile = (file: _File) => {
    if (fileToEdit) return
    onSelectFile(file)
  }

  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell>
          <ArrowPathIcon className={'h-6 w-6'} onClick={onRefresh} />
        </Table.HeadCell>
        <Table.HeadCell>Name</Table.HeadCell>
        <Table.HeadCell>Last Modified</Table.HeadCell>
        <Table.HeadCell />
      </Table.Head>
      <Table.Body className="divide-y">
        {files.map((file) => {
          return (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={file._id}>
              <Table.Cell
                onClick={() => handleOnSelectFile(file)}
                className="whitespace-nowrap font-medium text-gray-900 dark:text-white"
              >
                {file.isDirectory ? <FolderIcon className={'h-6 w-6'} /> : <DocumentIcon className={'h-6 w-6'} />}
              </Table.Cell>
              <Table.Cell onClick={() => handleOnSelectFile(file)}>
                {fileToEdit?._id !== file._id ? (
                  file.name
                ) : (
                  <TextInput
                    type="text"
                    id="disabledInput1"
                    placeholder={file.name}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                )}
              </Table.Cell>
              <Table.Cell onClick={() => handleOnSelectFile(file)}>
                {new Date(file.updatedAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell className={'overflow-visible'}>
                {fileToEdit?._id !== file._id ? (
                  <Dropdown arrowIcon={false} inline label={<EllipsisVerticalIcon className={'w-6 h-6'} />}>
                    <Dropdown.Item onClick={() => handleOnEditFile(file)}>Edit</Dropdown.Item>
                    <Dropdown.Item onClick={() => onDeleteFile(file)}>Delete</Dropdown.Item>
                  </Dropdown>
                ) : (
                  <div>
                    <XMarkIcon
                      className={'h-6 w-6 mr-2'}
                      onClick={() => {
                        setFileToEdit(undefined)
                        setFileName('')
                      }}
                    />
                    <CheckIcon className={'h-6 w-6 mr-2'} onClick={() => handleOnEditFileSubmit(file)} />
                  </div>
                )}
              </Table.Cell>
            </Table.Row>
          )
        })}
        {files.length === 0 && (
          <Table.Row>
            <Table.Cell colSpan={4}>
              <p className={'text-center'}>{isLoading ? 'Loading...' : 'Directory is empty !'}</p>
            </Table.Cell>
          </Table.Row>
        )}
        {isCreateFormShown && (
          <Table.Row>
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
              <Label htmlFor="agree" className={'mr-1'}>
                Folder
              </Label>
              <Checkbox id="agree" onChange={() => setFolder(!isFolder)} />
            </Table.Cell>
            <Table.Cell>
              <TextInput
                type="text"
                id="disabledInput1"
                placeholder="file name"
                onChange={(e) => setFileName(e.target.value)}
              />
            </Table.Cell>
            <Table.Cell />
            <Table.Cell>
              <button onClick={handleNewFileSubmit}>Save</button>
            </Table.Cell>
          </Table.Row>
        )}
        <Table.Row>
          <Table.Cell colSpan={4} onClick={handleOnAddNewFileClicked}>
            <p className={'text-center'}>{isCreateFormShown ? 'Cancel' : 'Add new file'}</p>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )
}
