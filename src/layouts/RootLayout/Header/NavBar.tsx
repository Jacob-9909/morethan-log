import Link from "next/link"

const NavBar: React.FC = () => {
  const links = [{ id: 1, name: "About", to: "/about" }]
  return (
    <nav className="flex-shrink-0">
      <ul className="flex list-none">
        {links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.to}
              className="ml-0.5 rounded-lg px-2.5 py-1.5 text-sm text-subtle transition-colors hover:bg-elevated hover:text-fg"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavBar
