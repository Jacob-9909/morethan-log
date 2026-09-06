import React, { InputHTMLAttributes } from "react"
import { FiSearch } from "react-icons/fi"

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: React.FC<Props> = ({ ...props }) => {
  return (
    <div className="group flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 py-2.5 transition-colors focus-within:border-accent/60">
      <FiSearch
        size={15}
        className="shrink-0 text-subtle transition-colors group-focus-within:text-accent"
      />
      <input
        type="text"
        placeholder="검색..."
        aria-label="노트 검색"
        {...props}
        className="w-full bg-transparent text-sm text-fg placeholder:text-subtle"
      />
    </div>
  )
}

export default SearchInput
