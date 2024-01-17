import { useEffect, useRef, useState } from 'react'
import { fileService } from '../../services'
import { _File } from '../../shared/types'
import { Card, Spinner } from 'flowbite-react'
import { Link } from 'react-router-dom'

export const Carousel = () => {
  const [files, setFiles] = useState<_File[]>([])

  const isLoading = useRef(false)
  const needsInit = useRef(true)
  useEffect(() => {
    const loadContent = async () => {
      const recentFiles = await fileService.getRecent()
      setFiles(recentFiles.data)
      isLoading.current = false
    }
    if (!needsInit.current) return
    needsInit.current = false
    loadContent()
  }, [])

  return (
    <>
      {files && files.length > 0 && (
        <div className="w-full overflow-x-scroll">
          <h2>Recent Files</h2>
          <div className="flex flex-row">
            {isLoading.current && <Spinner aria-label="Default status example" />}
            {!isLoading.current &&
              files.length > 0 &&
              files.map((file) => {
                const lastAccessed = new Date(file!.lastAccessed as string)
                return (
                  <div key={file._id} className="carousel-card max-w-sm mr-2">
                    <Link to={`/home/${file._id}`}>
                      <Card>
                        <h5 className="text-s font-bold tracking-tight text-gray-900 dark:text-white text whitespace-nowrap">
                          {file.name}
                        </h5>
                        <p className="text-xs text-gray-700 dark:text-gray-400">
                          Last opened {lastAccessed.toDateString()} at {lastAccessed.toLocaleTimeString()}
                        </p>
                      </Card>
                    </Link>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </>
  )
}
