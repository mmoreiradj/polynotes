import { client } from '.'
import { User } from '../shared/types'

export const userService = {
  getOne(id: string) {
    return client.get<User>(`users/${id}`)
  },
}
