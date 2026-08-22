import React, { useEffect, useMemo, useState } from "react"
import styled from "@emotion/styled"

type TocItem = {
  id: string
  text: string
  level: number
}

const HEADING_LEVELS: Record<string, number> = {
  header: 1,
  sub_header: 2,
  sub_sub_header: 3,
}

const getTextContent = (properties: any): string => {
  const title = properties?.title
  if (!Array.isArray(title)) return ""
  return title
    .map((segment) => (typeof segment?.[0] === "string" ? segment[0] : ""))
    .join("")
}

const collectItems = (recordMap: any): TocItem[] => {
  const blocks = recordMap?.block ?? {}
  const pageBlock = Object.values<any>(blocks).find(
    ({ value }) => value?.type === "page"
  )?.value

  const items: TocItem[] = []
  if (!pageBlock) return items

  const walk = (blockId: string) => {
    const block = blocks[blockId]?.value
    if (!block) return
    const level = HEADING_LEVELS[block.type]
    if (level) {
      const text = getTextContent(block.properties)
      if (text) items.push({ id: block.id, text, level })
    }
    block.content?.forEach(walk)
  }

  pageBlock.content?.forEach(walk)
  return items
}

type Props = {
  recordMap: any
}

const TableOfContents: React.FC<Props> = ({ recordMap }) => {
  const items = useMemo(() => collectItems(recordMap), [recordMap])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (!items.length) return
    const onScroll = () => {
      const threshold = 96
      let current = ""
      for (const item of items) {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= threshold) current = item.id
      }
      setActiveId(current)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [items])

  if (items.length === 0) return null

  const scrollTo = (event: React.MouseEvent, id: string) => {
    event.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - 64,
      behavior: "smooth",
    })
  }

  return (
    <>
      <StyledFloating>
        <div className="label">On this page</div>
        <ul>
          {items.map((item) => (
            <li key={item.id} data-level={item.level}>
              <a
                href={`#${item.id}`}
                onClick={(event) => scrollTo(event, item.id)}
                data-active={activeId === item.id}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </StyledFloating>
      <StyledInline>
        <details>
          <summary>목차</summary>
          <ul>
            {items.map((item) => (
              <li key={item.id} data-level={item.level}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => scrollTo(event, item.id)}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </details>
      </StyledInline>
    </>
  )
}

export default TableOfContents

const StyledFloating = styled.nav`
  display: none;

  @media (min-width: 1440px) {
    display: block;
    position: fixed;
    top: 7rem;
    left: calc(50% + 29.5rem);
    width: 15rem;
    max-height: calc(100vh - 10rem);
    overflow-y: auto;
  }

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray11};
    margin-bottom: 0.75rem;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    border-left: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  li {
    &[data-level="2"] a {
      padding-left: 1rem;
    }
    &[data-level="3"] a {
      padding-left: 2rem;
    }
  }

  a {
    display: block;
    padding: 0.25rem 0 0.25rem 0.5rem;
    margin-left: -1px;
    border-left: 1px solid transparent;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;
    transition:
      color 0.15s ease,
      border-color 0.15s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.indigo11};
      border-left-color: ${({ theme }) => theme.colors.indigo9};
      font-weight: 600;
    }
  }
`

const StyledInline = styled.div`
  margin-bottom: 2rem;

  @media (min-width: 1440px) {
    display: none;
  }

  details {
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? theme.colors.gray2 : theme.colors.gray5};
  }

  summary {
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray12};
  }

  ul {
    list-style: none;
    margin: 0.75rem 0 0;
    padding: 0;
  }

  a {
    display: block;
    padding: 0.25rem 0;
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  li[data-level="2"] a {
    padding-left: 1rem;
  }

  li[data-level="3"] a {
    padding-left: 2rem;
  }
`
