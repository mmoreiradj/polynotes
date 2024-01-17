import { AxiosError } from 'axios'
import { Button, Label, TextInput } from 'flowbite-react'
import React, { useContext } from 'react'
import { useRef } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import polynotesLogo from '../../assets/logo.png'
import { authService, client } from '../../services'
import { UserContext, UserDispatchContext } from '../../stores/user/user.context'
import { UserActionType, isAnonymous, isConnected, isLoaded } from '../../stores/user/user.reducer'

type Inputs = {
  email: string
  password: string
}

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<Inputs>()

  const user = useContext(UserContext)
  const dispatch = useContext(UserDispatchContext)

  const navigate = useNavigate()

  const password = useRef({})

  password.current = watch('password', '')

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await authService.login({
        email: data.email,
        password: data.password,
      })

      const response = await authService.profile()

      dispatch({
        type: UserActionType.INIT,
        payload: {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
        },
      })

      navigate('/home', {
        replace: true,
      })
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        setError('email', { type: 'custom', message: 'Invalid credentails' })
        setError('password', { type: 'custom', message: 'Invalid credentails' })
      }
    }
  }

  return (
    <>
      {isConnected(user) && <Navigate to="/home" replace />}
      <div className={'h-screen flex flex-row justify-center items-center w-full'}>
        <img src={polynotesLogo} className={'large-logo'} />
        <div>
          <h1>Login</h1>
          <form
            className="flex flex-col gap-4 mt-10"
            onSubmit={handleSubmit(onSubmit)}
            style={{ maxWidth: '600px', width: 'auto' }}
          >
            <Controller
              name="email"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                maxLength: 512,
                pattern: {
                  value: /^[A-Za-z0-9+_.-]+@(.+)$/,
                  message: 'Enter a valid email address',
                },
              }}
              render={({ field }) => (
                <div>
                  <div>
                    <Label htmlFor="email" value="Your email" />
                  </div>
                  <TextInput
                    type="text"
                    {...field}
                    color={errors.email ? 'failure' : ''}
                    helperText={
                      <React.Fragment>
                        {errors.email && <span className={'text-xs'}>{errors.email.message}</span>}
                      </React.Fragment>
                    }
                  />
                </div>
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue={''}
              rules={{
                required: true,
                maxLength: 100,
              }}
              render={({ field }) => (
                <div>
                  <div>
                    <Label htmlFor="password" value="Your password" />
                  </div>
                  <TextInput
                    type="password"
                    {...field}
                    color={errors.password ? 'failure' : ''}
                    helperText={
                      <React.Fragment>
                        {errors.password && <span className={'text-xs'}>{errors.password.message}</span>}
                      </React.Fragment>
                    }
                  />
                </div>
              )}
            />
            <Button type="submit" color={'purple'}>
              Submit
            </Button>
          </form>
          <div>
            <p className={'text-xs m-2'}>
              Not registered yet ? Click{' '}
              <Link to="/register" className={'text-purple-600'} replace>
                here
              </Link>{' '}
              to register
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
