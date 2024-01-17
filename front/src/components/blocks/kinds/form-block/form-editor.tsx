import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { FormFieldElement } from './form-field'
import { FormHeader, FormView } from './form-header'
import { useState } from 'react'
import { formFieldService } from '../../../../services/form-field.service'
import { Form_ } from '../../../../shared/types/form.type'
import { FormField } from '../../../../shared/enum/form-field.enum'
import { AnswerView } from './answers/answer-view'

type Props = {
  form: Form_
  onUpdateForm: (form: Form_) => void
}

export const FormEditor = ({ form, onUpdateForm }: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [selectedView, setSelectedView] = useState<FormView>(FormView.QUESTIONS)

  const handleOnDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over?.id || active.id === over?.id) return

    const activeIndex = form!.fields.findIndex((field: FormField) => field._id === active.id)
    const overIndex = form!.fields.findIndex((field: FormField) => field._id === over.id)

    if (activeIndex === -1 || overIndex === -1) return

    const activeField = form!.fields[activeIndex]

    const newFields = [...form!.fields]

    newFields.splice(activeIndex, 1)
    newFields.splice(overIndex, 0, activeField)

    onUpdateForm({
      ...form!,
      fields: newFields,
    })

    await formFieldService.moveOne(form!._id, active.id.toString(), over.id.toString())
  }

  const handleOnAddField = async (fieldId: string) => {
    const response = await formFieldService.createOneAfter(form!._id, fieldId)
    onUpdateForm({ ...form!, fields: response.data })
  }

  const handleOnDeleteField = async (fieldId: string) => {
    if (form?.fields.length === 1) return
    await formFieldService.deleteOne(form!._id, fieldId)
    onUpdateForm({
      ...form!,
      fields: form!.fields.filter((field) => field._id !== fieldId),
    })
  }

  return (
    <>
      <div className="flex">
        <div className="w-5" />
        <FormHeader selectedView={selectedView} onChangeView={(view: FormView) => setSelectedView(view)} />
      </div>
      {selectedView === FormView.QUESTIONS && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleOnDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={form?.fields.map((field) => field._id) || []}>
            {form &&
              form.fields.map((field) => (
                <FormFieldElement
                  key={field._id}
                  form={form}
                  formField={field}
                  onAddField={() => handleOnAddField(field._id)}
                  onDeleteField={() => handleOnDeleteField(field._id)}
                  isSingle={form.fields.length === 1}
                />
              ))}
          </SortableContext>
        </DndContext>
      )}
      {selectedView === FormView.ANSWERS && <AnswerView form={form} />}
    </>
  )
}
