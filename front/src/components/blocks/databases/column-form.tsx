import { Modal, Label, TextInput, Button, Select } from 'flowbite-react'
import React, { useEffect } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Column, ColumnKind } from './cells/column.type'
import { v4 as uuid } from 'uuid'

type Inputs = {
  name: string
  kind: ColumnKind
  options: {
    value: string
  }[]
}

type Props = {
  isShown: boolean
  onCreate: (column: Column) => void
  onClose: () => void
}

export const ColumnForm = ({ onCreate, isShown, onClose }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    register,
    setError,
  } = useForm<Inputs>()

  const { fields, append, remove } = useFieldArray<Inputs>({
    control,
    name: 'options',
  })

  const kind = watch('kind')

  const onSubmit = (data: Inputs) => {
    const column: Column = {
      key: uuid(),
      name: data.name,
      kind: data.kind,
    }

    if (data.kind === ColumnKind.Enum && data.options.length === 0) {
      setError('options', {
        type: 'required',
        message: 'At least one option is required',
      })
      return
    }

    if (data.kind === ColumnKind.Enum) {
      column.meta = data.options.map((option) => option.value)
    }
    onClose()
    onCreate(column)
    reset()
  }

  useEffect(() => {
    if (kind === ColumnKind.Enum && fields.length === 0) {
      append({ value: '' })
    } else if (kind !== ColumnKind.Enum && fields.length > 0) {
      remove(0)
    }
  }, [kind])

  return (
    <React.Fragment>
      <Modal show={isShown} size="md" popup onClose={onClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create new column</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => (
                    <div>
                      <div>
                        <Label htmlFor="name" value="Column name" />
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
                  name="kind"
                  control={control}
                  defaultValue={ColumnKind.Text}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <div>
                      <div>
                        <Label htmlFor="kind" value="Column kind" />
                      </div>
                      <Select id="kind" {...field} color={errors.kind ? 'failure' : ''}>
                        <option value={ColumnKind.Text}>Text</option>
                        <option value={ColumnKind.Checkbox}>Check Box</option>
                        <option value={ColumnKind.Date}>Date</option>
                        <option value={ColumnKind.Enum}>Enum</option>
                        <option value={ColumnKind.Checkbox}>Checkbox</option>
                      </Select>
                    </div>
                  )}
                />
                {kind === ColumnKind.Enum &&
                  fields.map((item, index) => (
                    <div key={item.id}>
                      <Controller
                        {...register(`options.${index}.value`)}
                        control={control}
                        defaultValue={''}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <div>
                            <div>
                              <Label htmlFor={`options.${index}.value`} value="Option" />
                            </div>
                            <div className="w-full flex">
                              <TextInput
                                type="text"
                                id={`options.${index}.value`}
                                {...field}
                                color={errors.options ? 'failure' : ''}
                              />
                              <Button
                                type="button"
                                className="ml-2"
                                color="failure"
                                onClick={() => {
                                  remove(index)
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      />
                    </div>
                  ))}
                {kind === ColumnKind.Enum && (
                  <div className="w-full flex justify-center mt-2">
                    <Button color="purple" onClick={() => append({ value: '' })} type="button">
                      Add more options
                    </Button>
                  </div>
                )}
              </div>
              <div className="mt-5 w-full">
                <Button color="purple" type="submit">
                  Add
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}
