import { NotionAPI } from "notion-client"

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI({
    authToken: process.env.NOTION_TOKEN,
    activeUser: process.env.NOTION_ACTIVE_USER,
  })
  const recordMap = await api.getPage(pageId)

  // Notion API format change: block values may be double-nested (value.value)
  // and some blocks may have undefined IDs, which crashes react-notion-x's uuidToId
  for (const [key, block] of Object.entries(recordMap.block)) {
    const entry = block?.value as any
    if (entry?.value && typeof entry.value === "object") {
      ;(recordMap.block as any)[key] = { value: entry.value, role: block.role }
    }
    if (!(recordMap.block as any)[key]?.value?.id) {
      delete (recordMap.block as any)[key]
    }
  }

  return recordMap
}
