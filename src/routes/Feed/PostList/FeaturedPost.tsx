import Link from "next/link"
import Image from "next/image"
import { formatDate } from "src/libs/utils"
import { TPost } from "src/types"

type Props = {
  data: TPost
}

const FeaturedPost: React.FC<Props> = ({ data }) => {
  const category = data.category?.[0]

  return (
    <Link
      href={`/${data.slug}`}
      className="group grid items-center gap-5 sm:grid-cols-[1.3fr_1fr] sm:gap-7"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-line bg-elevated">
        {data.thumbnail ? (
          <Image
            src={data.thumbnail}
            alt={data.title}
            fill
            priority
            sizes="(min-width: 1024px) 440px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-mono text-2xs uppercase tracking-[0.14em] text-subtle">
            {category || "note"}
          </span>
        )}
      </div>
      <div>
        <p className="eyebrow text-accent">Latest</p>
        <h2 className="mt-2 line-clamp-3 text-2xl font-bold tracking-tight text-fg transition-colors group-hover:text-accent">
          {data.title}
        </h2>
        {data.summary && (
          <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">
            {data.summary}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 font-mono text-2xs text-subtle">
          <time>
            {formatDate(data?.date?.start_date || data.createdTime, "en-US")}
          </time>
          {data.tags?.[0] && (
            <>
              <span aria-hidden>·</span>
              <span>#{data.tags[0]}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}

export default FeaturedPost
