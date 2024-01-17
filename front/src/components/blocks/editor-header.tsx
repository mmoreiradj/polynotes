import { Dropdown } from 'flowbite-react'
import { User, _File } from '../../shared/types'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../stores/user/user.context'
import { userService } from '../../services'
import { AccessLevel } from '../../shared/types/access-level.type'
import { ClipboardIcon } from '@heroicons/react/24/outline'

export const EditorHeader = ({
  file,
  onChangeAccessLevel,
}: {
  file: _File
  onChangeAccessLevel: (level: AccessLevel) => void
}) => {
  const currentAccessLevel = file.accessLevel === AccessLevel.PUBLIC_READ ? 'view' : 'edit'

  const user = useContext<User>(UserContext)

  const [author, setAuthor] = useState<User | undefined>()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userService.getOne(file.userId)
      setAuthor(response.data)
    }

    if (file.userId !== user.id) {
      setAuthor(undefined)
      fetchUser()
    }
  }, [file])

  return (
    <>
      {author && <p>This file was created by : {author.name}</p>}
      {file.userId === user.id && (
        <Dropdown label="Edit permissions" color="purple">
          <Dropdown.Header>
            {file.accessLevel === AccessLevel.PRIVATE && <span>Your file is private !</span>}
            {file.accessLevel !== AccessLevel.PRIVATE && <span>Anyone with the link can {currentAccessLevel}</span>}
          </Dropdown.Header>
          {file.accessLevel !== AccessLevel.PUBLIC_READ && (
            <Dropdown.Item onClick={() => onChangeAccessLevel(AccessLevel.PUBLIC_READ)}>Set to view</Dropdown.Item>
          )}
          {file.accessLevel !== AccessLevel.PUBLIC_WRITE && (
            <Dropdown.Item onClick={() => onChangeAccessLevel(AccessLevel.PUBLIC_WRITE)}>Set to edit</Dropdown.Item>
          )}
          {file.accessLevel !== AccessLevel.PRIVATE && (
            <Dropdown.Item onClick={() => onChangeAccessLevel(AccessLevel.PRIVATE)}>Set to private</Dropdown.Item>
          )}
          <Dropdown.Divider />
          <Dropdown.Item>
            <button
              className="flex items-center"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/pages/${file._id}`)
              }}
            >
              <ClipboardIcon className="w-4 h-4 mr-2" />
              <span>Copy link</span>
            </button>
          </Dropdown.Item>
        </Dropdown>
      )}
    </>
  )
}
