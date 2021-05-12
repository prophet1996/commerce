import type { RecursivePartial, RecursiveRequired } from '../api/utils/types'
import { StrapiConfig, getConfig } from '../api'
import { definitions } from '../api/definitions/store-content'
const getAllPages = async ({ config, preview }) => {
  const { commerceUrl: API_URL } = getConfig()
  return { pages: ['pages1'] }
}
export default getAllPages
