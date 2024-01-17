import React, {
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import { Placeholder } from '@tiptap/extension-placeholder'
import { placeholder } from '../../../utils'
import { BlockMethods } from '../../../shared/types'
import { Heading } from '@tiptap/extension-heading'
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { BlockProps } from './block-props'
import { BlockExtension } from '../extensions/block.extension'
import { UserContext } from '../../../stores/user/user.context'

function useEventCallback(fn: Function) {
  const ref = useRef<Function>()
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback<Function>(() => (ref.current as Function)(), [])
}

export const HeadingBlock = forwardRef(
  ({ block, file, ...props }: BlockProps, ref: React.ForwardedRef<BlockMethods>) => {
    const user = useContext(UserContext)

    const onChange = useCallback(
      (c: any) => {
        props.onChange(c)
      },
      [block._id],
    )

    const onOpenMenu = useEventCallback(() => {
      if (props.onOpenMenu) props.onOpenMenu()
    })

    const onCloseMenu = useEventCallback(() => {
      if (props.onCloseMenu) props.onCloseMenu()
    })

    const onAddBlock = useEventCallback(() => {
      if (props.onAddBlock) props.onAddBlock()
    })

    const onRemoveBlock = useEventCallback(() => {
      if (props.onRemoveBlock) props.onRemoveBlock()
    })

    const onMenuDown = useEventCallback(() => {
      if (props.onMenuDown) props.onMenuDown()
    })

    const onMenuUp = useEventCallback(() => {
      if (props.onMenuUp) props.onMenuUp()
    })

    const onSelectNextBlock = useEventCallback(() => {
      if (props.onSelectNextBlock) props.onSelectNextBlock()
    })

    const onSelectPreviousBlock = useEventCallback(() => {
      if (props.onSelectPreviousBlock) props.onSelectPreviousBlock()
    })

    const onSelectOption = useEventCallback(() => {
      if (props.onSelectOption) props.onSelectOption()
    })

    const isMenuOpen = useEventCallback(() => {
      return props.isMenuOpen
    })

    const editor = useEditor(
      {
        autofocus: true,
        extensions: [
          Document,
          Text,
          Heading.configure({
            levels: block.meta?.level ? [block.meta.level] : [1],
          }),
          Placeholder.configure({
            placeholder: placeholder(block.kind),
          }),
          BlockExtension.configure({
            onOpenMenu,
            onAddBlock,
            onRemoveBlock,
            onMenuDown,
            onMenuUp,
            onCloseMenu,
            onSelectOption,
            isMenuOpen,
            onSelectNextBlock,
            onSelectPreviousBlock,
          }),
        ],
        content: block.content,
        editable: file?.userId === user.id || file?.accessLevel === 'w',
      },
      [block._id, file?.userId, file?.accessLevel],
    )

    useEffect(() => {
      editor?.off('update')
      editor?.on('update', ({ editor: updatedEditor }) => {
        onChange(updatedEditor.getText())
      })
    }, [editor, onChange])

    useImperativeHandle(ref, () => ({
      focusEditor: () => {
        editor?.commands.focus()
      },
    }))

    if (!editor) return null

    return <EditorContent editor={editor} className="blockElement w-full" />
  },
)
