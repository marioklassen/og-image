import { defineEventHandler, setHeader } from 'h3'
import { parseURL, withBase, withoutTrailingSlash } from 'ufo'
import { fetchPayload, useHostname } from '../../utils'
import { useProvider } from '#nuxt-og-image/provider'

export default defineEventHandler(async (e) => {
  const path = parseURL(e.path).pathname
  // convert to regex
  if (!path.endsWith('__og_image__/svg'))
    return

  const basePath = withoutTrailingSlash(path
    .replace('__og_image__/svg', ''),
  )

  const { provider: providerName } = await fetchPayload(basePath)
  setHeader(e, 'Content-Type', 'image/svg+xml')
  const provider = await useProvider(providerName!)
  return provider.createSvg(withBase(`${basePath}/__og_image__/html`, useHostname(e)))
})