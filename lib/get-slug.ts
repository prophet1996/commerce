// Remove trailing and leading slash, usually included in nodes
// returned by the BigCommerce API
const getSlug = (path: string) => {
  console.log(path)
  return path.replace(/^\/|\/$/g, '')
}

export default getSlug
