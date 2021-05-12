import createApiHandler, {
  StrapiApiHandler,
  StrapiHandler,
} from '../utils/create-api-handler'
import isAllowedMethod from '../utils/is-allowed-method'
import { StrapiApiError } from '../utils/errors'
import signup from './handlers/signup'

export type SignupBody = {
  username: String
  email: string
  password: string
}

export type SignupHandlers = {
  signup: StrapiHandler<null, { cartId?: string } & Partial<SignupBody>>
}

const METHODS = ['POST']

const signupApi: StrapiApiHandler<null, SignupHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const cartId = cookies[config.cartCookie]

  try {
    const body = { ...req.body, cartId }
    return await handlers['signup']({ req, res, config, body })
  } catch (error) {
    console.error(error)

    const message =
      error instanceof StrapiApiError
        ? 'An unexpected error ocurred with the Strapi API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

const handlers = { signup }

export default createApiHandler(signupApi, handlers, {})
