import { useState } from "react"
import { useRouter } from "next/router"
import { motion, useReducedMotion } from "framer-motion"

import SearchInput from "./SearchInput"
import Footer from "./Footer"
import PostList from "./PostList"
import TagList from "./TagList"
import Sidebar from "./Sidebar"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")
  const router = useRouter()
  const posts = usePostsQuery()
  const reduceMotion = useReducedMotion()

  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY
  const categories = [
    ...new Set(
      posts.map((p) => p.category?.[0]).filter((c): c is string => Boolean(c))
    ),
  ]

  const thisMonth = new Date().toISOString().slice(0, 7)
  const monthlyNotes = posts.filter(
    (p) =>
      String(p?.date?.start_date || p.createdTime).slice(0, 7) === thisMonth
  ).length

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
    <div className="mx-auto w-full max-w-2xl px-4 py-12 md:py-16 lg:grid lg:max-w-shell lg:grid-cols-[1fr_200px] lg:gap-16">
      <div className="min-w-0">
        <ProfileIntro />
        <div className="mt-8">
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
        <div className="mt-16 lg:hidden">
          <Footer />
        </div>
      </div>
      <Sidebar totalNotes={posts.length} monthlyNotes={monthlyNotes} />
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
      className="mt-6 flex flex-wrap gap-1.5"
    >
      {[DEFAULT_CATEGORY, ...categories].map((category) => {
        const active = category === current
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-accent-solid text-accent-on"
                : "bg-elevated/60 text-muted hover:bg-elevated hover:text-fg"
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
      <p className="eyebrow">Note</p>
      <h1 className="mt-2 text-3xl font-bold text-fg">노트</h1>
      <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
        공부한 것을 기록합니다. 배운 건 짧게, 남은 건 오래.
      </p>
    </div>
  )
}

export default Feed
