import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineInfo, MdSave } from "react-icons/md";
import CompFileIcon from "./FileIcon";
import { FaDownload } from "react-icons/fa6";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import ModalFileDetails from "../modals/ModalFileDetails";
import { calSize } from "../utils/CalculateFileSize";
import { ErrorContext, UpdateContext } from "../utils/Contexts";
import { axiosError, axiosWithCreds } from "../utils/AxiosInstance";
import { IoMdShare } from "react-icons/io";
const baseURL = import.meta.env.VITE_BASE_URL;

export default function CompFileItem({
  _id,
  name,
  extension,
  size,
  createdAt,
  updatedAt,
  parentFID,
  basename,
  handleDirectoryDetails,
  handleUserStorageDetails,
}) {
  const navigate = useNavigate();
  const [rename, setRename] = useState(false);
  const [itemName, setItemName] = useState(basename);

  const [fileDetails, setFileDetails] = useState(false);

  const { setUpdate } = useContext(UpdateContext);
  const { setError } = useContext(ErrorContext);

  //* ==========>Rename File
  async function handleFileRename() {
    if (!itemName.trim()) {
      setError("Please provide a valid file name");
      setTimeout(() => setError(""), 3000);
    } else {
      try {
        const { data, status } = await axiosWithCreds.patch(
          `/file/${_id || ""}`,
          {
            newName: `${itemName}${extension}`,
            basename: itemName,
          }
        );
        console.log(data.message);
        if (status === 201) {
          handleDirectoryDetails(parentFID);
          handleUserStorageDetails();
          setRename(false);
          setUpdate(data.message);
          setTimeout(() => setUpdate(""), 3000);
        }
      } catch (error) {
        const msg = "Failed to rename file";
        axiosError(error, navigate, setError, msg);
      }
    }
  }

  async function handleFileDelete() {
    try {
      const { data, status } = await axiosWithCreds.delete(
        `/file/${_id || ""}`
      );
      console.log(data.message);
      if (status === 201) {
        handleDirectoryDetails(parentFID);
        setRename(false);
        setUpdate(data.message);
        setTimeout(() => setUpdate(""), 3000);
      }
    } catch (error) {
      const msg = "Failed to delete file";
      axiosError(error, navigate, setError, msg);
    }
  }

  return (
    <div>
      <div>
        {/* //* ==========>FILE DETAILS MODAL */}
        {fileDetails && (
          <ModalFileDetails
            setFileDetails={setFileDetails}
            name={name}
            size={size}
            extension={extension}
            createdAt={createdAt}
            updatedAt={updatedAt}
          />
        )}
      </div>
      <div
        key={_id}
        title={`Name: ${name}\nSize: ${calSize(size)}\nCreated at: ${new Date(
          createdAt
        ).toLocaleString()}`}
        className={`group flex justify-between border-1 p-2 items-center shadow-sm hover:shadow-md duration-300 bg-clrLightBlue border-clrLightBlue text-clrGray tracking-wider hover:bg-transparent hover:text-black rounded-sm`}
      >
        <div className={`w-[80%] cursor-pointer items-start`}>
          {rename ? (
            <div className="flex items-center gap-2">
              <span>
                <CompFileIcon ext={extension} />
              </span>
              <input
                className="border-2 w-3/4 px-2 py-1 outline-none "
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                autoFocus
              />
              <button onClick={handleFileRename} className=" cursor-pointer">
                <MdSave />
              </button>
            </div>
          ) : (
            <Link
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault();
                window.open(
                  `${baseURL}/file/${_id}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="truncate flex items-center gap-2"
            >
              <span>
                <CompFileIcon ext={extension} />
              </span>
              <span className="truncate w-[80%]">{basename}</span>
            </Link>
          )}
        </div>

        {/* //* ==========>SETTING */}
        <div className="flex w-[50%] justify-between">
          {/* //* ==========>VIEW FILE DETAILS  */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setFileDetails(true)}
              className="cursor-pointer"
            >
              <MdOutlineInfo />
            </button>
          </div>

          {/* //* ==========>SHARE  */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => console.log(`Share: ${_id} | ${name}`)}
              className="cursor-pointer"
            >
              <IoMdShare />
            </button>
          </div>

          {/* //* ==========>DOWNLOAD  */}
          <a
            href={`${baseURL}/file/${_id}?action=download`}
            className="cursor-pointer"
          >
            <FaDownload />
          </a>

          {/* //* ==========>RENAME */}
          <button
            onClick={() => setRename((prev) => !prev)}
            className="cursor-pointer"
          >
            {rename ? <GiCancel /> : <MdOutlineDriveFileRenameOutline />}
          </button>

          {/* //* ==========>DELETE */}
          <button onClick={handleFileDelete} className="cursor-pointer">
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
}
