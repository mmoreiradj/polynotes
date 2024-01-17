import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { Form_ } from '../../../../../shared/types/form.type'
import { FormAnswer } from '../../../../../shared/types/form-answer.type'
import { FormField, FormFieldKind } from '../../../../../shared/enum/form-field.enum'
import { Card, Label, TextInput, Textarea, Select, Button } from 'flowbite-react'
import { FormFieldAnswer } from '../../../../../shared/types/form-field-answer.type'
import { formAnswerService } from '../../../../../services/form-answer.service'

const placeholder = (fieldKind: FormFieldKind): string => {
  switch (fieldKind) {
    case FormFieldKind.INTEGER:
      return 'Enter a number'
    case FormFieldKind.TEXT:
      return 'Long answer'
    case FormFieldKind.TINYTEXT:
      return 'Short answer'
    default:
      return ''
  }
}

type Props = {
  form: Form_
}

export const FormAnswerSheet = ({ form }: Props) => {
  const [answers, setAnswers] = useState<FormFieldAnswer[]>([])

  const [errors, setErrors] = useState<Map<string, string[]>>(new Map())

  const [isReady, setIsReady] = useState<boolean>(false)

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const rFields: Map<string, FormField> = useMemo(() => {
    const map = new Map<string, FormField>()
    form.fields.forEach((field: FormField) => map.set(field._id, field))
    return map
  }, [])

  const validateOne = (answer: FormFieldAnswer) => {
    setErrors((prev) => {
      const newErrors = new Map(prev)
      newErrors.delete(answer.formField)
      return newErrors
    })
    const field = rFields.get(answer.formField)
    if (!field) throw new Error('Field not found')

    if (field.isRequired && answer.value === undefined) {
      addError(field, 'This field is required')
      return
    } else if (answer.value === undefined) {
      return
    }

    if (field.kind === FormFieldKind.INTEGER && (answer.value as number) >= Number.MAX_SAFE_INTEGER) {
      addError(field, 'This number is too big')
    } else if (
      (field.kind === FormFieldKind.TEXT && (answer.value as string).length > 500) ||
      (field.kind === FormFieldKind.TINYTEXT && (answer.value as string).length > 50)
    ) {
      addError(field, 'This text is too long')
    } else if (field.kind === FormFieldKind.SELECT && !field!.options!.includes(answer.value as string)) {
      addError(field, 'This is not a valid option')
    }
  }

  const validate = () => {
    answers.forEach((answer: FormFieldAnswer) => {
      validateOne(answer)
    })
  }

  useEffect(() => {
    const initialAnswers = form.fields.map((field: FormField) => {
      return {
        formField: field._id,
        value: '',
      }
    })
    setAnswers(initialAnswers)
    setIsReady(true)
  }, [])

  useEffect(() => {
    validate()
  }, [answers])

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors(new Map())
    validate()
    if (errors.size > 0) return
    const answer: FormAnswer = {
      form: form._id,
      answers,
    }
    answer.answers = answer.answers.filter((answer: FormFieldAnswer) => answer.value !== '')
    setIsSubmitted(true)
    formAnswerService.create(answer)
  }

  const addError = (field: FormField, error: string): void => {
    setErrors((prev) => {
      const newErrors = new Map(prev)
      const fieldErrors = newErrors.get(field._id) || []
      newErrors.set(field._id, [...fieldErrors, error])
      return newErrors
    })
  }

  return (
    <div className="w-full">
      <form className="" onSubmit={handleOnSubmit}>
        {isReady &&
          form.fields.map((field: FormField) => {
            const answer = answers.find((answer: FormFieldAnswer) => answer.formField === field._id)
            if (!answer) throw new Error('Answer not found')
            const labelValue = field.label + (field.isRequired ? ' (required)' : '')
            const attributes = {
              id: `answer-${field._id}`,
              placeholder: placeholder(field.kind),
              onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                const value = e.target.value
                const newAnswers = answers.map((answer: FormFieldAnswer) => {
                  if (answer.formField === field._id) {
                    if (field.kind === FormFieldKind.INTEGER) {
                      const valueAsNumber = Number(value)
                      if (isNaN(valueAsNumber)) return answer
                      if (valueAsNumber >= Number.MAX_SAFE_INTEGER) {
                        return {
                          ...answer,
                          value: Number.MAX_SAFE_INTEGER,
                        }
                      }
                      if (value === '')
                        return {
                          ...answer,
                          value: '',
                        }
                      return {
                        ...answer,
                        value: valueAsNumber,
                      }
                    }
                    return {
                      ...answer,
                      value,
                    }
                  }
                  return answer
                })

                setAnswers(newAnswers)
              },
              color: errors.has(field._id) ? 'failure' : 'gray',
              helperText: errors.has(field._id) ? errors.get(field._id) : '',
            }
            return (
              <div key={field._id} className="mb-2">
                <Card>
                  <h5>
                    <Label value={labelValue} htmlFor={`answer-${field._id}`} className="text-xl" />
                  </h5>
                  <p className="text-s">{field?.description}</p>
                  {field.kind === FormFieldKind.INTEGER && (
                    <TextInput type="text" {...attributes} value={answer.value} />
                  )}
                  {field.kind === FormFieldKind.TINYTEXT && (
                    <TextInput type="text" {...attributes} value={answer.value} />
                  )}
                  {field.kind === FormFieldKind.TEXT && <Textarea {...attributes} value={undefined} />}
                  {field.kind === FormFieldKind.SELECT && (
                    <Select {...attributes} value={answer.value}>
                      {field.isRequired && <option value={''}>please choose an option</option>}
                      {!field.isRequired && <option value={''}>Aucune option</option>}
                      {field!.options!.map((option: string, index: number) => (
                        <option value={option} key={index}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  )}
                </Card>
              </div>
            )
          })}
        <div className="w-full flex items-center flex-col">
          {!!errors.size && <p>Please fix the errors</p>}
          {!isSubmitted && (
            <Button type="submit" color="purple">
              Submit
            </Button>
          )}
          {isSubmitted && <p>Thank you for your submission</p>}
        </div>
      </form>
    </div>
  )
}
