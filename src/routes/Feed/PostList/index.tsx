import { useRouter } from "next/router"
import React, { useEffect, useMemo, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"
import { TPost } from "src/types"

type Props = {
  q: string
}

const MONTH_FORMAT = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "long",
})

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

  const groups = useMemo(() => {
    const map = new Map<string, TPost[]>()
    for (const post of filteredPosts) {
      const raw = post?.date?.start_date || post.createdTime || ""
      const key = String(raw).slice(0, 7)
      if (!key) continue
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(post)
    }
    return [...map.entries()]
  }, [filteredPosts])

  return (
    <div>
      {!filteredPosts.length && (
        <p className="py-10 text-sm text-subtle">아직 노트가 없어요.</p>
      )}
      <motion.div
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.04 },
          },
        }}
      >
        {groups.map(([month, posts]) => (
          <section key={month} className="relative pb-6 pl-6">
            <span className="absolute left-0 top-[7px] h-2 w-2 rounded-full bg-accent ring-4 ring-bg" />
            <span className="absolute bottom-0 left-[3.5px] top-6 w-px bg-line" />
            <h3 className="eyebrow mb-1.5">
              {MONTH_FORMAT.format(new Date(`${month}-15`))}
            </h3>
            {posts.map((post) => (
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
          </section>
        ))}
      </motion.div>
    </div>
  )
}

export default PostList
