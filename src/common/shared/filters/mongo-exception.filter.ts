import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { Error } from 'mongoose'

@Catch(Error)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    let statusCode: number
    let errorCode: string
    let message: string
    const field = ''

    switch (exception.name) {
      case 'CastError':
        statusCode = 400
        message = 'The provided id is not valid'
        break
      case 'DocumentNotFoundError':
        statusCode = 404
        message = 'The requested resource was not found'
      default:
        statusCode = 500
        message = 'Internal server error'
    }

    const response = ctx.getResponse<Response>()

    response.status(statusCode).send({
      statusCode,
      errorCode,
      message,
      field: field ?? undefined,
    })
  }
}
