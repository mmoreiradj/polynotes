import { Card, Label, TextInput, Checkbox, Textarea, Select, Button } from 'flowbite-react'
import { FormField, FormFieldKind } from '../../../../shared/enum/form-field.enum'
import { useContext, useEffect, useState } from 'react'
import { EllipsisVerticalIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ZodFormattedError, z } from 'zod'
import { formFieldService } from '../../../../services/form-field.service'
import { UserContext } from '../../../../stores/user/user.context'
import { Form_ } from '../../../../shared/types/form.type'

type Props = {
  form: Form_
  formField: FormField
  onAddField: () => void
  onDeleteField: () => void
  isSingle: boolean
}

const formFieldSchema = z.object({
  label: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  isRequired: z.boolean(),
  kind: z.nativeEnum(FormFieldKind),
})

const formFieldOptionsSchema = z.object({
  options: z.array(z.string().max(50).min(1)).min(2).max(10),
})

export const FormFieldElement = ({ form, formField, ...props }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: formField._id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [field, setFormField] = useState<FormField>(formField)

  const [fieldErrors, setFieldErrors] = useState<ZodFormattedError<Omit<FormField, '_id' | 'options'>> | null>(null)

  const [optionsErrors, setOptionsErrors] = useState<ZodFormattedError<{ options: string[] }> | null>(null)

  const [optionsNotUnique, setOptionsNotUnique] = useState<boolean>(false)

  useEffect(() => {
    let hasErrors = false

    const res1 = formFieldSchema.safeParse(field)
    if (res1.success) {
      setFieldErrors(null)
    } else {
      hasErrors = true
      setFieldErrors(res1.error.format())
    }

    if (field.kind === FormFieldKind.SELECT) {
      const res2 = formFieldOptionsSchema.safeParse(field)
      if (res2.success) {
        setOptionsErrors(null)
      } else {
        hasErrors = true
        setOptionsErrors(res2.error.format())
      }

      if (field.options!.length !== [...new Set(field!.options)].length) {
        hasErrors = true
        setOptionsNotUnique(true)
      } else {
        setOptionsNotUnique(false)
      }
    } else {
      setOptionsErrors(null)
      setOptionsNotUnique(false)
    }

    let delayBounceFn: number

    if (!hasErrors) {
      delayBounceFn = setTimeout(async () => {
        await formFieldService.update(form._id, field._id, field)
      }, 500)
    }
    return () => clearTimeout(delayBounceFn)
  }, [field, field.options])

  return (
    <div className="flex mb-2" ref={setNodeRef} style={style}>
      <button
        {...listeners}
        {...attributes}
        tabIndex={-1}
        className="w-5 border mr-1 rounded-lg bg-white flex items-center"
      >
        <EllipsisVerticalIcon className="w-5 h-5" />
      </button>
      <Card className="w-full">
        <div className="flex justify-between w-full">
          <div className="w-full  mr-2">
            <Label id={field._id} htmlFor={field._id} value="Field name" />
            <TextInput
              type="text"
              id={field._id}
              value={field.label}
              onChange={(e) => {
                setFormField({ ...field, label: e.target.value })
              }}
              color={fieldErrors?.label ? 'failure' : 'gray'}
              helperText={fieldErrors?.label?._errors}
            />
            <Label htmlFor={field._id} value="Field description" />
            <Textarea
              id={field._id}
              value={field.description}
              onChange={(e) => {
                setFormField({ ...field, description: e.target.value })
              }}
              color={fieldErrors?.description ? 'failure' : 'gray'}
              helperText={fieldErrors?.description?._errors}
            />
          </div>
          <div className="min-w-max">
            <Label htmlFor={field._id} value="Field type" />
            <Select
              id={field._id}
              defaultValue={field.kind}
              onChange={(e) => {
                if (field.kind !== FormFieldKind.SELECT && e.target.value === FormFieldKind.SELECT) {
                  setFormField({ ...field, options: ['Option 1', 'Option 2'], kind: e.target.value as FormFieldKind })
                } else {
                  setFormField({ ...field, kind: e.target.value as FormFieldKind, options: undefined })
                }
              }}
            >
              <option value={FormFieldKind.TEXT}>Réponse longue</option>
              <option value={FormFieldKind.INTEGER}>Nombre</option>
              <option value={FormFieldKind.TINYTEXT}>Réponse courte</option>
              <option value={FormFieldKind.SELECT}>Choix multiples</option>
            </Select>
          </div>
        </div>
        <div>
          {field.kind === FormFieldKind.SELECT && (
            <div>
              <br />
              <Label htmlFor={field._id} value="Options" />
              <ul>
                {field.options?.map((option, index) => (
                  <li key={index}>
                    <div className="flex items-baseline mb-2">
                      <span className="w-5">{index}. </span>
                      <Label>
                        <TextInput
                          type="text"
                          value={option}
                          color={optionsErrors?.options && optionsErrors.options[index] ? 'failure' : 'gray'}
                          onChange={(e) => {
                            const newOptions = field.options as string[]
                            newOptions[index] = e.target.value
                            setFormField({ ...field, options: newOptions })
                          }}
                          helperText={
                            <>
                              {optionsErrors?.options && optionsErrors.options[index]?._errors}
                              {optionsNotUnique && <p className="text-red-500">Options must be unique</p>}
                            </>
                          }
                        />
                      </Label>
                      {field.options!.length > 2 && (
                        <Button
                          color="none"
                          onClick={() => {
                            setFormField({ ...field, options: field.options!.filter((_, i) => i !== index) })
                          }}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <div className="w-5" />
                <Button
                  color="purple"
                  onClick={() => {
                    setFormField({ ...field, options: [...(field.options as string[]), ''] })
                  }}
                >
                  Add Option
                </Button>
              </div>
            </div>
          )}
        </div>
        <hr />
        <div className="flex justify-end">
          <div className="mr-2">
            <button className="mr-2" onClick={props.onAddField}>
              <PlusIcon className="w-6 h-6" />
            </button>
            {!props.isSingle && (
              <button onClick={props.onDeleteField}>
                <TrashIcon className="w-6 h-6" />
              </button>
            )}
          </div>
          <div className="mr-2 inline-block h-[30px] min-h-[1em] w-0.5 self-stretch bg-neutral-100 opacity-100 dark:opacity" />
          <div>
            <Label htmlFor={field._id} value="Is required" className="mr-2" />
            <Checkbox
              id={field._id}
              checked={field.isRequired}
              onChange={() => {
                setFormField({ ...field, isRequired: !field.isRequired })
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}
