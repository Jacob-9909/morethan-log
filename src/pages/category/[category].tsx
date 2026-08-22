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
          <div className="title">{category}</div>
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

    > .title {
      font-size: 1.25rem;
      line-height: 1.75rem;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.gray12};
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
