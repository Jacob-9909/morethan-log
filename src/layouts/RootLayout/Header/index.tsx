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
      <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/70 backdrop-blur-md">
        <div
          data-full-width={fullWidth}
          className="mx-auto flex h-14 w-full max-w-shell items-center justify-between px-4 md:px-6"
        >
          <Logo />
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsPaletteOpen(true)}
              aria-label="게시글 검색"
              className="rounded-lg p-2 text-subtle transition-colors hover:bg-elevated hover:text-fg"
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
