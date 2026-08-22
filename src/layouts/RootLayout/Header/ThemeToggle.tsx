import styled from "@emotion/styled"
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
    <StyledButton onClick={handleClick} aria-label="Toggle color scheme">
      {scheme === "light" ? <FiSun size={16} /> : <FiMoon size={16} />}
    </StyledButton>
  )
}

export default ThemeToggle

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.375rem;
  border-radius: 0.375rem;
  color: ${({ theme }) => theme.colors.gray12};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray5};
  }
`
