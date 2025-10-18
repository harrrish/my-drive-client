import React from "react";
import { FaSortAmountDown } from "react-icons/fa";
import { FaFolder } from "react-icons/fa6";
import { LuFiles } from "react-icons/lu";

export default function CompLoadingShimmer() {
  return (
    <div className="w-[95%] sm:max-w-3xl mx-auto flex flex-col gap-2">
      <div className="font-bebas tracking-wider flex justify-between items-center rounded-sm w-full gap-2">
        <div className="flex items-center justify-between w-1/2 mx-auto bg-clr1 gap-2 p-2 text-clr3 shadow-md hover:shadow-xl duration-300 h-10 rounded-sm font-bebas">
          {/* //* SORT */}
          <div className="flex justify-start items-center w-full gap-2">
            <label htmlFor="sort" className="flex items-center gap-1 w-full">
              <FaSortAmountDown className="text-lg" />
              <select
                id="sort"
                name="sort"
                className="text-center outline-none cursor-pointer w-full h-full tracking-widest"
              >
                <option value="size_inc">Size (Inc)</option>
                <option value="size_dec">Size (Dec)</option>
                <option value="name_asc">Name (Asc)</option>
                <option value="name_desc">Name (Desc)</option>
                <option value="last_modified_asc">Last Modified (Asc)</option>
                <option value="last_modified_desc">Last Modified (Desc)</option>
              </select>
            </label>
          </div>
        </div>

        {/* //* FILES AND FOLDERS */}
        <div className="w-1/2 bg-clr1 flex justify-between items-center p-2 rounded-sm h-10">
          <h1 className="flex items-center gap-1 text-clr5">
            <span className="text-lg">
              <FaFolder />
            </span>
            <span>Folders: N/A </span>
          </h1>
          <h1 className="flex items-center gap-1 text-clr4">
            <span className="text-lg">
              <LuFiles />
            </span>
            Files: N/A
          </h1>
        </div>
      </div>
      {/* //* DUMMY FOLDERS AND FILES */}
      <div className="flex flex-col gap-2 animate-loading">
        <div className="w-[95%] mx-auto shadow-2xl flex flex-col gap-2">
          <div className="bg-clr5 text-white p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg">
              <FaFolder />
              ...
            </h1>
          </div>
          <div className="bg-clr5 text-white p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <FaFolder />
              ...
            </h1>
          </div>
          <div className="bg-clr5 text-white p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <FaFolder />
              ...
            </h1>
          </div>
        </div>
        <div className="w-[95%] mx-auto shadow-2xl flex flex-col gap-2">
          <div className="bg-clr6 text-white p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <LuFiles />
              ...
            </h1>
          </div>
          <div className="bg-clr6 text-white p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <LuFiles />
              ...
            </h1>
          </div>
          <div className="bg-clr6 text-white p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <LuFiles />
              ...
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
