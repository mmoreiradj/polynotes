import { Button, Label, TextInput } from 'flowbite-react'
import React, { useContext } from 'react'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { authService } from '../../services'
import { UserContext } from '../../stores/user/user.context'
import { Navigate } from 'react-router-dom'
import { isAnonymous, isLoaded } from '../../stores/user/user.reducer'

type Inputs = {
  email: string
  password: string
}

export const ResendToken = () => {
  const [isShown, setShown] = useState<boolean>(false)
  const [isSent, setIsSent] = useState<boolean>(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const user = useContext(UserContext)

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await authService.resend({
      email: data.email,
    })
    setIsSent(true)
  }

  let color = ''

  if (errors.email) {
    color = 'failure'
  } else if (isSent) {
    color = 'success'
  }

  return (
    <>
      {!isAnonymous(user) && isLoaded(user) && <Navigate to="/home" />}
      {!isShown && (
        <Button className={'mt-2'} color="purple" onClick={() => setShown(true)}>
          Send mail
        </Button>
      )}
      {isShown && (
        <form
          className="flex flex-col mt-2"
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
                  color={color}
                  helperText={
                    <React.Fragment>
                      {errors.email && <span className={'text-xs'}>{errors.email.message}</span>}
                      {isSent && (
                        <span className={'text-xs'}>An validation link has been sent to that email if it exists</span>
                      )}
                    </React.Fragment>
                  }
                />
              </div>
            )}
          />
          <Button color="purple" type="submit" disabled={isSent}>
            Send mail
          </Button>
        </form>
      )}
    </>
  )
}
