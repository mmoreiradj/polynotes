import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

type Props = {
  onGoBackwards: () => void
  isRoot: boolean
}

export const ArrowNav = ({ onGoBackwards, isRoot }: Props) => {
  let prevClassName = 'h-6 w-6 mr-2'
  if (isRoot) {
    prevClassName += ' text-slate-300'
  }
  return (
    <div className={'flex'}>
      <button onClick={() => onGoBackwards()}>
        <ArrowLeftIcon className={prevClassName} />
      </button>
    </div>
  )
}
