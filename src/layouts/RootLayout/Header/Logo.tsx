import Link from "next/link"
import { CONFIG } from "site.config"

const Logo = () => {
  return (
    <Link
      href="/"
      aria-label={CONFIG.blog.title}
      className="text-[15px] font-bold tracking-tight text-zinc-900 transition-colors hover:text-accent dark:text-zinc-100"
    >
      {CONFIG.blog.title}
    </Link>
  )
}

export default Logo
