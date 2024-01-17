import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { EditorContent, useEditor } from '@tiptap/react'
import { useEffect } from 'react'
import { CellProps } from './cell-props.type'

export const TextCell = ({ value, ...props }: CellProps) => {
  const editor = useEditor({
    extensions: [Paragraph, Text, Document],
    content: value,
  })

  const onChange = (c: any) => {
    props.onChange(c)
  }

  useEffect(() => {
    editor?.off('update')
    editor?.on('update', ({ editor: updatedEditor }) => {
      onChange(updatedEditor.getText())
    })
  }, [editor, onChange])

  return <EditorContent editor={editor} />
}
