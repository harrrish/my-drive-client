import { IoCloseCircle } from "react-icons/io5";
import { calSize } from "../utils/CalculateFileSize";
import { calDateNTime } from "../utils/CalculateDateTime";
import { IoMdArrowDropright } from "react-icons/io";
import { useContext } from "react";
import { DirectoryContext } from "../utils/Contexts";

export default function ModalFolderDetails({
  setFolderDetails,
  name,
  size,
  createdAt,
  updatedAt,
  DirCount,
  fileCount,
}) {
  const { directoryDetails } = useContext(DirectoryContext);

  return (
    <div className="fixed inset-0 z-50 w-full min-h-[100vh] flex items-center justify-center   tracking ">
      <div className="w-[90%] sm:max-w-2xl p-4">
        <div className="flex items-center justify-betweenp-2 ">
          <h1 className="">Folder Details</h1>
          <button
            className="cursor-pointer"
            onClick={() => setFolderDetails(false)}
          >
            <IoCloseCircle />
          </button>
        </div>

        <div className="p-2 flex flex-col gap-2">
          <h1>
            Name: <span className=" italic">{name}</span>
          </h1>
          <h1>
            size: <span className=" italic">{calSize(size)}</span>
          </h1>
          <div className="flex gap-1">
            <span>path:</span>
            <div className="flex gap-1 items-center whitespace-nowrap  italic">
              {directoryDetails.path.map((p) => (
                <div key={p.id} className="flex items-center">
                  <button
                    className=" truncate max-w-[150px] hover:underline cursor-pointer select-none capitalize"
                    title={
                      p.name.includes("root") ? p.name.split("-")[0] : p.name
                    }
                  >
                    {p.name.includes("root") ? p.name.split("-")[0] : p.name}
                  </button>

                  <span className="flex-shrink-0">
                    <IoMdArrowDropright />
                  </span>
                </div>
              ))}
            </div>
            <span className=" italic capitalize">{name}</span>
          </div>
          <h1>
            files: <span className=" italic">{fileCount}</span>
          </h1>
          <h1>
            folders: <span className=" italic">{DirCount}</span>
          </h1>
          <h1>
            _createdAt:
            <span className=" italic"> {calDateNTime(createdAt)}</span>
          </h1>
          <h1>
            _updatedAt:
            <span className=" italic"> {calDateNTime(updatedAt)}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
