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
  const blockEntry = response.block[uuid]?.value as any
  const blockData = blockEntry?.value ?? blockEntry

  res.json({
    responseTopLevelKeys: Object.keys(response),
    blockType: blockData?.type,
    collectionKeys: Object.keys(response.collection ?? {}),
    collectionQueryKeys: Object.keys(collectionQuery ?? {}),
    hasCollectionQuery: Object.keys(collectionQuery ?? {}).length > 0,
    pageId: uuid,
  })
}
