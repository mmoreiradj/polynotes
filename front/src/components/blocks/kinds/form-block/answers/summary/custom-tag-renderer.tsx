export type Props = {
  tag: {
    value: string
    count: number
  }
  size: number
  color: string
}

export const CustomTagRenderer = ({ tag, size, color }: Props) => {
  return (
    <span key={tag.value} style={{ color, fontSize: `${size}px` }} className={`tag-cloud-tag`}>
      <span>
        {tag.value} ({tag.count}){' '}
      </span>
    </span>
  )
}
