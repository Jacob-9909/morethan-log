import { useRouter } from "next/router"
import React from "react"

type Props = {}

const Footer: React.FC<Props> = () => {
  const router = useRouter()
  return (
    <div className="flex justify-between py-6 text-sm font-medium text-muted">
      <button
        onClick={() => router.push("/")}
        className="rounded-lg px-2 py-1 transition-colors hover:text-accent"
      >
        ← Back
      </button>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="rounded-lg px-2 py-1 transition-colors hover:text-accent"
      >
        ↑ Top
      </button>
    </div>
  )
}

export default Footer
