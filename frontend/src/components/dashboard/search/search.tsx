"use client";

import { MdSearch } from "react-icons/md";

const Search = ({ placeholder }: { placeholder: any }) => {
  return (
    <div className="flex items-center gap-2 bg-[#2e374a] rounded-md p-2">
      <MdSearch />
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent border-none text-white outline-none"
        onChange={() => {}}
      />
    </div>
  );
};

export default Search;
