import { User } from '../../shared/types'

export enum UserActionType {
  INIT = 'init',
  EMPTY = 'empty',
}

export interface UserAction {
  type: UserActionType
  payload?: User
}

export const initialUserState: User = {
  id: 'LOADING',
  name: 'LOADING',
  email: 'LOADING',
}

export const isAnonymous = (user: User): boolean =>
  user.id === 'ANONYMOUS' && user.name === 'ANONYMOUS' && user.email === 'ANONYMOUS'

export const isLoaded = (user: User): boolean =>
  user.id !== 'LOADING' && user.name !== 'LOADING' && user.email !== 'LOADING'

export const isConnected = (user: User): boolean => !isAnonymous(user) && isLoaded(user)

export const userReducer = (user: User, action: UserAction): User | undefined => {
  const { type, payload } = action
  switch (type) {
    case UserActionType.INIT:
      return payload
    case UserActionType.EMPTY:
      return {
        id: 'ANONYMOUS',
        name: 'ANONYMOUS',
        email: 'ANONYMOUS',
      }
    default:
      throw new Error('Unsupported action')
  }
}
