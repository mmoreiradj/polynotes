import { Modal, Label, TextInput, Button } from 'flowbite-react'
import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { FormProps } from './form-props.type'

type Inputs = {
  name: string
}

type Props = {
  onCreate: (name: string) => void
  isShown: boolean
  onClose: () => void
}

export const DatabaseForm = ({ isShown, onClose, onCreate }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()

  const onSubmit = (data: Inputs) => {
    onCreate(data.name)

    onClose()
  }

  return (
    <React.Fragment>
      <Modal show={isShown} size="md" popup onClose={onClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create new database</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={''}
                  rules={{ required: true, minLength: 3, maxLength: 25 }}
                  render={({ field }) => (
                    <div>
                      <div>
                        <Label htmlFor="name" value="Database name" />
                      </div>
                      <TextInput type="text" id="name" {...field} color={errors.name ? 'failure' : ''} />
                    </div>
                  )}
                />
              </div>
              <div className="mt-5 w-full">
                <Button type="submit">Add</Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}
