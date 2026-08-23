import { useState } from "react"
import { useRouter } from "next/router"
import { motion, useReducedMotion } from "framer-motion"

import SearchInput from "./SearchInput"
import Footer from "./Footer"
import PostList from "./PostList"
import TagList from "./TagList"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")
  const router = useRouter()
  const posts = usePostsQuery()
  const reduceMotion = useReducedMotion()

  const currentCategory =
    `${router.query.category || ``}` || DEFAULT_CATEGORY
  const categories = [
    ...new Set(
      posts
        .map((p) => p.category?.[0])
        .filter((c): c is string => Boolean(c))
    ),
  ]

  const selectCategory = (category: string) => {
    const query = { ...router.query }
    if (category === DEFAULT_CATEGORY) {
      delete query.category
    } else {
      query.category = category
    }
    router.push({ pathname: "/", query })
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 md:py-16">
      <ProfileIntro />
      <div className="mt-10">
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <CategoryChips
        categories={categories}
        current={currentCategory}
        onSelect={selectCategory}
        reduceMotion={reduceMotion}
      />
      <TagList />
      <PostList q={q} />
      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}

type ChipsProps = {
  categories: string[]
  current: string
  onSelect: (category: string) => void
  reduceMotion: boolean | null
}

const CategoryChips: React.FC<ChipsProps> = ({
  categories,
  current,
  onSelect,
  reduceMotion,
}) => {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4 mt-4 flex flex-wrap gap-1.5"
    >
      {[DEFAULT_CATEGORY, ...categories].map((category) => {
        const active = category === current
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              active
                ? "bg-accent text-white"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            {category}
          </button>
        )
      })}
    </motion.div>
  )
}

const ProfileIntro = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
        노트
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        공부한 것을 기록합니다. 배운 건 짧게, 남은 건 오래.
      </p>
    </div>
  )
}

export default Feed
