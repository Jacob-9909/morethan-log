import { CONFIG } from "site.config"
import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { ExtendedRecordMap } from "notion-types"
import { formatDate } from "src/libs/utils"
import Image from "next/image"
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
  return (
    <div className="pb-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-3xl">
        {data.title}
      </h1>
      {data.type[0] !== "Paper" && (
        <nav className="mt-4 text-zinc-500 dark:text-zinc-400">
          <div className="flex flex-wrap items-center gap-3 text-[13px]">
            {data.author && data.author[0] && data.author[0].name && (
              <>
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-full"
                    src={data.author[0].profile_photo || CONFIG.profile.image}
                    alt="profile_photo"
                    width={24}
                    height={24}
                  />
                  <span className="font-medium text-zinc-700 dark:text-zinc-200">
                    {data.author[0].name}
                  </span>
                </div>
                <div className="h-3 w-px bg-zinc-200 dark:bg-zinc-800" />
              </>
            )}
            <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </div>
            {readingTime && (
              <span className="text-zinc-400 dark:text-zinc-500">
                · {readingTime} min read
              </span>
            )}
          </div>
          {data.tags && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
          {data.thumbnail && (
            <div className="relative mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 pb-[50%] dark:border-zinc-800 dark:bg-zinc-900">
              <Image
                src={data.thumbnail}
                className="object-cover"
                fill
                alt={data.title}
              />
            </div>
          )}
        </nav>
      )}
    </div>
  )
}

export default PostHeader
