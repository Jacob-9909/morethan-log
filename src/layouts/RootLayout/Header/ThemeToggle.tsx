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
      className="flex items-center justify-center rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
    >
      {scheme === "light" ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  )
}

export default ThemeToggle
