import { createContext, Dispatch } from 'react'
import { User } from '../../shared/types'
import { initialUserState, UserAction } from './user.reducer'

export const UserContext = createContext<User>(initialUserState)
export const UserDispatchContext = createContext<Dispatch<UserAction>>({} as Dispatch<UserAction>)
