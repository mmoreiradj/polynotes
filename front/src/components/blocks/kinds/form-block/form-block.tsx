import { useContext, useEffect, useState } from 'react'
import { Form_ } from '../../../../shared/types/form.type'
import { BlockProps } from '../block-props'
import { formService } from '../../../../services/form.service'
import { BlocksDispatchContext } from '../../../../stores/blocks/blocks.context'
import { BlockActionType } from '../../../../stores/blocks/blocks.reducer'
import { UserContext } from '../../../../stores/user/user.context'
import { FormEditor } from './form-editor'
import { FormAnswerSheet } from './answers/answer-sheet'

export const FormBlock = ({ block, file, ...props }: BlockProps) => {
  const [form, setForm] = useState<Form_>()

  const [isFormOwner, setIsFormOwner] = useState<boolean>(false)

  const user = useContext(UserContext)

  const dispatch = useContext(BlocksDispatchContext)

  useEffect(() => {
    const fetchData = async () => {
      const response = await formService.getOne(block.content as string)
      setForm(response.data)
      setIsFormOwner(response.data.owner === user.id)
    }

    const createForm = async () => {
      const response = await formService.createOne()
      dispatch({
        type: BlockActionType.CHANGED,
        payload: [
          {
            ...block,
            content: response.data._id,
          },
        ],
        fileId: file._id,
      })
      setForm(response.data)
      setIsFormOwner(true)
    }

    if (!block.content || block.content === '') {
      createForm()
    } else {
      fetchData()
    }
  }, [])

  return (
    <div className="w-full">
      {isFormOwner && form && <FormEditor form={form} onUpdateForm={(form: Form_) => setForm(form)} />}
      {!isFormOwner && form && <FormAnswerSheet form={form} />}
    </div>
  )
}
