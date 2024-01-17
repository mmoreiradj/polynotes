import { AppSideBar, AppTopNav } from '.'
import { Navigate, Outlet } from 'react-router-dom'
import { useContext } from 'react'
import { User } from '../../shared/types'
import { UserContext } from '../../stores/user/user.context'
import { isAnonymous } from '../../stores/user/user.reducer'

export function Home() {
  const user = useContext<User>(UserContext)

  return (
    <>
      {isAnonymous(user) && <Navigate to="/login" />}
      <div className={'h-screen'}>
        <AppTopNav />
        <div className={'flex flex-row h-full'}>
          <AppSideBar />
          <Outlet />
        </div>
      </div>
    </>
  )
}
