import type { Response } from '@vercel/fetch'

export class StrapiApiError extends Error {
  status: number
  res: Response
  data: any

  constructor(msg: string, res: Response, data?: any) {
    super(msg)
    this.name = 'StrapiApiError'
    this.status = res.status
    this.res = res
    this.data = data
  }
}

export class StrapiNetworkError extends Error {
  constructor(msg: string) {
    super(msg)
    this.name = 'StrapiNetworkError'
  }
}
