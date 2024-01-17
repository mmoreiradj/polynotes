import { client } from '.'
import { User } from '../shared/types'

export const authService = {
  profile() {
    return client.get('users/me')
  },
  register(data: { name: string; email: string; password: string }) {
    return client.post<string>('auth/register', data)
  },
  login(data: { email: string; password: string }) {
    return client.post('auth/login', data)
  },
  logout() {
    return client.post('auth/logout')
  },
  validate(data: { token: string }) {
    return client.post<any>('auth/validate', data)
  },
  resend(data: { email: string }) {
    return client.post<any>('auth/resend', data)
  },
}
