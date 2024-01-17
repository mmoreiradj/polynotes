export const isPolynotesError = (data: any): boolean => {
  const error = data as PolynoteError
  if (error?.code && error?.field && error?.message) {
    return true
  }
  return false
}

export enum PolynoteErrors {
  UNIQUE = 'PN1',
  USER_NOT_ACTIVATED = 'PN0',
}

export type PolynoteError = {
  code: PolynoteErrors
  field: string
  message: string
}
