import { FiMoon, FiSun } from "react-icons/fi"
import React from "react"
import useScheme from "src/hooks/useScheme"

type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const [scheme, setScheme] = useScheme()

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <button
      onClick={handleClick}
      aria-label="Toggle color scheme"
      className="flex items-center justify-center rounded-lg p-2 text-subtle transition-colors hover:bg-elevated hover:text-fg"
    >
      {scheme === "light" ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  )
}

export default ThemeToggle
