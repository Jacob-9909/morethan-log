import Link from "next/link"
import { useRouter } from "next/router"

const links = [
  { id: 1, name: "Notes", to: "/" },
  { id: 2, name: "About", to: "/about" },
]

const NavBar: React.FC = () => {
  const { asPath } = useRouter()
  const path = asPath.split(/[?#]/)[0]

  return (
    <nav className="flex-shrink-0">
      <ul className="flex list-none">
        {links.map((link) => {
          const active = path === link.to
          return (
            <li key={link.id}>
              <Link
                href={link.to}
                aria-current={active ? "page" : undefined}
                className={`ml-0.5 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-elevated hover:text-fg ${
                  active ? "font-medium text-fg" : "text-subtle"
                }`}
              >
                {link.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavBar
