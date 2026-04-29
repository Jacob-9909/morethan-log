import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { Block, ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import styled from "@emotion/styled"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id?: string) => {
  if (!id) return "https://www.notion.so/"
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

const mapImageUrl = (url: string, block: Block) => {
  if (!url) return ""
  if (url.startsWith("data:") || url.startsWith("https://images.unsplash.com")) {
    return url
  }
  if (url.startsWith("/images")) {
    url = `https://www.notion.so${url}`
  }
  if (!url.startsWith("/image")) {
    url = `https://www.notion.so/image/${encodeURIComponent(url)}`
  } else {
    url = `https://www.notion.so${url}`
  }
  const u = new URL(url)
  if (block) {
    const table = block.parent_table === "space" ? "block" : block.parent_table
    u.searchParams.set("table", table === "collection" || table === "team" ? "block" : table)
    u.searchParams.set("id", block.id ?? "")
    u.searchParams.set("cache", "v2")
  }
  return u.toString()
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  return (
    <StyledWrapper>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
        mapImageUrl={mapImageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  /* // TODO: why render? */
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
  }
  .notion-list {
    width: 100%;
  }
`
