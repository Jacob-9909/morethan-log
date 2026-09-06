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
      <article className="-mx-3 flex gap-4 rounded-xl px-3 py-3.5 transition-colors hover:bg-elevated/50">
        {data.thumbnail && (
          <div className="relative h-[84px] w-[126px] shrink-0 overflow-hidden rounded-lg border border-line bg-elevated">
            <Image
              src={data.thumbnail}
              alt={data.title}
              fill
              sizes="126px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-1 text-lg font-semibold tracking-tight text-fg transition-colors group-hover:text-accent">
            {data.title}
          </h2>
          {data.summary && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">
              {data.summary}
            </p>
          )}
          <div className="mt-2.5 flex items-center gap-2 font-mono text-2xs text-subtle">
            <time>
              {formatDate(data?.date?.start_date || data.createdTime, "en-US")}
            </time>
            {data.tags?.[0] && (
              <>
                <span aria-hidden>·</span>
                <span className="hidden sm:inline">#{data.tags[0]}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PostCard
