import Link from "next/link"
import { formatDate } from "src/libs/utils"
import { TPost } from "src/types"

type Props = {
  data: TPost
}

// 문서형 목록의 한 줄. 썸네일은 상세 페이지에서만 보여 준다.
const PostCard: React.FC<Props> = ({ data }) => {
  const category = data.category?.[0]
  const tags = data.tags?.slice(0, 3) ?? []

  return (
    <Link
      href={`/${data.slug}`}
      className="group block border-b border-line py-5"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="min-w-0 text-lg font-semibold tracking-tight text-fg underline-offset-4 transition-colors group-hover:text-accent group-hover:underline">
          {data.title}
        </h2>
        <time className="shrink-0 font-mono text-xs text-subtle">
          {formatDate(data?.date?.start_date || data.createdTime, "en-US")}
        </time>
      </div>
      {data.summary && (
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
          {data.summary}
        </p>
      )}
      {(category || tags.length > 0) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs">
          {category && (
            <span className="rounded-full border border-line px-2 py-0.5 text-muted">
              {category}
            </span>
          )}
          {tags.map((tag) => (
            <span key={tag} className="font-mono text-subtle">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}

export default PostCard
