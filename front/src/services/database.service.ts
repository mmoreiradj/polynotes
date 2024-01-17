import { AxiosResponse } from 'axios'
import { client } from '.'
import { Database } from '../components/blocks/databases/cells/database.type'

export const databaseService = {
  create(database: Omit<Database, '_id'>) {
    return client.post<Database>('databases', database)
  },
  getAll(): Promise<AxiosResponse<Database[], any>> {
    return client.get<Database[]>(`databases`)
  },
  getOne(id: string) {
    return client.get<Database>(`databases/${id}`)
  },
  deleteOne(id: string) {
    return client.delete<any>(`databases/${id}`)
  },
  updateOne(id: string, data: Database) {
    return client.put<Database>(`databases/${id}`, data)
  },
}
