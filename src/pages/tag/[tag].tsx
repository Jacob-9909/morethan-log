import styled from "@emotion/styled"
import { dehydrate } from "@tanstack/react-query"
import { GetStaticProps } from "next"
import { getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { queryKey } from "src/constants/queryKey"
import { createQueryClient } from "src/libs/react-query"
import {
  filterPosts,
  getAllSelectItemsFromPosts,
} from "src/libs/utils/notion"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { CONFIG } from "site.config"
import { NextPageWithLayout, TPost } from "../../types"

type Props = {
  tag?: string
  posts?: TPost[]
  dehydratedState?: unknown
}

const decodeParam = (value?: string | string[]) => {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return undefined
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

export const getStaticPaths = async () => {
  try {
    const posts = filterPosts(await getPosts())
    const tags = getAllSelectItemsFromPosts("tags", posts)

    return {
      paths: Object.keys(tags).map((tag) => ({
        params: { tag: encodeURIComponent(tag) },
      })),
      fallback: "blocking",
    }
  } catch (error) {
    console.error("[tag] getStaticPaths failed:", error)
    return {
      paths: [],
      fallback: "blocking",
    }
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  try {
    const queryClient = createQueryClient()
    const tag = decodeParam(context.params?.tag)

    if (!tag) {
      return {
        notFound: true,
        revalidate: CONFIG.revalidateTime,
      }
    }

    const feedPosts = filterPosts(await getPosts())
    const normalizedTag = tag.toLowerCase()
    const matchedPosts = feedPosts.filter((post) =>
      post.tags?.some(
        (postTag) => postTag.toLowerCase() === normalizedTag
      )
    )

    await queryClient.prefetchQuery(queryKey.posts(), () => matchedPosts)

    return {
      props: {
        tag,
        posts: matchedPosts,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: CONFIG.revalidateTime,
    }
  } catch (error) {
    console.error("[tag] getStaticProps failed:", error)
    return {
      notFound: true,
      revalidate: CONFIG.revalidateTime,
    }
  }
}

const TagArchivePage: NextPageWithLayout<Props> = ({ tag, posts }) => {
  const archivePosts = posts ?? []

  const meta = {
    title: `${tag ?? "Tag"} - ${CONFIG.blog.title}`,
    description: CONFIG.blog.description,
    type: "website",
    url: `${CONFIG.link}/tag/${encodeURIComponent(tag ?? "")}`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <StyledWrapper>
        <div className="header">
          <div className="pill">{tag}</div>
          <div className="count">{archivePosts.length} Posts</div>
        </div>
        <div className="list">
          {!archivePosts.length && (
            <p className="empty">해당 글이 없습니다.</p>
          )}
          {archivePosts.map((post) => (
            <PostCard key={post.id} data={post} />
          ))}
        </div>
      </StyledWrapper>
    </>
  )
}

TagArchivePage.getLayout = (page) => {
  return <>{page}</>
}

export default TagArchivePage

const StyledWrapper = styled.div`
  padding: 2rem 0;

  @media (max-width: 768px) {
    padding: 0.5rem 0;
  }

  > .header {
    display: flex;
    padding-bottom: 0.75rem;
    margin-bottom: 1rem;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

    > .pill {
      display: inline-block;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
      padding-left: 0.75rem;
      padding-right: 0.75rem;
      border-radius: 50px;
      font-size: 1rem;
      line-height: 1.5rem;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray4};
    }

    > .count {
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }

  > .list {
    .empty {
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
`
