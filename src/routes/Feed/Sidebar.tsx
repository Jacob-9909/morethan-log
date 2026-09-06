import Link from "next/link"
import Image from "next/image"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { CONFIG } from "site.config"

type Props = {
  totalNotes: number
  monthlyNotes: number
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-baseline justify-between">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="font-mono text-xs text-fg">{value}</dd>
  </div>
)

const Sidebar: React.FC<Props> = ({ totalNotes, monthlyNotes }) => {
  const tags = useTagsQuery() as Record<string, number>
  const topTags = Object.entries(tags)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 space-y-9">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={CONFIG.profile.image}
              alt="profile"
              width={40}
              height={40}
              className="rounded-full border border-line bg-elevated"
            />
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-fg">
                {CONFIG.profile.name}
              </div>
              <div className="truncate text-xs text-subtle">
                {CONFIG.profile.role}
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted">
            {CONFIG.profile.bio}
          </p>
          {CONFIG.profile.github && (
            <a
              href={`https://github.com/${CONFIG.profile.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-block font-mono text-2xs text-subtle transition-colors hover:text-accent"
            >
              github.com/{CONFIG.profile.github}
            </a>
          )}
        </div>

        <div>
          <div className="eyebrow mb-2.5">Stats</div>
          <dl className="space-y-2">
            <Stat label="총 노트" value={totalNotes} />
            <Stat label="이번 달" value={monthlyNotes} />
            <Stat label="태그" value={Object.keys(tags).length} />
          </dl>
        </div>

        <div>
          <div className="eyebrow mb-2.5">Top Tags</div>
          <ul className="list-none space-y-1.5">
            {topTags.map(([tag, count]) => (
              <li key={tag}>
                <Link
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="flex items-baseline justify-between gap-2 text-xs text-muted transition-colors hover:text-accent"
                >
                  <span className="truncate">#{tag}</span>
                  <span className="font-mono text-2xs text-subtle">{count}</span>
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
