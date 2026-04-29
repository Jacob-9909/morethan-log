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

  let queryResult: any = null
  let queryError: any = null
  try {
    queryResult = await (api as any).queryCollection({
      collectionId,
      collectionViewId,
      query: {},
      loader: {
        type: "reducer",
        reducers: {
          collection_group_results: {
            type: "results",
            limit: 999,
          },
        },
        searchQuery: "",
        userTimeZone: "Asia/Seoul",
      },
    })
  } catch (e: any) {
    queryError = e?.message
  }

  res.json({
    collectionId,
    collectionViewId,
    queryResultKeys: queryResult ? Object.keys(queryResult) : null,
    queryResultResult: queryResult?.result,
    queryError,
  })
}
