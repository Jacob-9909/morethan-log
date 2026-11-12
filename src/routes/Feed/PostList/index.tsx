import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import PostCard from "src/routes/Feed/PostList/PostCard"
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

  if (!filteredPosts.length) {
    return <p className="py-12 text-sm text-subtle">아직 노트가 없어요.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-line pb-2">
        <span className="eyebrow">Notes</span>
        <span className="font-mono text-2xs text-subtle">
          {filteredPosts.length} posts
        </span>
      </div>
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.04 } },
        }}
      >
        {filteredPosts.map((post) => (
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
