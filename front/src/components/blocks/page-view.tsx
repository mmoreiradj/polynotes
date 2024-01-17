import { Navigate, useParams } from 'react-router-dom'
import { useContext, useEffect, useRef, useState } from 'react'
import { Spinner } from 'flowbite-react'
import { _File } from '../../shared/types'
import { fileService } from '../../services'
import { Editor } from './editor'
import { EditorHeader } from './editor-header'
import { isAnonymous, isLoaded } from '../../stores/user/user.reducer'
import { AppTopNav } from '../app'
import { UserContext } from '../../stores/user/user.context'
import { AccessLevel } from '../../shared/types/access-level.type'

export const PageView = ({ source }: { source: string }) => {
  const user = useContext(UserContext)
  const { fileId } = useParams<{ fileId: string }>()
  if (!fileId) return null
  const [file, setFile] = useState<_File | null>(null)

  const isLoading = useRef(true)
  const needsInit = useRef(true)
  useEffect(() => {
    const fetchFile = async () => {
      needsInit.current = false

      const res = await fileService.get(fileId)

      setFile(res.data)
      isLoading.current = false
    }

    if (needsInit.current && isLoaded(user)) {
      fetchFile()
    }
  }, [fileId, user])

  const handleOnTitleChange = (title: string) => {
    if (!file) return
    setFile({ ...file, name: title })
    fileService.update(file._id, { name: title })
  }

  const handleOnChangeAccessLevel = (level: AccessLevel) => {
    fileService.updateAccessLevel(file!._id, level)
    setFile({ ...file!, accessLevel: level })
  }

  return (
    <div className="flex flex-col w-full">
      {source === 'public' && isLoaded(user) && !isAnonymous(user) && file && (
        <Navigate to={`/home/${file._id}`} replace />
      )}
      {isLoading.current && <Spinner aria-label="Default status example" />}
      {source === 'public' && <AppTopNav />}
      {!isLoading.current && file && (
        <>
          <div className="w-full p-5 border-b-2 flex flex-row justify-end">
            <EditorHeader file={file} onChangeAccessLevel={handleOnChangeAccessLevel} />
          </div>
          <div className="w-full">
            <Editor file={file} onTitleChange={handleOnTitleChange} />
          </div>
        </>
      )}
    </div>
  )
}
