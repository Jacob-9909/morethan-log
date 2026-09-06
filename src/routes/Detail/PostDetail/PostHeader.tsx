import { CONFIG } from "site.config"
import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { ExtendedRecordMap } from "notion-types"
import { formatDate } from "src/libs/utils"
import Image from "next/image"
import Link from "next/link"
import React from "react"

type Props = {
  data: TPost & { recordMap?: ExtendedRecordMap }
}

const getReadingTime = (recordMap?: ExtendedRecordMap) => {
  if (!recordMap) return null
  const totalChars = Object.values(recordMap.block ?? {}).reduce(
    (acc, block) => {
      const title = block?.value?.properties?.title
      if (!title) return acc
      return (
        acc +
        title.reduce(
          (len: number, segment: any) => len + (segment[0]?.length || 0),
          0
        )
      )
    },
    0
  )
  return Math.max(1, Math.ceil(totalChars / 400))
}

const PostHeader: React.FC<Props> = ({ data }) => {
  const readingTime = getReadingTime(data.recordMap)
  const category = data.category?.[0]
  // PublicOnDetail은 목록에 노출되지 않으므로 카테고리 링크도 걸지 않는다.
  const categoryLinked = category && data.status?.[0] !== "PublicOnDetail"

  return (
    <header className="pb-8">
      {category && (
        <p className="eyebrow mb-3">
          {categoryLinked ? (
            <Link
              href={`/category/${encodeURIComponent(category)}`}
              className="transition-colors hover:text-accent"
            >
              {category}
            </Link>
          ) : (
            category
          )}
        </p>
      )}
      <h1 className="text-3xl font-bold text-fg">{data.title}</h1>
      {data.type[0] !== "Paper" && (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            {data.author?.[0]?.name && (
              <>
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-full border border-line"
                    src={data.author[0].profile_photo || CONFIG.profile.image}
                    alt="profile_photo"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium text-fg">
                    {data.author[0].name}
                  </span>
                </div>
                <span className="h-3 w-px bg-line-strong" aria-hidden />
              </>
            )}
            <span className="font-mono text-xs">
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </span>
            {readingTime && (
              <span className="font-mono text-xs text-subtle">
                · {readingTime} min read
              </span>
            )}
          </div>
          {data.tags && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {data.tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
          {data.thumbnail && (
            <div className="mt-8 flex justify-center overflow-hidden rounded-xl border border-line bg-elevated">
              <img
                src={data.thumbnail}
                className="h-auto max-h-[550px] w-full object-contain"
                alt={data.title}
              />
            </div>
          )}
        </>
      )}
    </header>
  )
}

export default PostHeader
