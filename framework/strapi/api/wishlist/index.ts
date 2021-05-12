import isAllowedMethod from '../utils/is-allowed-method'
import createApiHandler, {
  StrapiApiHandler,
  StrapiHandler,
} from '../utils/create-api-handler'
import { StrapiApiError } from '../utils/errors'
import type {
  Wishlist,
  WishlistItem,
} from '../../customer/get-customer-wishlist'
import getWishlist from './handlers/get-wishlist'
import addItem from './handlers/add-item'
import removeItem from './handlers/remove-item'
import type { Product, ProductVariant, Customer } from '@commerce/types'

export type { Wishlist, WishlistItem }

export type ItemBody = {
  productId: Product['id']
  variantId: ProductVariant['id']
}

export type AddItemBody = { item: ItemBody }

export type RemoveItemBody = { itemId: Product['id'] }

export type WishlistBody = {
  customer_id: Customer['entityId']
  is_public: number
  name: string
  items: any[]
}

export type AddWishlistBody = { wishlist: WishlistBody }

export type WishlistHandlers = {
  getWishlist: StrapiHandler<
    Wishlist,
    { customerToken?: string; includeProducts?: boolean }
  >
  addItem: StrapiHandler<
    Wishlist,
    { customerToken?: string } & Partial<AddItemBody>
  >
  removeItem: StrapiHandler<
    Wishlist,
    { customerToken?: string } & Partial<RemoveItemBody>
  >
}

const METHODS = ['GET', 'POST', 'DELETE']

// TODO: a complete implementation should have schema validation for `req.body`
const wishlistApi: StrapiApiHandler<Wishlist, WishlistHandlers> = async (
  req,
  res,
  config,
  handlers
) => {
  if (!isAllowedMethod(req, res, METHODS)) return

  const { cookies } = req
  const customerToken = cookies[config.customerCookie]

  try {
    // Return current wishlist info
    if (req.method === 'GET') {
      const body = {
        customerToken,
        includeProducts: req.query.products === '1',
      }
      return await handlers['getWishlist']({ req, res, config, body })
    }

    // Add an item to the wishlist
    if (req.method === 'POST') {
      const body = { ...req.body, customerToken }
      return await handlers['addItem']({ req, res, config, body })
    }

    // Remove an item from the wishlist
    if (req.method === 'DELETE') {
      const body = { ...req.body, customerToken }
      return await handlers['removeItem']({ req, res, config, body })
    }
  } catch (error) {
    console.error(error)

    const message =
      error instanceof StrapiApiError
        ? 'An unexpected error ocurred with the Strapi API'
        : 'An unexpected error ocurred'

    res.status(500).json({ data: null, errors: [{ message }] })
  }
}

export const handlers = {
  getWishlist,
  addItem,
  removeItem,
}

export default createApiHandler(wishlistApi, handlers, {})
