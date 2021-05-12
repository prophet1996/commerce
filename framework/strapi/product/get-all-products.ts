import type {
  GetAllProductsQuery,
  GetAllProductsQueryVariables,
} from '../schema'
import type { Product } from '@commerce/types'
import type { RecursivePartial, RecursiveRequired } from '../api/utils/types'
import filterEdges from '../api/utils/filter-edges'
import setProductLocaleMeta from '../api/utils/set-product-locale-meta'
import { productConnectionFragment } from '../api/fragments/product'
import { StrapiConfig, getConfig } from '../api'
import { normalizeProduct } from '../lib/normalize'
import fetch from '../fetcher'

const getAllProducts = async () => {
  const { commerceUrl: API_URL } = getConfig()
  return { products: await fetch({ url: `${API_URL}/products` }) }
}
export default getAllProducts
