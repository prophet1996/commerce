import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { StrapiConfig, getConfig } from '..'

export type StrapiApiHandler<
  T = any,
  H extends StrapiHandlers = {},
  Options extends {} = {}
> = (
  req: NextApiRequest,
  res: NextApiResponse<StrapiApiResponse<T>>,
  config: StrapiConfig,
  handlers: H,
  // Custom configs that may be used by a particular handler
  options: Options
) => void | Promise<void>

export type StrapiHandler<T = any, Body = null> = (options: {
  req: NextApiRequest
  res: NextApiResponse<StrapiApiResponse<T>>
  config: StrapiConfig
  body: Body
}) => void | Promise<void>

export type StrapiHandlers<T = any> = {
  [k: string]: StrapiHandler<T, any>
}

export type StrapiApiResponse<T> = {
  data: T | null
  errors?: { message: string; code?: string }[]
}

export default function createApiHandler<
  T = any,
  H extends StrapiHandlers = {},
  Options extends {} = {}
>(
  handler: StrapiApiHandler<T, H, Options>,
  handlers: H,
  defaultOptions: Options
) {
  return function getApiHandler({
    config,
    operations,
    options,
  }: {
    config?: StrapiConfig
    operations?: Partial<H>
    options?: Options extends {} ? Partial<Options> : never
  } = {}): NextApiHandler {
    const ops = { ...operations, ...handlers }
    const opts = { ...defaultOptions, ...options }

    return function apiHandler(req, res) {
      return handler(req, res, getConfig(config), ops, opts)
    }
  }
}
