import { useEffect, useReducer, useRef, useState } from 'react'
import { BlockElement } from './block'
import { v4 as uuid } from 'uuid'
import { BlocksContext, BlocksDispatchContext } from '../../stores/blocks/blocks.context'
import { BlockActionType, blocksReducer } from '../../stores/blocks/blocks.reducer'
import { Block, BlockKind } from './block.type'
import { HeadingBlock } from './kinds/heading-block'
import { BlockMethods, _File } from '../../shared/types'
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { getNextBlockId, getPreviousBlockId } from '../../utils'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

type EditorRefs = {
  [key: string]: BlockMethods | null
}

type Props = {
  file: _File
  onTitleChange: (title: string) => void
}

export const Editor = ({ file, onTitleChange }: Props) => {
  const [blocks, setBlocks] = useReducer(blocksReducer, [])
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleOnDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over?.id || active.id === over?.id) return

    const b = [...blocks]

    const activeIndex = b.findIndex((block) => block._id === active.id)
    const overIndex = b.findIndex((block) => block._id === over.id)

    const activeBlock = b[activeIndex]

    b.splice(activeIndex, 1)
    b.splice(overIndex, 0, activeBlock)

    setBlocks({
      type: BlockActionType.ADD,
      payload: b,
      fileId: file._id,
    })
  }

  const [titleBlock, setTitleBlock] = useState<Block>({
    _id: file._id,
    kind: BlockKind.HEADING,
    content: file.name,
  })

  const refsById = useRef<EditorRefs>({})

  useEffect(() => {
    if (!file.blocks || file.blocks.length === 0) {
      file.blocks = []
      const newBlock = {
        _id: uuid(),
        kind: BlockKind.PARAGRAPH,
        content: '',
      }
      file.blocks.push(newBlock)
    }
    setTitleBlock({
      _id: file._id,
      kind: BlockKind.HEADING,
      content: file.name,
    })
    refsById.current = {}
    setBlocks({
      type: BlockActionType.RESET,
      payload: file.blocks,
      fileId: file._id,
    })
  }, [file._id])

  const handleOnAddBlock = () => {
    setBlocks({
      type: BlockActionType.ADD_AFTER,
      payload: [
        {
          _id: uuid(),
          kind: BlockKind.PARAGRAPH,
          content: '',
        },
      ],
      id: 'root',
      fileId: file._id,
    })
  }

  const handleOnChange = async (c: any) => {
    onTitleChange(c)
  }

  const handleOnSelectNextBlock = (block: Block, parent?: Block) => {
    const nextBlockId = getNextBlockId(blocks, block, parent)
    if (!nextBlockId) return
    const ref = refsById.current[nextBlockId]
    if (!ref) return
    ref.focusEditor()
  }

  const handleOnSelectPreviousBlock = (block: Block, parent?: Block) => {
    const previousBlockId = getPreviousBlockId(blocks, block, parent)
    if (!previousBlockId) return
    const ref = refsById.current[previousBlockId]
    if (!ref) return
    ref.focusEditor()
  }

  return (
    <>
      <BlocksContext.Provider value={blocks}>
        <BlocksDispatchContext.Provider value={setBlocks}>
          <div className={'blockEditor'}>
            <HeadingBlock block={titleBlock} onAddBlock={handleOnAddBlock} onChange={handleOnChange} file={file} />
          </div>
          <div className={'blockEditor'}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleOnDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={blocks.map((block) => {
                  return {
                    ...block,
                    id: block._id,
                  }
                })}
                strategy={verticalListSortingStrategy}
              >
                {blocks.map((block: Block) => (
                  <BlockElement
                    file={file}
                    fileId={file._id}
                    block={block}
                    key={block._id}
                    onSetRef={(id, ref) => (refsById.current[id] = ref)}
                    onSelectNextBlock={handleOnSelectNextBlock}
                    onSelectPreviousBlock={handleOnSelectPreviousBlock}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </BlocksDispatchContext.Provider>
      </BlocksContext.Provider>
    </>
  )
}
