import React, {
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  useContext,
} from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { Placeholder } from '@tiptap/extension-placeholder'
import { StarterKit } from '@tiptap/starter-kit'
import { placeholder } from '../../../utils'
import { BlockMethods } from '../../../shared/types'
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

export const ParagraphBlock = forwardRef(
  (
    { block, file, ...props }: BlockProps & { onSearch: (search: string) => void },
    ref: React.ForwardedRef<BlockMethods>,
  ) => {
    const user = useContext(UserContext)

    const onChange = (c: string) => {
      props.onChange(c)
    }

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

    const isMenuOpen = useEventCallback(() => {
      return props.isMenuOpen
    })

    const onSelectOption = useEventCallback(() => {
      if (props.onSelectOption) props.onSelectOption()
    })

    const onSelectNextBlock = useEventCallback(() => {
      if (props.onSelectNextBlock) props.onSelectNextBlock()
    })

    const onSelectPreviousBlock = useEventCallback(() => {
      if (props.onSelectPreviousBlock) props.onSelectPreviousBlock()
    })

    const editor = useEditor(
      {
        autofocus: true,
        extensions: [
          StarterKit.configure({
            heading: false,
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
        editable: user.id === file.userId || file.accessLevel === 'w',
      },
      [file?.userId, file?.accessLevel],
    )

    useEffect(() => {
      editor?.off('update')
      editor?.on('update', ({ editor: updatedEditor }) => {
        if (props.isMenuOpen && props.onCloseMenu) {
          const text = editor.getText()
          if (editor.getText() === '') {
            props.onCloseMenu()
          } else {
            props.onSearch(text.replace('/', ''))
          }
        }

        onChange(updatedEditor.getHTML())
      })
    }, [editor, props.isMenuOpen, onChange])

    useImperativeHandle(ref, () => ({
      focusEditor: () => {
        editor?.commands.focus()
      },
    }))

    if (!editor) return null

    return <EditorContent editor={editor} className="blockElement w-full" />
  },
)
