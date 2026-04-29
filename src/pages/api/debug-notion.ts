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

  const collectionId = Object.keys(response.collection ?? {})[0]
  const collectionViewId = Object.keys(response.collection_view ?? {})[0]
  const collectionValue = Object.values(response.collection ?? {})[0]?.value as any
  const collection = collectionValue?.value ?? collectionValue

  // list available methods on api
  const apiMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(api)).filter(
    (m) => typeof (api as any)[m] === "function"
  )

  let collectResult: any = null
  let collectError: any = null
  try {
    collectResult = await (api as any).getCollectionData(
      collectionId,
      collectionViewId,
      collection,
      { limit: 999 }
    )
  } catch (e: any) {
    collectError = e?.message
  }

  res.json({
    apiMethods,
    collectionId,
    collectionViewId,
    collectError,
    collectResultKeys: collectResult ? Object.keys(collectResult) : null,
    collectResultBlockIds:
      collectResult?.result?.reducerResults?.collection_group_results?.blockIds ?? null,
  })
}
