import type { RequestInit } from '@vercel/fetch'
import type { CommerceAPIConfig } from '@commerce/api'
import fetchGraphqlApi from './utils/fetch-graphql-api'
import fetchStoreApi from './utils/fetch-store-api'

export interface StrapiConfig extends CommerceAPIConfig {
  // Indicates if the returned metadata with translations should be applied to the
  // data or returned as it is
  applyLocale?: boolean
  storeApiUrl: string
  storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
}

const API_URL = process.env.STRAPI_STOREFRONT_API_URL || ''
const API_TOKEN = process.env.STRAPI_STOREFRONT_API_TOKEN || ''
const STORE_API_URL = process.env.STRAPI_STOREFRONT_API_URL || ''

if (!API_URL) {
  throw new Error(
    `The environment variable STRAPI_STOREFRONT_API_URL is missing and it's required to access your store`
  )
}

if (!API_TOKEN) {
  throw new Error(
    `The environment variable STRAPI_STOREFRONT_API_TOKEN is missing and it's required to access your store`
  )
}

export class Config {
  private config: StrapiConfig

  constructor(config: Omit<StrapiConfig, 'customerCookie'>) {
    this.config = {
      ...config,
      // The customerCookie is not customizable for now, BC sets the cookie and it's
      // not important to rename it
      customerCookie: 'SHOP_TOKEN',
    }
  }

  getConfig(userConfig: Partial<StrapiConfig> = {}) {
    return Object.entries(userConfig).reduce<StrapiConfig>(
      (cfg, [key, value]) => Object.assign(cfg, { [key]: value }),
      { ...this.config }
    )
  }

  setConfig(newConfig: Partial<StrapiConfig>) {
    Object.assign(this.config, newConfig)
  }
}

const ONE_DAY = 60 * 60 * 24
const config = new Config({
  commerceUrl: API_URL,
  apiToken: API_TOKEN,
  cartCookie: process.env.BIGCOMMERCE_CART_COOKIE ?? 'bc_cartId',
  cartCookieMaxAge: ONE_DAY * 30,
  applyLocale: true,
  fetch: fetchGraphqlApi,
  // REST API only
  storeApiUrl: STORE_API_URL,
  storeApiFetch: fetchStoreApi,
})

export function getConfig(userConfig?: Partial<StrapiConfig>) {
  return config.getConfig(userConfig)
}

export function setConfig(newConfig: Partial<StrapiConfig>) {
  return config.setConfig(newConfig)
}
