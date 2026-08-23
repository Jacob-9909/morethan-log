import NavBar from "./NavBar"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import CommandPalette from "src/components/CommandPalette"
import { FiSearch } from "react-icons/fi"
import React, { useState } from "react"

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div
          data-full-width={fullWidth}
          className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4 md:px-6 lg:max-w-4xl"
        >
          <Logo />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPaletteOpen(true)}
              aria-label="게시글 검색"
              className="rounded-md p-2 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <FiSearch size={16} />
            </button>
            <ThemeToggle />
            <NavBar />
          </div>
        </div>
      </header>
      <CommandPalette isOpen={isPaletteOpen} onChange={setIsPaletteOpen} />
    </>
  )
}

export default Header
