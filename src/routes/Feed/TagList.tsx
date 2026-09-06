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
    <div className="mb-8 mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
      {Object.keys(data).map((key) => {
        const active = key === currentTag
        return (
          <Link
            key={key}
            href={`/tag/${encodeURIComponent(key)}`}
            className={`font-mono text-2xs transition-colors ${
              active ? "text-accent" : "text-subtle hover:text-fg"
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
