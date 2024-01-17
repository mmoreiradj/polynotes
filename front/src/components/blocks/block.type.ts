import { Level } from '@tiptap/extension-heading'

export enum BlockKind {
  PARAGRAPH = 'paragraph', // paragraph, bullet list
  HEADING = 'heading', // headings only
  IMAGE = 'image', // images, gifs, videos, etc
  LAYOUT = 'layout', // split blocks in two
  CODE_BLOCK = 'code', // code blocks
  DATABASE_VIEW = 'database', // database view
  FORM = 'form', // form
}

export type Meta = {
  viewMode?: string
  database?: string
  level?: Level
}

export type Block = {
  _id: string
  kind: BlockKind
  content: Block[] | string
  meta?: Meta
}
