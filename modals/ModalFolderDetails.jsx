import { IoCloseCircle } from "react-icons/io5";
import { calSize } from "../utils/CalculateFileSize";
import { calDateNTime } from "../utils/CalculateDateTime";
import { useContext } from "react";
import { PathContext } from "../utils/Contexts";
import { IoMdArrowDropright } from "react-icons/io";

export default function ModalFolderDetails({
  setFolderDetails,
  name,
  size,
  createdAt,
  updatedAt,
  DirCount,
  fileCount,
}) {
  const { path } = useContext(PathContext);

  return (
    <div className="fixed inset-0 z-50 w-full min-h-[100vh] bg-clr3/70 flex items-center justify-center font-urban font-bold tracking tracking-wider">
      <div className="w-[90%] sm:max-w-2xl bg-clr1 p-4">
        <div className="flex items-center justify-between bg-clr5 p-2 text-clr1">
          <h1 className="text-2xl font-staat tracking-wider">Folder Details</h1>
          <button
            className="cursor-pointer  text-3xl"
            onClick={() => setFolderDetails(false)}
          >
            <IoCloseCircle />
          </button>
        </div>

        <div className="p-2 flex flex-col gap-2">
          <h1>
            Name: <span className="font-medium">{name}</span>
          </h1>
          <h1>
            size: <span className="font-medium">{calSize(size)}</span>
          </h1>
          <div className="flex gap-1">
            <span>path:</span>
            <div className="flex gap-1 items-center whitespace-nowrap font-medium">
              {path.map((p) => (
                <div key={p.id} className="flex items-center gap-1">
                  <button
                    className="text-md truncate max-w-[150px] hover:underline cursor-pointer select-none capitalize"
                    title={
                      p.name.includes("root") ? p.name.split("-")[0] : p.name
                    }
                  >
                    {p.name.includes("root") ? p.name.split("-")[0] : p.name}
                  </button>

                  <span className="text-xl flex-shrink-0">
                    <IoMdArrowDropright />
                  </span>
                </div>
              ))}
            </div>
            <span className="font-medium">{name}</span>
          </div>
          <h1>
            files: <span className="font-medium">{fileCount}</span>
          </h1>
          <h1>
            folders: <span className="font-medium">{DirCount}</span>
          </h1>
          <h1>
            _createdAt:
            <span className="font-medium"> {calDateNTime(createdAt)}</span>
          </h1>
          <h1>
            _updatedAt:
            <span className="font-medium"> {calDateNTime(updatedAt)}</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
