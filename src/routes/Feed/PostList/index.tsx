import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import PostCard from "src/routes/Feed/PostList/PostCard"
import FeaturedPost from "src/routes/Feed/PostList/FeaturedPost"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { TPost } from "src/types"

type Props = {
  q: string
}

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery()
  const [filteredPosts, setFilteredPosts] = useState<TPost[]>(data)
  const reduceMotion = useReducedMotion()

  const currentTag = `${router.query.tag || ``}` || undefined
  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ``}` || "desc"

  useEffect(() => {
    setFilteredPosts(() => {
      let newFilteredPosts = data
      newFilteredPosts = newFilteredPosts.filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const searchContent = post.title + post.summary + tagContent
        return searchContent.toLowerCase().includes(q.toLowerCase())
      })

      if (currentTag) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) => post && post.tags && post.tags.includes(currentTag)
        )
      }

      if (currentCategory !== DEFAULT_CATEGORY) {
        newFilteredPosts = newFilteredPosts.filter(
          (post) =>
            post && post.category && post.category.includes(currentCategory)
        )
      }
      if (currentOrder !== "desc") {
        newFilteredPosts = newFilteredPosts.reverse()
      }

      return newFilteredPosts
    })
  }, [q, currentTag, currentCategory, currentOrder, setFilteredPosts, data])

  // 필터가 걸린 목록에서 첫 글만 크게 띄우면 "최신"이 아니라 헷갈린다.
  const isDefaultView =
    !q && !currentTag && currentCategory === DEFAULT_CATEGORY
  const featured = isDefaultView ? filteredPosts[0] : undefined
  const gridPosts = featured ? filteredPosts.slice(1) : filteredPosts

  if (!filteredPosts.length) {
    return <p className="py-12 text-sm text-subtle">아직 노트가 없어요.</p>
  }

  return (
    <div>
      {featured && (
        <>
          <FeaturedPost data={featured} />
          <div className="my-10 flex items-center gap-4">
            <span className="eyebrow shrink-0">All notes</span>
            <span className="h-px flex-1 bg-line" />
            <span className="font-mono text-2xs text-subtle">
              {filteredPosts.length}
            </span>
          </div>
        </>
      )}
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {gridPosts.map((post) => (
          <motion.div
            key={post.id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.35, ease: "easeOut" },
              },
            }}
          >
            <PostCard data={post} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default PostList
