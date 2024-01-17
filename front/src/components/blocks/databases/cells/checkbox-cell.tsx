import { Checkbox } from 'flowbite-react'
import { useState } from 'react'
import { CellProps } from './cell-props.type'

export const CheckboxCell = ({ value, ...props }: CellProps) => {
  const [checked, setChecked] = useState<boolean>(value === 'true')

  const handleOnChange = (value: string) => {
    setChecked(!checked)
    props.onChange(checked ? 'false' : 'true')
  }

  return <Checkbox id="remember" checked={checked} onChange={(e) => handleOnChange(e.target.value)} />
}
