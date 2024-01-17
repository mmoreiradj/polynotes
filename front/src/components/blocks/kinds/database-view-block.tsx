import { Dropdown } from 'flowbite-react'
import { useContext, useEffect, useRef, useState } from 'react'
import { DatabaseForm } from '../databases/database-form'
import { databaseService } from '../../../services'
import { Database } from '../databases/cells/database.type'
import { Block } from '../block.type'
import { BlocksDispatchContext } from '../../../stores/blocks/blocks.context'
import { BlockActionType } from '../../../stores/blocks/blocks.reducer'
import { TableView } from '../databases/table'
import { UserContext } from '../../../stores/user/user.context'
import { _File } from '../../../shared/types'

export const DatabaseViewBlock = ({
  block,
  fileId,
  parentId,
  file,
}: {
  block: Block
  fileId: string
  parentId?: string
  file: _File
}) => {
  const dispatch = useContext(BlocksDispatchContext)

  const user = useContext(UserContext)

  const [databases, setDatabases] = useState<Omit<Database, 'columns rows'>[]>([])
  const [selectedDatabase, setSelectedDatabase] = useState<Database>()

  const [isFormShown, setIsFormShown] = useState(false)
  const [isAddColFormOpen, setIsAddColFormOpen] = useState<boolean>(false)

  const needsInit = useRef(true)
  useEffect(() => {
    const initDatabaseList = async () => {
      needsInit.current = false
      const response = await databaseService.getAll()
      setDatabases(response.data)
    }
    const initSelectedDatabase = async () => {
      if (!block.meta?.database) return
      const response = await databaseService.getOne(block.meta.database)
      setSelectedDatabase(response.data)
    }
    if (needsInit.current) {
      needsInit.current = false
      initDatabaseList()
      initSelectedDatabase()
    }
  }, [])

  const handleOnCreate = async (name: string) => {
    const response = await databaseService.create({
      name,
      columns: [],
      rows: [],
    })
    setDatabases([...databases, response.data])
  }

  const handleOnSelectDatabase = async (id: string) => {
    const response = await databaseService.getOne(id)
    setSelectedDatabase(response.data)
    dispatch({
      type: BlockActionType.CHANGED,
      payload: [
        {
          ...block,
          meta: {
            ...block.meta,
            database: id,
          },
        },
      ],
      fileId,
      parentId,
    })
  }

  const handleOnDelete = async (id: string) => {
    await databaseService.deleteOne(id)
    setDatabases(databases.filter((database) => database._id !== id))
  }

  const handleOnChange = (database: Database) => {
    setSelectedDatabase(database)
    databaseService.updateOne(database._id, database)
  }

  const handleOnChangeViewMode = (viewMode: string) => {
    dispatch({
      type: BlockActionType.CHANGED,
      payload: [
        {
          ...block,
          meta: {
            ...block.meta,
            viewMode,
          },
        },
      ],
      id: block._id,
      fileId,
      parentId,
    })
  }

  return (
    <div className="w-full">
      <div className="w-full flex justify-between">
        {user.id === file.userId && (
          <>
            <Dropdown label={selectedDatabase ? selectedDatabase.name : 'Select database'} color="purple">
              {databases.map((database) => (
                <Dropdown.Item key={database._id} onClick={() => handleOnSelectDatabase(database._id)}>
                  {database.name}
                </Dropdown.Item>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item onClick={() => setIsFormShown(true)}>Add Database</Dropdown.Item>
              <Dropdown.Divider />
              {selectedDatabase && (
                <Dropdown.Item onClick={() => handleOnDelete(selectedDatabase._id)}>Delete Selected</Dropdown.Item>
              )}
              <DatabaseForm isShown={isFormShown} onClose={() => setIsFormShown(false)} onCreate={handleOnCreate} />
            </Dropdown>
            <Dropdown label={block.meta?.viewMode?.toLocaleUpperCase()} color="purple">
              <Dropdown.Item onClick={() => handleOnChangeViewMode('table')}>Table</Dropdown.Item>
            </Dropdown>
          </>
        )}
      </div>
      {selectedDatabase && block.meta?.viewMode === 'table' && (
        <TableView database={selectedDatabase} onChange={handleOnChange} />
      )}
    </div>
  )
}
