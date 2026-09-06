import { useRouter } from "next/router"
import React from "react"

type Props = {
  children: string
}

const Tag: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push(`/tag/${encodeURIComponent(children)}`)}
      className="rounded-full border border-line bg-elevated/60 px-2.5 py-1 font-mono text-2xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
    >
      #{children}
    </button>
  )
}

export default Tag
