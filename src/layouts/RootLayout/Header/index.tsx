import NavBar from "./NavBar"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import CommandPalette from "src/components/CommandPalette"
import styled from "@emotion/styled"
import { FiSearch } from "react-icons/fi"
import React, { useState } from "react"
import { zIndexes } from "src/styles/zIndexes"

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false)

  return (
    <>
      <StyledWrapper>
        <div data-full-width={fullWidth} className="container">
          <Logo />
          <div className="nav">
            <StyledSearchButton
              onClick={() => setIsPaletteOpen(true)}
              aria-label="게시글 검색"
            >
              <FiSearch />
            </StyledSearchButton>
            <ThemeToggle />
            <NavBar />
          </div>
        </div>
      </StyledWrapper>
      <CommandPalette isOpen={isPaletteOpen} onChange={setIsPaletteOpen} />
    </>
  )
}

export default Header

const StyledWrapper = styled.div`
  z-index: ${zIndexes.header};
  position: sticky;
  top: 0;
  background-color: ${({ theme }) => theme.colors.gray2};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

  .container {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1120px;
    height: 3rem;
    margin: 0 auto;
    &[data-full-width="true"] {
      @media (min-width: 768px) {
        padding-left: 6rem;
        padding-right: 6rem;
      }
    }
    .nav {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  }
`

const StyledSearchButton = styled.button`
  cursor: pointer;
  border: none;
  background-color: transparent;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray11};

  :hover {
    color: ${({ theme }) => theme.colors.gray12};
  }
`
