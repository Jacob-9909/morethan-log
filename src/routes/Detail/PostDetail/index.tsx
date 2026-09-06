import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import NotionRenderer from "../components/NotionRenderer"
import TableOfContents from "../components/TableOfContents"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  if (!data) return null

  return (
    <article className="mx-auto max-w-prose">
      {data.type[0] === "Post" && <PostHeader data={data} />}
      {data.type[0] === "Post" && (
        <TableOfContents recordMap={data.recordMap} />
      )}
      <NotionRenderer recordMap={data.recordMap} />
      {data.type[0] === "Post" && (
        <>
          <hr className="mt-16" />
          <Footer />
          <CommentBox data={data} />
        </>
      )}
    </article>
  )
}

export default PostDetail
