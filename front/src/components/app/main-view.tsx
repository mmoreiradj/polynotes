import { FileExplorer } from '../files'
import { Carousel } from '../files/carousel'

export function AppMainView() {
  return (
    <div className={'w-full'}>
      <div className="m-5">
        <h1>My workspace</h1>
        <Carousel />
        <FileExplorer />
      </div>
    </div>
  )
}
