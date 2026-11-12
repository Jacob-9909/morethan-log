import Link from "next/link"
import Image from "next/image"
import { formatDate } from "src/libs/utils"
import { TPost } from "src/types"

type Props = {
  data: TPost
}

// 문서형 목록의 한 줄. 썸네일이 있는 글만 오른쪽에 작게 보여 준다.
const PostCard: React.FC<Props> = ({ data }) => {
  const category = data.category?.[0]
  const tags = data.tags?.slice(0, 3) ?? []

  return (
    <Link
      href={`/${data.slug}`}
      className="group flex gap-4 border-b border-line py-5 sm:gap-6"
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-semibold tracking-tight text-fg underline-offset-4 transition-colors group-hover:text-accent group-hover:underline">
          {data.title}
        </h2>
        {data.summary && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
            {data.summary}
          </p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs">
          <time className="font-mono text-subtle">
            {formatDate(data?.date?.start_date || data.createdTime, "en-US")}
          </time>
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
      </div>
      {data.thumbnail && (
        <div className="relative aspect-[16/10] w-24 shrink-0 self-start overflow-hidden rounded-md border border-line bg-elevated sm:w-36">
          {/* ponytail: Notion 이미지 서버가 Next 최적화기(서버 fetch)에 403을 줘서 브라우저가 직접 받는다.
              원본 크기를 그대로 받으므로 무거우면 썸네일을 리사이즈해 public/에 두는 쪽으로 바꾼다. */}
          <Image
            src={data.thumbnail}
            alt=""
            fill
            unoptimized
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
    </Link>
  )
}

export default PostCard
