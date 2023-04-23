import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { Response } from 'express'
import { Error } from 'mongoose'

@Catch(Error)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()

    const errorObject: { [key: string]: number | string } = {}

    switch (exception.name) {
      case Error.CastError.name:
        errorObject.statusCode = 400
        errorObject.message = 'The provided id is not valid'
        break
      case Error.DocumentNotFoundError.name:
        errorObject.statusCode = 404
        errorObject.message = 'The requested resource was not found'
        break
      case Error.ValidationError.name:
        errorObject.statusCode = 400
        errorObject.message = 'The provided id is not valid'
        const validationException = exception as Error.ValidationError
        Object.keys(validationException.errors).forEach((key) => {
          errorObject[key] = validationException.errors[key].message
        })
        break
      default:
        errorObject.statusCode = 500
        errorObject.message = 'Internal server error'
    }

    const response = ctx.getResponse<Response>()

    response.status(errorObject.statusCode ?? 500).send(errorObject)
  }
}
