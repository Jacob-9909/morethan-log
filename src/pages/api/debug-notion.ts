import { NextApiRequest, NextApiResponse } from "next"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"
import { CONFIG } from "site.config"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const api = new NotionAPI({
    authToken: process.env.NOTION_TOKEN,
    activeUser: process.env.NOTION_ACTIVE_USER,
  })

  const id = CONFIG.notionConfig.pageId as string
  const response = await api.getPage(id)
  const uuid = idToUuid(id)

  const collectionQuery = response.collection_query
  const firstCollection = Object.values(collectionQuery ?? {})[0]
  const firstView = firstCollection ? Object.values(firstCollection)[0] : null

  res.json({
    collectionQueryKeys: Object.keys(collectionQuery ?? {}),
    firstCollectionViewKeys: firstCollection ? Object.keys(firstCollection) : [],
    firstViewKeys: firstView ? Object.keys(firstView as object) : [],
    firstViewSample: firstView,
  })
}
