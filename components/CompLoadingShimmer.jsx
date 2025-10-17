import React from "react";
import { FaFolder } from "react-icons/fa6";
import { LuFiles } from "react-icons/lu";

export default function CompLoadingShimmer() {
  return (
    <div className="w-[95%] sm:max-w-3xl mx-auto">
      {/* //* DUMMY FOLDERS AND FILES */}
      <div className="flex flex-col gap-2 animate-loading">
        <div className="w-[95%] mx-auto shadow-2xl flex flex-col gap-2">
          <div className="bg-gray-400 p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg">
              <FaFolder />
              ...
            </h1>
          </div>
          <div className="bg-gray-400 p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <FaFolder />
              ...
            </h1>
          </div>
          <div className="bg-gray-400 p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <FaFolder />
              ...
            </h1>
          </div>
        </div>
        <div className="w-[95%] mx-auto shadow-2xl flex flex-col gap-2">
          <div className="bg-gray-500 p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <LuFiles />
              ...
            </h1>
          </div>
          <div className="bg-gray-500 p-1 px-4 shadow-black shadow-sm">
            <h1 className="flex items-center gap-1 text-lg shadow-amber-950">
              <LuFiles />
              ...
            </h1>
          </div>
          <div className="bg-gray-500 p-1 px-4 shadow-black shadow-sm">
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
