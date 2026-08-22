import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

const POSTS_CACHE_TTL_MS = 1000 * 60 * 5
let postsCache: { at: number; data: TPosts } | null = null

export const getPosts = async () => {
  if (postsCache && Date.now() - postsCache.at < POSTS_CACHE_TTL_MS) {
    return postsCache.data
  }
  try {
    const data = await fetchPosts()
    postsCache = { at: Date.now(), data }
    return data
  } catch (error) {
    if (postsCache) return postsCache.data
    throw error
  }
}

const fetchPosts = async (): Promise<TPosts> => {
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI({
    authToken: process.env.NOTION_TOKEN,
    activeUser: process.env.NOTION_ACTIVE_USER,
  })

  const response = await api.getPage(id)
  id = idToUuid(id)
  const collectionValue = Object.values(response.collection)[0]?.value as any
  const collection = collectionValue?.value ?? collectionValue
  const schema = collection?.schema

  const blockValue = (response.block[id].value as any)?.value ?? response.block[id].value

  if (
    blockValue?.type !== "collection_view_page" &&
    blockValue?.type !== "collection_view"
  ) {
    return []
  }

  const collectionId = Object.keys(response.collection)[0]
  const collectionViewId = Object.keys(response.collection_view)[0]

  // getPage does not populate collection_query, so fetch explicitly
  const collectionData = await (api as any).getCollectionData(
    collectionId,
    collectionViewId,
    collection,
    { limit: 999 }
  )

  const pageIds: string[] =
    collectionData?.result?.reducerResults?.collection_group_results?.blockIds ?? []

  const block = { ...response.block, ...(collectionData?.recordMap?.block ?? {}) }

  const data = []
  for (let i = 0; i < pageIds.length; i++) {
    const pageId = pageIds[i]
    const properties = (await getPageProperties(pageId, block, schema)) || null
    if (!properties) continue

    const pageBlockValue = (block[pageId]?.value as any)?.value ?? block[pageId]?.value
    if (!pageBlockValue) continue

    properties.createdTime = new Date(pageBlockValue?.created_time).toString()
    properties.fullWidth = (pageBlockValue?.format as any)?.page_full_width ?? false

    data.push(properties)
  }

  data.sort((a: any, b: any) => {
    const dateA: any = new Date(a?.date?.start_date || a.createdTime)
    const dateB: any = new Date(b?.date?.start_date || b.createdTime)
    return dateB - dateA
  })

  const seenSlugs = new Map<string, number>()
  for (const post of data) {
    const normalized = String(post.slug ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
    post.slug = normalized || "untitled"
    const count = seenSlugs.get(post.slug) ?? 0
    seenSlugs.set(post.slug, count + 1)
    if (count > 0) post.slug = `${post.slug}-${count + 1}`
  }

  return data as TPosts
}
