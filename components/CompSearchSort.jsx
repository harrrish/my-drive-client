import { FaSearch } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

export default function CompSearchSort() {
  return (
    <div className="flex items-center justify-center gap-2 w-[95%] sm:max-w-3xl mx-auto text-clr3 duration-300">
      {/* //* SEARCH SECTION */}
      <div
        className="hover:cursor-pointer duration-300 bg-clr1 shadow-md hover:shadow-2xl w-1/2 flex items-center justify-center rounded-sm h-10 font-bebas tracking-wider p-1"
        title="Create folder"
      >
        <input
          type="text"
          className="text-clr3 w-full text-center text-lg outline-none h-full"
          placeholder="Search for file/folder..."
        />
        <button
          className="text-lg hover:cursor-pointer duration-300 flex items-center justify-center h-full"
          title="Search file"
        >
          <FaSearch />
        </button>
      </div>

      {/* //* TRASH BIN */}
      <button
        className="hover:cursor-pointer duration-300 bg-clr1 shadow-md hover:shadow-2xl w-1/2 flex items-center justify-center gap-2 rounded-sm h-10 hover:bg-red-600 hover:text-clr1 font-bebas tracking-wider"
        title="Bin"
      >
        <span className="text-xl">
          <MdDelete />
        </span>
        <span className="text-lg">TRASH BIN</span>
      </button>
    </div>
  );
}
