import React, {
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  ChangeEvent,
  useContext,
} from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BlockMethods } from '../../../shared/types'
import { BlockProps } from './block-props'
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Image } from '@tiptap/extension-image'
import { Button, Label, TextInput } from 'flowbite-react'
import { BlockExtension } from '../extensions/block.extension'
import { UserContext } from '../../../stores/user/user.context'

function useEventCallback(fn: Function) {
  const ref = useRef<Function>()
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback<Function>(() => (ref.current as Function)(), [])
}

export const ImageBlock = forwardRef(({ block, file, ...props }: BlockProps, ref: React.ForwardedRef<BlockMethods>) => {
  const user = useContext(UserContext)
  const [isImageSet, setIsImageSet] = React.useState(false)
  const [imageUrl, setImageUrl] = React.useState('')

  const onChange = useCallback((c: any) => {
    // props.onChange(c)
    props.onChange(c)
  }, [])

  const onAddBlock = useEventCallback(() => {
    if (props.onAddBlock) props.onAddBlock()
  })

  const onRemoveBlock = useEventCallback(() => {
    if (props.onRemoveBlock) props.onRemoveBlock()
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
        Document,
        Image.configure({
          inline: false,
        }),
        Text,
        BlockExtension.configure({
          onAddBlock,
          onRemoveBlock,
          onSelectPreviousBlock,
          onSelectNextBlock,
        }),
      ],
      content: block.content,
      editable: user.id === file.userId && file.accessLevel === 'w',
    },
    [file.userId, file.accessLevel],
  )

  useEffect(() => {
    editor?.off('update')
    editor?.on('update', ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getHTML())
    })
  }, [editor, onChange])

  useImperativeHandle(ref, () => ({
    focusEditor: () => {
      editor?.commands.focus()
    },
  }))

  const handleOnClick = () => {
    editor?.chain().focus().setImage({ src: imageUrl }).run()
  }

  const handleOnChange = (event: ChangeEvent) => {
    setImageUrl((event.target as HTMLInputElement).value)
  }

  if (!editor) return null

  return (
    <>
      <div className={'flex flex-col items-center mb-1'}>
        {user.id === file.userId && (
          <div className="flex flex-row">
            <Label htmlFor="image" value="Link : " className={'mr-2 '} />
            <TextInput
              id="image"
              placeholder="Enter link to the image"
              className={'mr-2'}
              value={imageUrl}
              required
              onChange={handleOnChange}
            />
            <Button color={'purple'} onClick={handleOnClick}>
              Set
            </Button>
          </div>
        )}
        <EditorContent editor={editor} className="blockElement w-full" />
      </div>
    </>
  )
})
