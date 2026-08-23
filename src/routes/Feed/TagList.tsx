import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useTagsQuery } from "src/hooks/useTagsQuery"

type Props = {}

const TagList: React.FC<Props> = () => {
  const router = useRouter()
  const currentTag = router.query.tag || undefined
  const data = useTagsQuery()

  return (
    <div className="mb-6 mt-4 flex flex-wrap gap-1.5">
      {Object.keys(data).map((key) => {
        const active = key === currentTag
        return (
          <Link
            key={key}
            href={`/tag/${encodeURIComponent(key)}`}
            className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-colors ${
              active
                ? "bg-accent text-white"
                : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            #{key}
          </Link>
        )
      })}
    </div>
  )
}

export default TagList
