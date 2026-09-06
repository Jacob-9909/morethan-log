import Link from "next/link"
import { CONFIG } from "site.config"

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label={CONFIG.blog.title}
      className="group flex items-center gap-2 text-base font-bold tracking-tight text-fg"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-150" />
      <span className="transition-colors group-hover:text-accent">
        {CONFIG.blog.title}
      </span>
    </Link>
  )
}

export default Logo
