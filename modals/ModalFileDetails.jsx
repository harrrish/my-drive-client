import { IoCloseCircle } from "react-icons/io5";
import { calSize } from "../utils/CalculateFileSize";
import { calDateNTime } from "../utils/CalculateDateTime";
import { IoMdArrowDropright } from "react-icons/io";
import { useContext } from "react";
import { DirectoryContext } from "../utils/Contexts";
import { RiFileInfoFill } from "react-icons/ri";

export default function ModalFileDetails({
  name,
  size,
  extension,
  createdAt,
  updatedAt,
  setFileDetails,
}) {
  const { directoryDetails } = useContext(DirectoryContext);

  return (
    <div className="fixed inset-0 z-50 w-full min-h-[100vh] bg-black/90 flex items-center justify-center ">
      <div className="w-[90%] sm:max-w-2xl p-4 bg-white">
        <div className="flex items-center justify-between p-2 bg-clrDarkBlue text-white">
          <h1 className="flex items-center gap-1">
            <span>
              <RiFileInfoFill />
            </span>
            File Details
          </h1>
          <button
            className="cursor-pointer"
            onClick={() => setFileDetails(false)}
          >
            <IoCloseCircle />
          </button>
        </div>

        <div className="p-2 flex flex-col gap-2  ">
          <h1>
            Name: <span className=" italic">{name}</span>
          </h1>
          <h1>
            size: <span className=" italic">{calSize(size)}</span>
          </h1>
          <h1>
            type: <span className=" uppercase">{extension.substr(1)}</span>
          </h1>
          <div className="flex gap-1">
            <span>path:</span>
            <div className="flex items-center whitespace-nowrap  italic">
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

                  <span className=" flex-shrink-0">
                    <IoMdArrowDropright />
                  </span>
                </div>
              ))}
            </div>
            <span className=" italic">{name}</span>
          </div>
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
