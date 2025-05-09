import { CiSearch } from "react-icons/ci"

const SearchInput = () => {
  return (
    <div className="flex items-center border border-gray-border rounded-4 grow max-w-[605px] justify-between px-4 py-2">
      <input type="search" className="font-bold text-xs" placeholder="Search" name="" id="" />
      <CiSearch />
    </div>
  )
}

export default SearchInput