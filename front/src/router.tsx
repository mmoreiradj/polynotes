import { createBrowserRouter } from 'react-router-dom'
import { ErrorPage, Home, AppMainView } from './components/app'
import { Manifesto } from './components/app/manifesto'
import { ConfirmEmail } from './components/auth/confirm-email'
import { LoginPage } from './components/auth/login-page'
import { RegisterPage } from './components/auth/register-page'
import { PageView } from './components/blocks'
import { Cgu } from './components/app/cgu'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Manifesto />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/cgu',
    element: <Cgu />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/confirm-email',
    element: <ConfirmEmail />,
  },
  {
    path: '/home',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <AppMainView />,
      },
      {
        path: ':fileId',
        element: <PageView source="home" />,
      },
    ],
  },
  {
    path: '/pages/:fileId',
    element: <PageView source="public" />,
    errorElement: <ErrorPage />,
  },
])
