import React, { InputHTMLAttributes } from "react"

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: React.FC<Props> = ({ ...props }) => {
  return (
    <input
      type="text"
      placeholder="검색..."
      {...props}
      className="w-full rounded-md border border-zinc-200 bg-transparent px-3 py-2 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-accent focus:outline-none dark:border-zinc-800 dark:text-zinc-300 dark:placeholder:text-zinc-600"
    />
  )
}

export default SearchInput
