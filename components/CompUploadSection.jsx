import { FaFileUpload } from "react-icons/fa";
import { TiFolderAdd } from "react-icons/ti";

export default function CompUploadSection({
  setCreateFolder,
  handleFileSelect,
}) {
  return (
    <div className="flex items-center justify-center gap-2 w-[95%] sm:max-w-3xl mx-auto text-clr3 duration-300">
      {/* //* CREATE FOLDER */}
      <button
        className="hover:cursor-pointer duration-300 bg-clr1 shadow-md hover:shadow-2xl w-1/2 flex items-center justify-center gap-2   rounded-sm h-10 hover:bg-green-600 hover:text-clr1 font-bebas tracking-wider"
        title="Create folder"
        onClick={() => setCreateFolder(true)}
      >
        <span className="text-2xl">
          <TiFolderAdd />
        </span>
        <span className="text-xl">Create Folder</span>
      </button>

      {/* //* FILE UPLOAD */}
      <label
        htmlFor="fileUpload"
        className="hover:cursor-pointer duration-300 bg-clr1 shadow-md hover:shadow-2xl w-1/2 flex items-center justify-center gap-2   rounded-sm h-10 hover:bg-sky-500 hover:text-clr1 font-bebas tracking-wider"
        title="Upload file"
      >
        <FaFileUpload className="" title="Upload file" />
        <input
          type="file"
          onChange={(event) => handleFileSelect(event)}
          className="hidden"
          id="fileUpload"
        />
        <span className="text-xl">Upload File</span>
      </label>
    </div>
  );
}
