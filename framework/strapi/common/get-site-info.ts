import type { GetSiteInfoQuery, GetSiteInfoQueryVariables } from '../schema'
import type { RecursivePartial, RecursiveRequired } from '../api/utils/types'
import filterEdges from '../api/utils/filter-edges'
import { getConfig } from '../api'
import { categoryTreeItemFragment } from '../api/fragments/category-tree'
import fetch from '../fetcher'

const getSiteInfo = async ({ config, preview }) => {
  const { commerceUrl: API_URL } = getConfig()
  return {
    categories: await fetch({ url: `${API_URL}/categories` }),
    brands: await fetch({ url: `${API_URL}/brands` }),
  }
}

export default getSiteInfo
