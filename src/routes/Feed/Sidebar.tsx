import Link from "next/link"
import Image from "next/image"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { CONFIG } from "site.config"

type Props = {
  totalNotes: number
  monthlyNotes: number
}

const Sidebar: React.FC<Props> = ({ totalNotes, monthlyNotes }) => {
  const tags = useTagsQuery() as Record<string, number>
  const topTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-10">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={CONFIG.profile.image}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                {CONFIG.profile.name}
              </div>
              <div className="text-xs text-zinc-400">
                {CONFIG.profile.role}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {CONFIG.profile.bio}
          </p>
          {CONFIG.profile.github && (
            <a
              href={`https://github.com/${CONFIG.profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block font-mono text-[11px] text-zinc-400 transition-colors hover:text-accent dark:text-zinc-600"
            >
              github.com/{CONFIG.profile.github}
            </a>
          )}
        </div>

        <div>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
            Stats
          </div>
          <dl className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">총 노트</dt>
              <dd className="font-mono text-zinc-800 dark:text-zinc-200">
                {totalNotes}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">이번 달</dt>
              <dd className="font-mono text-zinc-800 dark:text-zinc-200">
                {monthlyNotes}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-zinc-500 dark:text-zinc-400">태그</dt>
              <dd className="font-mono text-zinc-800 dark:text-zinc-200">
                {Object.keys(tags).length}
              </dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-zinc-400 dark:text-zinc-600">
            Top Tags
          </div>
          <ul className="space-y-1">
            {topTags.map(([tag, count]) => (
              <li key={tag}>
                <Link
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="flex items-baseline justify-between text-xs text-zinc-500 transition-colors hover:text-accent dark:text-zinc-400"
                >
                  <span className="truncate">#{tag}</span>
                  <span className="ml-2 font-mono text-[10px] text-zinc-400 dark:text-zinc-600">
                    {count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
