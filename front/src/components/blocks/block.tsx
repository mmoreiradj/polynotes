import { Block, BlockKind, Meta } from './block.type'
import { CodeBlockBlock } from './kinds/code-block'
import { HeadingBlock } from './kinds/heading-block'
import { ImageBlock } from './kinds/image-block'
import { ParagraphBlock } from './kinds/paragraph-block'
import { useContext, useEffect, useMemo, useState } from 'react'
import { BlocksContext, BlocksDispatchContext } from '../../stores/blocks/blocks.context'
import { BlockActionType } from '../../stores/blocks/blocks.reducer'
import { Cog6ToothIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import { ListGroup } from 'flowbite-react'
import { useIsComponentVisible } from '../../shared/hooks/is-component-visible.hook'
import { BlockProps } from './kinds/block-props'
import { v4 as uuid } from 'uuid'
import { DatabaseViewBlock } from './kinds/database-view-block'
import { BlockMethods, _File } from '../../shared/types'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { UserContext } from '../../stores/user/user.context'
import { FormBlock } from './kinds/form-block/form-block'

type Option = {
  label: string
  type: 'block' | 'action'
  value: BlockKind | 'add_below' | 'remove' | 'add_above'
  meta?: Meta
}

const blockOptions: Option[] = [
  {
    label: 'Paragraph',
    type: 'block',
    value: BlockKind.PARAGRAPH,
  },
  {
    label: 'Heading one',
    type: 'block',
    value: BlockKind.HEADING,
    meta: {
      level: 2,
    },
  },
  {
    label: 'Heading two',
    type: 'block',
    value: BlockKind.HEADING,
    meta: {
      level: 3,
    },
  },
  {
    label: 'Heading three',
    type: 'block',
    value: BlockKind.HEADING,
    meta: {
      level: 4,
    },
  },
  {
    label: 'Image',
    type: 'block',
    value: BlockKind.IMAGE,
  },
  {
    label: 'Code Block',
    type: 'block',
    value: BlockKind.CODE_BLOCK,
  },
  {
    label: 'Layout',
    type: 'block',
    value: BlockKind.LAYOUT,
  },
  {
    label: 'Database View',
    type: 'block',
    value: BlockKind.DATABASE_VIEW,
  },
  {
    label: 'Form',
    type: 'block',
    value: BlockKind.FORM,
  },
  {
    label: 'Add Below',
    type: 'action',
    value: 'add_below',
  },
  {
    label: 'Add Above',
    type: 'action',
    value: 'add_above',
  },
  {
    label: 'Remove',
    type: 'action',
    value: 'remove',
  },
]

type Props = {
  block: Block
  parent?: Block
  fileId: string
  file: _File
  onSetRef: (id: string, ref: BlockMethods) => void
  onSelectNextBlock: (currentBlock: Block, parent?: Block) => void
  onSelectPreviousBlock: (currentBlock: Block, parent?: Block) => void
}

export const BlockElement = ({
  fileId,
  file,
  block,
  parent,
  onSetRef,
  onSelectNextBlock,
  onSelectPreviousBlock,
}: Props) => {
  const user = useContext(UserContext)

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const { ref, isComponentVisible, setIsComponentVisible } = useIsComponentVisible()

  const blocks = useContext(BlocksContext)

  const [options, setOptions] = useState(blockOptions)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (search === '') {
      setOptions(blockOptions)
    } else {
      setOptions(options.filter((option) => option.label.toUpperCase().startsWith(search.toUpperCase())))
    }
  }, [search])

  const [currentOption, setCurrentOption] = useState<number>(0)

  const dispatch = useContext(BlocksDispatchContext)

  const handleOnAddBlock = async (position: 'add_below' | 'add_above' = 'add_below') => {
    let blockPosition = blocks.findIndex((b) => b._id === block._id)
    if (position === 'add_below') {
      blockPosition = blockPosition + 1
    }

    const newBlock = {
      _id: uuid(),
      kind: BlockKind.PARAGRAPH,
      content: '',
    }

    if (position === 'add_below') {
      dispatch({
        type: BlockActionType.ADD_AFTER,
        payload: [newBlock],
        id: parent?._id ?? block._id,
        fileId,
      })
    } else {
      dispatch({
        type: BlockActionType.ADD_BEFORE,
        payload: [newBlock],
        id: parent?._id ?? block._id,
        fileId,
      })
    }
  }

  const handleOnRemoveBlock = async () => {
    if (parent) {
      const replaceWith = (parent.content as Block[]).filter((b) => b._id !== block._id)
      dispatch({
        type: BlockActionType.CHANGED,
        payload: replaceWith,
        id: parent._id,
        fileId,
      })
      return
    }
    dispatch({
      type: BlockActionType.DELETE,
      payload: [],
      id: block._id,
      fileId,
    })
    onSelectPreviousBlock(block, parent)
  }

  const handleOnChange = async (c: string) => {
    dispatch({
      fileId,
      type: BlockActionType.CHANGED,
      payload: [
        {
          _id: block._id,
          kind: block.kind,
          content: c,
        },
      ],
      parentId: parent?._id,
    })
  }

  const handleOnSelectOptionFromBlock = () => {
    if (options.length === 0) return
    handleOnSelectOption(options[currentOption])
  }

  const handleOnSelectOption = async ({ type, value, meta }: Option) => {
    setIsComponentVisible(false)
    if (block.kind === value) {
      return
    }

    if (type === 'action') {
      if (value === 'add_below' || value === 'add_above') {
        handleOnAddBlock(value)
      } else if (value === 'remove') {
        handleOnRemoveBlock()
      }
    } else {
      if ((value as BlockKind) === BlockKind.LAYOUT) {
        dispatch({
          type: BlockActionType.CHANGED,
          payload: [
            {
              _id: block._id,
              kind: value as BlockKind,
              content: [
                {
                  _id: uuid(),
                  kind: BlockKind.PARAGRAPH,
                  content: '',
                },
                {
                  _id: uuid(),
                  kind: BlockKind.PARAGRAPH,
                  content: '',
                },
              ],
            },
          ],
          id: block._id,
          fileId,
          parentId: parent?._id,
        })
        return
      }
      dispatch({
        type: BlockActionType.CHANGED,
        payload: [
          {
            _id: block._id,
            kind: value as BlockKind,
            content: '',
            meta,
          },
        ],
        id: block._id,
        fileId,
        parentId: parent?._id,
      })
    }
  }

  const handleOnMenuDown = async () => {
    const i = currentOption + 1
    if (i >= options.length) setCurrentOption(0)
    else setCurrentOption(i)
  }

  const handleOnMenuUp = async () => {
    const i = currentOption - 1
    if (i < 0) setCurrentOption(options.length - 1)
    else setCurrentOption(i)
  }

  const attr: BlockProps = {
    block,
    file,
    onAddBlock: handleOnAddBlock,
    onRemoveBlock: handleOnRemoveBlock,
    onChange: handleOnChange,
    onCloseMenu: () => setIsComponentVisible(false),
    onOpenMenu: () => setIsComponentVisible(true),
    onMenuUp: handleOnMenuUp,
    onMenuDown: handleOnMenuDown,
    isMenuOpen: isComponentVisible,
    onSelectOption: handleOnSelectOptionFromBlock,
    onSelectNextBlock: () => onSelectNextBlock(block, parent),
    onSelectPreviousBlock: () => onSelectPreviousBlock(block, parent),
  }

  const canEdit = file.userId === user.id || file.accessLevel === 'w'

  return (
    <div className={'mb-1 flex'} ref={setNodeRef} style={style}>
      <div className={'flex w-full items-start relative'}>
        {canEdit && (
          <>
            {!parent && (
              <button {...listeners} {...attributes} className="dragHandle" tabIndex={-1}>
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>
            )}
            <button tabIndex={-1} onClick={() => setIsComponentVisible(true)}>
              <Cog6ToothIcon className={'h-5 w-5'} />
            </button>
          </>
        )}
        {isComponentVisible && (
          <div className={'absolute z-10'} ref={ref} style={{ top: '100%' }}>
            <ListGroup color="purple">
              {options
                .filter((option) => option.label.toUpperCase().startsWith(search.toUpperCase()))
                .map((option, i) => (
                  <ListGroup.Item key={i} onClick={() => handleOnSelectOption(option)} active={i === currentOption}>
                    {option.label}
                  </ListGroup.Item>
                ))}
            </ListGroup>
          </div>
        )}
        {block.kind === BlockKind.PARAGRAPH && (
          <ParagraphBlock
            {...attr}
            onSearch={(value: string) => setSearch(value)}
            ref={(ref) => {
              if (ref) onSetRef(block._id, ref)
            }}
          />
        )}
        {block.kind === BlockKind.HEADING && <HeadingBlock {...attr} />}
        {block.kind === BlockKind.IMAGE && <ImageBlock {...attr} />}
        {block.kind === BlockKind.LAYOUT && (
          <div className={'flex justify-between items-strech w-full'}>
            <div className={'w-full'}>
              <BlockElement
                file={file}
                fileId={fileId}
                block={(block.content as Block[])[0]}
                parent={block}
                onSetRef={onSetRef}
                onSelectNextBlock={onSelectNextBlock}
                onSelectPreviousBlock={onSelectPreviousBlock}
              />
            </div>
            <div className={'w-5 h-full bg-gray-700 ml-3 mr-3'} />
            <div className={'w-full'}>
              <BlockElement
                file={file}
                fileId={fileId}
                block={(block.content as Block[])[1]}
                parent={block}
                onSetRef={onSetRef}
                onSelectNextBlock={onSelectNextBlock}
                onSelectPreviousBlock={onSelectPreviousBlock}
              />
            </div>
          </div>
        )}
        {block.kind === BlockKind.CODE_BLOCK && <CodeBlockBlock {...attr} />}
        {block.kind === BlockKind.DATABASE_VIEW && (
          <DatabaseViewBlock block={block} fileId={fileId} parentId={parent?._id} file={file} />
        )}
        {block.kind === BlockKind.FORM && <FormBlock {...attr} />}
      </div>
    </div>
  )
}
