import Link from "next/link"
import Image from "next/image"
import { formatDate } from "src/libs/utils"
import { TPost } from "src/types"
import { CONFIG } from "site.config"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  return (
    <Link href={`/${data.slug}`} className="group block">
      <article className="flex gap-4 py-4">
        {data.thumbnail && (
          <div className="relative h-[88px] w-[132px] shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            <Image
              src={data.thumbnail}
              alt={data.title}
              fill
              sizes="132px"
              className="object-cover transition-transform duration-200 group-hover:scale-[1.04]"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-1 text-base font-semibold tracking-tight text-zinc-800 transition-colors group-hover:text-accent dark:text-zinc-100 dark:group-hover:text-accent">
            {data.title}
          </h2>
          {data.summary && (
            <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              {data.summary}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
            <time>
              {formatDate(data?.date?.start_date || data.createdTime, "en-US")}
            </time>
            {data.tags && data.tags.length > 0 && (
              <span className="hidden sm:inline">#{data.tags[0]}</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PostCard
