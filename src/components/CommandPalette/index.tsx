import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { FiSearch } from "react-icons/fi"
import usePostsQuery from "src/hooks/usePostsQuery"
import { zIndexes } from "src/styles/zIndexes"
import { TPost } from "src/types"

type Props = {
  isOpen: boolean
  onChange: (open: boolean) => void
}

const MAX_RESULTS = 8

const CommandPalette: React.FC<Props> = ({ isOpen, onChange }) => {
  const router = useRouter()
  const posts = usePostsQuery()
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  const close = useCallback(() => onChange(false), [onChange])

  const results = useMemo(() => {
    const sorted = [...posts].sort((a, b) => {
      const dateA = new Date(a.date.start_date).getTime()
      const dateB = new Date(b.date.start_date).getTime()
      return dateB - dateA
    })
    if (!query.trim()) return sorted.slice(0, MAX_RESULTS)
    const q = query.toLowerCase()
    return sorted
      .filter((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const searchContent = `${post.title}${post.summary ?? ""}${tagContent}`
        return searchContent.toLowerCase().includes(q)
      })
      .slice(0, MAX_RESULTS)
  }, [posts, query])

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        onChange(!isOpen)
        return
      }
      if (!isOpen) return
      if (e.key === "Escape") {
        e.preventDefault()
        onChange(false)
      }
    }
    window.addEventListener("keydown", handleKeydown)
    return () => window.removeEventListener("keydown", handleKeydown)
  }, [isOpen, onChange])

  useEffect(() => {
    if (isOpen) {
      setQuery("")
      setActiveIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, results])

  const navigate = useCallback(
    (post: TPost) => {
      onChange(false)
      router.push(`/${post.slug}`)
    },
    [onChange, router]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      navigate(results[activeIndex])
    }
  }

  if (!isOpen) return null

  return (
    <StyledOverlay onClick={close}>
      <StyledModal onClick={(e) => e.stopPropagation()}>
        <div className="input-row" onKeyDown={handleKeyDown}>
          <FiSearch className="icon" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="게시글 검색..."
          />
          <kbd>⌘K</kbd>
        </div>
        <div className="results">
          {results.length === 0 ? (
            <div className="empty">검색 결과가 없습니다</div>
          ) : (
            results.map((post, index) => (
              <div
                key={post.id}
                ref={(el) => (itemRefs.current[index] = el)}
                data-active={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => navigate(post)}
                className="item"
              >
                <span className="title">{post.title}</span>
                <span className="tags">
                  {post.tags &&
                    post.tags.map((tag: string) => (
                      <span key={tag} className="chip">
                        {tag}
                      </span>
                    ))}
                </span>
              </div>
            ))
          )}
        </div>
      </StyledModal>
    </StyledOverlay>
  )
}

export default CommandPalette

const StyledOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${zIndexes.dropdownMenu};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
`

const StyledModal = styled.div`
  margin-top: 15vh;
  width: min(560px, calc(100% - 2rem));
  border-radius: 1rem;
  overflow: hidden;
  background-color: rgb(var(--surface));
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);

  > .input-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    border-bottom: 1px solid rgb(var(--line));

    > .icon {
      color: rgb(var(--subtle));
    }

    > input {
      flex: 1;
      padding-top: 0.875rem;
      padding-bottom: 0.875rem;
      border: none;
      outline-style: none;
      font-size: 1rem;
      background-color: transparent;
      color: rgb(var(--fg));

      ::placeholder {
        color: rgb(var(--subtle));
      }
    }

    > kbd {
      padding: 0.125rem 0.5rem;
      border-radius: 0.375rem;
      font-family: inherit;
      font-size: 0.75rem;
      line-height: 1.25rem;
      color: rgb(var(--subtle));
      background-color: rgb(var(--elevated));
    }
  }

  > .results {
    max-height: 50vh;
    overflow-y: auto;

    > .empty {
      padding: 2rem;
      text-align: center;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: rgb(var(--subtle));
    }

    > .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      padding: 0.625rem 1rem;
      cursor: pointer;

      &[data-active="true"] {
        background-color: rgb(var(--elevated));
      }

      > .title {
        flex-shrink: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: rgb(var(--fg));
      }

      > .tags {
        display: flex;
        gap: 0.25rem;
        flex-shrink: 0;

        > .chip {
          padding-top: 0.125rem;
          padding-bottom: 0.125rem;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          border-radius: 50px;
          font-size: 0.75rem;
          line-height: 1rem;
          white-space: nowrap;
          color: rgb(var(--subtle));
          background-color: rgb(var(--elevated));
        }
      }
    }
  }
`
