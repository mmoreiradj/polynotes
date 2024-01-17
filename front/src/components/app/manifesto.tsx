import polynotesLogoLarge from '../../assets/logo-large.svg'
import { Button } from 'flowbite-react'
import { Navigate, useNavigate } from 'react-router-dom'

export const Manifesto = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Navigate to={'/home'} />
      <div className={'flex flex-col items-center w-100 h-100'}>
        <img className={'w-1/2'} src={polynotesLogoLarge} />
        <div className={'w-1/3 text-center'}>
          Looking for a productivity tool that can do it all? Look no further than Polynotes! This powerhouse platform
          is your one-stop-shop for note-taking, to-do lists, project management, knowledge sharing, and personal
          organization. With Polynotes, you can customize and adapt your workspace to suit your needs, whether you're a
          solo entrepreneur, a student or part of a large team. Say goodbye to scattered notes and hello to streamlined
          productivity with Polynotes!
        </div>
        <Button
          className={'mt-10'}
          color={'purple'}
          onClick={() =>
            navigate('/register', {
              replace: true,
            })
          }
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}
