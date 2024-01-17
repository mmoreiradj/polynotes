import axios from 'axios'
import { API_URL } from '../environments/environment'

export const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export * from './file.service'
export * from './auth.service'
export * from './database.service'
export * from './block.service'
export * from './user.service'
