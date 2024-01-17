import App from './App'
import { useReducer } from 'react'
import { UserContext, UserDispatchContext } from './stores/user/user.context'
import { initialUserState, userReducer } from './stores/user/user.reducer'

export const Context = () => {
  // @ts-ignore
  const [user, setUser] = useReducer(userReducer, { ...initialUserState })

  return (
    <>
      <UserContext.Provider value={user}>
        <UserDispatchContext.Provider value={setUser}>
          <App />
        </UserDispatchContext.Provider>
      </UserContext.Provider>
    </>
  )
}
