import { BadRequestException } from '@nestjs/common'
import { ObjectId } from 'mongodb'

interface ToNumberOptions {
  default?: number
  min?: number
  max?: number
}

export function toLowerCase(value: string): string {
  return value.toLowerCase()
}

export function trim(value: string): string {
  return value.trim()
}

export function toDate(value: string): Date {
  return new Date(value)
}

export function toBoolean(value: string): boolean {
  value = value.toLowerCase()

  return value === 'true' || value === '1'
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let newValue: number = Number.parseInt(value || String(opts.default), 10)

  if (Number.isNaN(newValue)) {
    newValue = opts.default
  }

  if (opts.min) {
    if (newValue < opts.min) {
      newValue = opts.min
    }

    if (newValue > opts.max) {
      newValue = opts.max
    }
  }

  return newValue
}

export function toAscOrDesc(value: string): 'asc' | 'desc' {
  value = value.toLowerCase()

  if (value === 'asc' || value === 'desc') {
    return value
  }

  return 'desc'
}

export function toFieldOrDefault(value: string, allowedValues: string[], defaultValue: string): string {
  if (allowedValues.includes(value)) {
    return value
  }

  return defaultValue
}

export function toObjectId(value: string): ObjectId | undefined {
  if (value === undefined) return undefined

  const validObjectId = ObjectId.isValid(value)

  if (!validObjectId) {
    throw new BadRequestException('Invalid ObjectId')
  }

  return ObjectId.createFromHexString(value)
}

export function toNull(value: string): null | undefined {
  if (value === undefined) return undefined

  if (value === 'null') return null

  throw new BadRequestException('Field parent can either be "null" or an ObjectId')
}

export function toNullOrObjectId(value: string): ObjectId | null | undefined {
  try {
    return toObjectId(value)
  } catch (e) {
    if (e instanceof BadRequestException) {
      return toNull(value)
    } else {
      throw e
    }
  }
}
