import { AxiosError } from 'axios'
import { Button, Checkbox, Label, TextInput } from 'flowbite-react'
import React, { useContext } from 'react'
import { useRef } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { Link, Navigate } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import polynotesLogo from '../../assets/logo.png'
import { authService } from '../../services'
import { isPolynotesError, PolynoteError, PolynoteErrors } from '../../shared/types'
import { UserContext } from '../../stores/user/user.context'
import { isAnonymous, isLoaded } from '../../stores/user/user.reducer'

type Inputs = {
  name: string
  email: string
  password: string
  confirm: string
  age: string
  cgu: string
}

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<Inputs>()

  const user = useContext(UserContext)

  const navigate = useNavigate()

  const password = useRef({})

  password.current = watch('password', '')

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      navigate('/confirm-email', {
        replace: true,
      })
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.code === AxiosError.ERR_BAD_REQUEST &&
        isPolynotesError(error.response?.data)
      ) {
        const pError = error.response?.data as PolynoteError

        if (pError.code === PolynoteErrors.UNIQUE && pError.field === 'email') {
          setError('email', { type: 'custom', message: 'Email already taken' })
        }
      }
    }
  }

  return (
    <>
      {!isAnonymous(user) && !isLoaded(user) && <Navigate to="/home" replace />}
      <div className={'h-screen flex flex-row justify-center items-center w-full'}>
        <img src={polynotesLogo} className={'large-logo'} />
        <div>
          <h1>Register</h1>
          <form
            className="flex flex-col gap-4 mt-10"
            onSubmit={handleSubmit(onSubmit)}
            style={{ maxWidth: '600px', width: 'auto' }}
          >
            <Controller
              name="name"
              control={control}
              defaultValue={''}
              rules={{ required: true, minLength: 3, maxLength: 25 }}
              render={({ field }) => (
                <div>
                  <div>
                    <Label htmlFor="name" value="Your name" />
                  </div>
                  <TextInput
                    type="text"
                    id="name"
                    {...field}
                    color={errors.name ? 'failure' : ''}
                    helperText={
                      <React.Fragment>
                        {errors.name && <span className={'text-xs'}>{errors.name.message}</span>}
                      </React.Fragment>
                    }
                  />
                </div>
              )}
            />
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
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{12,}/,
                  message:
                    'Password must be at least 12 characters long, has 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character',
                },
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
            <Controller
              name="confirm"
              control={control}
              defaultValue={''}
              rules={{ required: true, validate: (value) => value === password.current || 'Passwords do not match' }}
              render={({ field }) => (
                <div>
                  <div>
                    <Label htmlFor="confirm" value="Enter your password again" />
                  </div>
                  <TextInput
                    id="confirm"
                    type="password"
                    {...field}
                    color={errors.confirm ? 'failure' : ''}
                    helperText={
                      <React.Fragment>
                        {errors.confirm && <span className={'text-xs'}>{errors.confirm.message}</span>}
                      </React.Fragment>
                    }
                  />
                </div>
              )}
            />
            <Controller
              name="age"
              control={control}
              defaultValue={''}
              rules={{ required: true }}
              render={({ field }) => (
                <div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="age" {...field} color={errors.age ? 'failure' : ''} />
                    <Label htmlFor="age" value="I am over 13" />
                    {errors.age && <span className={'text-xs'}>{errors.age.message}</span>}
                  </div>
                  {errors.age && errors.age.type === 'required' && (
                    <span className={'text-xs text-red-500'}>This is required</span>
                  )}
                </div>
              )}
            />
            <Controller
              name="cgu"
              control={control}
              defaultValue={''}
              rules={{ required: true }}
              render={({ field }) => (
                <div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="cgu" {...field} color={errors.cgu ? 'failure' : ''} />
                    <Label htmlFor="cgu">
                      I agree to the{' '}
                      <Link to="/cgu" target="_blank" className={'text-blue-600 hover:underline dark:text-blue-500'}>
                        terms and conditions
                      </Link>
                    </Label>
                  </div>
                  {errors.cgu && errors.cgu.type === 'required' && (
                    <span className={'text-xs text-red-500'}>This is required</span>
                  )}
                </div>
              )}
            />
            <Button type="submit" color={'purple'}>
              Submit
            </Button>
          </form>
          <div>
            <p className={'text-xs m-2'}>
              Already registered ? Click{' '}
              <Link to="/login" className={'text-purple-600'} replace>
                here
              </Link>{' '}
              to log in
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
