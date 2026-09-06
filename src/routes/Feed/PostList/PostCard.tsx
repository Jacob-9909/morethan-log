import Link from "next/link"
import Image from "next/image"
import { formatDate } from "src/libs/utils"
import { TPost } from "src/types"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  const category = data.category?.[0]

  return (
    <Link
      href={`/${data.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-accent/40"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-elevated">
        {data.thumbnail ? (
          <Image
            src={data.thumbnail}
            alt={data.title}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          // 썸네일 없는 글이 많아 빈 칸 대신 카테고리를 채운다.
          <span className="flex h-full items-center justify-center px-4 text-center font-mono text-2xs uppercase tracking-[0.14em] text-subtle">
            {category || "note"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="line-clamp-2 text-base font-semibold tracking-tight text-fg transition-colors group-hover:text-accent">
          {data.title}
        </h2>
        {data.summary && (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
            {data.summary}
          </p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-3 font-mono text-2xs text-subtle">
          <time>
            {formatDate(data?.date?.start_date || data.createdTime, "en-US")}
          </time>
          {data.tags?.[0] && (
            <>
              <span aria-hidden>·</span>
              <span className="truncate">#{data.tags[0]}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PostCard
