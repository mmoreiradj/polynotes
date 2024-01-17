import { ListGroup } from 'flowbite-react'
import { Option } from '../../shared/types'
import './style/select-menu.scss'

type SelectMenuProps = {
  options: Option[]
  activeOption: number
  position: {
    x: number
    y: number
  }
}

const MENU_HEIGHT = 85

export const SelectMenu = ({ options, activeOption, position }: SelectMenuProps) => {
  const x = position.x
  const y = position.y - MENU_HEIGHT

  const attributes = { top: y, left: x }

  return (
    <div className={'menuWrapper'} style={attributes}>
      <ListGroup className={'menu'}>
        {options.map((option, index) => {
          const isActive = index === activeOption
          return (
            <ListGroup.Item key={index} active={isActive}>
              {option.label}
            </ListGroup.Item>
          )
        })}
      </ListGroup>
    </div>
  )
}
