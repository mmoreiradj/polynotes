import { useContext, useEffect, useReducer } from 'react'
import { RouterProvider } from 'react-router-dom'
import { UserContext, UserDispatchContext } from './stores/user/user.context'
import { router } from './router'
import { UserActionType, isAnonymous, isLoaded, userReducer } from './stores/user/user.reducer'
import { filesReducer } from './stores/files/files.reducer'
import { FilesContext, FilesDispatchContext } from './stores/files/files.context'
import { authService } from './services'

function App() {
  // @ts-ignore
  const [files, setFiles] = useReducer(filesReducer, [])

  const user = useContext(UserContext)

  const dispatch = useContext(UserDispatchContext)

  useEffect(() => {
    if (isLoaded(user) && !isAnonymous(user)) return
    const initUser = async () => {
      try {
        const res = await authService.profile()

        dispatch({
          type: UserActionType.INIT,
          payload: {
            id: res.data._id,
            email: res.data.email,
            name: res.data.name,
          },
        })
      } catch (error) {
        dispatch({
          type: UserActionType.INIT,
          payload: {
            id: 'ANONYMOUS',
            email: 'ANONYMOUS',
            name: 'ANONYMOUS',
          },
        })
      }
    }
    initUser()
  }, [])

  return (
    <FilesContext.Provider value={files}>
      <FilesDispatchContext.Provider value={setFiles}>
        <RouterProvider router={router} />
      </FilesDispatchContext.Provider>
    </FilesContext.Provider>
  )
}

export default App
