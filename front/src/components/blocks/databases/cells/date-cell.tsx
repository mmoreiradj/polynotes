import { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CellProps } from './cell-props.type'

export const DateCell = ({ value, ...props }: CellProps) => {
  const [startDate, setStartDate] = useState(new Date(value))

  const handleOnChange = (date: Date) => {
    props.onChange(date.toISOString())
    setStartDate(date)
  }

  return (
    <DatePicker className="overflow-none" selected={startDate} onChange={handleOnChange} dateFormat={'dd-MM-yyyy'} />
  )
}
