import type { ReactNode } from 'react'
import {
  CommerceConfig,
  CommerceProvider as CoreCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@commerce'
import { strapiProvider, StrapiProvider } from './provider'

export { strapiProvider }
export type { StrapiProvider }

export const strapiConfig: CommerceConfig = {
  locale: 'en-us',
  cartCookie: 'strapi_cartId',
}

export type StrapiConfig = Partial<CommerceConfig>

export type BigcommerceProps = {
  children?: ReactNode
  locale: string
} & StrapiConfig

export function CommerceProvider({ children, ...config }: BigcommerceProps) {
  return (
    <CoreCommerceProvider
      provider={strapiProvider}
      config={{ ...strapiConfig, ...config }}
    >
      {children}
    </CoreCommerceProvider>
  )
}

export const useCommerce = () => useCoreCommerce<StrapiProvider>()
