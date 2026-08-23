import Link from "next/link"
import Image from "next/image"
import { formatDate } from "src/libs/utils"
import { TPost } from "src/types"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  return (
    <Link href={`/${data.slug}`} className="group block">
      <article className="flex items-center gap-4 border-b border-zinc-100 py-3 transition-colors dark:border-zinc-800/70">
        {data.thumbnail && (
          <div className="relative h-14 w-[84px] shrink-0 overflow-hidden rounded-md border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={data.thumbnail}
              alt={data.title}
              fill
              sizes="84px"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}
        <time className="w-[72px] shrink-0 font-mono text-xs text-zinc-400 dark:text-zinc-600">
          {formatDate(data?.date?.start_date || data.createdTime, "en-US")}
        </time>
        <h2 className="min-w-0 flex-1 truncate text-[15px] font-medium text-zinc-700 transition-colors group-hover:text-accent dark:text-zinc-300 dark:group-hover:text-accent">
          {data.title}
        </h2>
        {data.tags && data.tags.length > 0 && (
          <span className="hidden shrink-0 font-mono text-[11px] text-zinc-400 dark:text-zinc-600 sm:block">
            #{data.tags[0]}
          </span>
        )}
      </article>
    </Link>
  )
}

export default PostCard
