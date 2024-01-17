import { AxiosError } from 'axios'
import { useContext, useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import polynotesLogo from '../../assets/logo.png'
import { authService } from '../../services'
import { UserContext } from '../../stores/user/user.context'
import { ResendToken } from './resend-token'
import { isAnonymous, isConnected, isLoaded } from '../../stores/user/user.reducer'

export const ConfirmEmail = () => {
  const [searchParams] = useSearchParams()

  const user = useContext(UserContext)

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token == null) {
      setIsLoading(false)
      return
    }

    const validate = async (token: string) => {
      try {
        await authService.validate({ token })
        navigate('/login')
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          setHasError(true)
        }
      }
    }

    validate(token).then(() => setIsLoading(false))
  }, [])

  return (
    <>
      {isConnected(user) && <Navigate to="/home" replace />}
      <div className={'h-screen flex flex-row justify-center items-center w-full'}>
        <img src={polynotesLogo} className={'large-logo'} />
        {!isLoading && !hasError && (
          <div>
            <h1>
              One last step{' '}
              <span style={{ color: 'red' }}>
                (This feature has been disabled to save on costs, simply login, your account is already activated)
              </span>
            </h1>
            <p>Check your mail box, we sent you a link to activate your account</p>
            <p className={'mt-3 text-xs'}>
              Done ? click{' '}
              <Link to="/login" className={'text-purple-600'}>
                here
              </Link>{' '}
              to login
            </p>
          </div>
        )}
        {!isLoading && hasError && (
          <div>
            <h1>Oops !</h1>
            <p>Looks like something went wrong, the token might have expired...</p>
            <p>You can try sending one again by clicking here : </p>
            <ResendToken />
          </div>
        )}
      </div>
    </>
  )
}
