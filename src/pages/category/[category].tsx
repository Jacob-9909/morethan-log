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
  category?: string
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
    const categories = getAllSelectItemsFromPosts("category", posts)

    return {
      paths: Object.keys(categories).map((category) => ({
        params: { category: encodeURIComponent(category) },
      })),
      fallback: "blocking",
    }
  } catch (error) {
    console.error("[category] getStaticPaths failed:", error)
    return {
      paths: [],
      fallback: "blocking",
    }
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  try {
    const queryClient = createQueryClient()
    const category = decodeParam(context.params?.category)

    if (!category) {
      return {
        notFound: true,
        revalidate: CONFIG.revalidateTime,
      }
    }

    const feedPosts = filterPosts(await getPosts())
    const normalizedCategory = category.toLowerCase()
    const matchedPosts = feedPosts.filter((post) =>
      post.category?.some(
        (postCategory) =>
          postCategory.toLowerCase() === normalizedCategory
      )
    )

    await queryClient.prefetchQuery(queryKey.posts(), () => matchedPosts)

    return {
      props: {
        category,
        posts: matchedPosts,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: CONFIG.revalidateTime,
    }
  } catch (error) {
    console.error("[category] getStaticProps failed:", error)
    return {
      notFound: true,
      revalidate: CONFIG.revalidateTime,
    }
  }
}

const CategoryArchivePage: NextPageWithLayout<Props> = ({
  category,
  posts,
}) => {
  const archivePosts = posts ?? []

  const meta = {
    title: `${category ?? "Category"} - ${CONFIG.blog.title}`,
    description: CONFIG.blog.description,
    type: "website",
    url: `${CONFIG.link}/category/${encodeURIComponent(category ?? "")}`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <StyledWrapper>
        <div className="header">
          <div>
            <p className="eyebrow">Category</p>
            <h1 className="title">{category}</h1>
          </div>
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

CategoryArchivePage.getLayout = (page) => {
  return <>{page}</>
}

export default CategoryArchivePage

const StyledWrapper = styled.div`
  padding: 3rem 0 4rem;

  > .header {
    display: flex;
    padding-bottom: 1rem;
    margin-bottom: 0.5rem;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 1px solid rgb(var(--line));

    .title {
      margin-top: 0.5rem;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.019em;
      color: rgb(var(--fg));
    }

    > .count {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.75rem;
      color: rgb(var(--subtle));
    }
  }

  > .list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    margin-top: 1.5rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  > .list .empty {
    grid-column: 1 / -1;
    padding: 2.5rem 0;
    font-size: 0.8125rem;
    color: rgb(var(--subtle));
  }
`
