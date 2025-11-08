import { calSize } from "../utils/CalculateFileSize";
import { MdCancel } from "react-icons/md";

export default function UploadFile({ id, name, size, progress }) {
  return (
    <div
      key={id}
      className="border-2 flex flex-col gap-8 p-2 rounded-sm w-[95%] mx-auto"
    >
      <div className="flex justify-between w-full">
        <h1 className="w-1/3 truncate">{name}</h1>
        <h1>{calSize(size)}</h1>
        <h1>Upload progress: {progress}%</h1>
        <button className="cursor-pointer hover:scale-150 duration-200">
          <MdCancel />
        </button>
      </div>
    </div>
  );
}
