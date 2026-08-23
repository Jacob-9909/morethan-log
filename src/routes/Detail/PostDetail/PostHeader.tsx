import { CONFIG } from "site.config"
import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { ExtendedRecordMap } from "notion-types"
import { formatDate } from "src/libs/utils"
import Image from "next/image"
import React from "react"
import styled from "@emotion/styled"

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
    <StyledWrapper>
      <h1 className="title">{data.title}</h1>
      {data.type[0] !== "Paper" && (
        <nav>
          <div className="top">
            {data.author && data.author[0] && data.author[0].name && (
              <>
                <div className="author">
                  <Image
                    css={{ borderRadius: "50%" }}
                    src={data.author[0].profile_photo || CONFIG.profile.image}
                    alt="profile_photo"
                    width={24}
                    height={24}
                  />
                  <div className="">{data.author[0].name}</div>
                </div>
                <div className="hr"></div>
              </>
            )}
            <div className="date">
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </div>
            {readingTime && (
              <span className="readTime">· {readingTime} min read</span>
            )}
          </div>
          <div className="mid">
            {data.tags && (
              <div className="tags">
                {data.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
          {data.thumbnail && (
            <div className="thumbnail">
              <Image
                src={data.thumbnail}
                css={{ objectFit: "cover" }}
                fill
                alt={data.title}
              />
            </div>
          )}
        </nav>
      )}
    </StyledWrapper>
  )
}

export default PostHeader

const StyledWrapper = styled.div`
  .title {
    font-size: 1.75rem;
    line-height: 2.25rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #18181b;
  }
  @media (min-width: 768px) {
    .title {
      font-size: 2rem;
    }
  }
  [data-scheme="dark"] .title {
    color: #f4f4f5;
  }
  nav {
    margin-top: 1rem;
    color: #71717a;
    > .top {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      font-size: 0.8125rem;
      .author {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .hr {
        margin-top: 0.25rem;
        margin-bottom: 0.25rem;
        align-self: stretch;
        width: 1px;
        background-color: #d4d4d8;
      }
      [data-scheme="dark"] .hr {
        background-color: #3f3f46;
      }
      .date {
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.75rem;
      }
    }
    > .mid {
      display: flex;
      margin-top: 0.75rem;
      align-items: center;
      .tags {
        display: flex;
        overflow-x: auto;
        flex-wrap: wrap;
        gap: 0.5rem;
        max-width: 100%;
      }
    }
    .thumbnail {
      overflow: hidden;
      position: relative;
      margin-top: 1.5rem;
      border-radius: 0.75rem;
      width: 100%;
      background-color: #f4f4f5;
      padding-bottom: 50%;
      border: 1px solid #e4e4e7;
    }
    [data-scheme="dark"] .thumbnail {
      background-color: #27272a;
      border-color: #3f3f46;
    }
  }
`
