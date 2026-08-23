import { useState } from "react"

import SearchInput from "./SearchInput"
import Footer from "./Footer"
import PostList from "./PostList"
import TagList from "./TagList"

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 md:py-16">
      <ProfileIntro />
      <div className="mt-10 flex items-center gap-3">
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <TagList />
      <PostList q={q} />
      <div className="mt-16">
        <Footer />
      </div>
    </div>
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
