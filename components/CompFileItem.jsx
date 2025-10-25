import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineInfo, MdSave } from "react-icons/md";
import CompFileIcon from "./CompFileIcon";
import { FaDownload } from "react-icons/fa6";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import ModalFileDetails from "../modals/ModalFileDetails";
import { calSize } from "../utils/CalculateFileSize";
import {
  ErrorContext,
  ErrorModalContext,
  UpdateContext,
  UserSettingViewContext,
} from "../utils/Contexts";
import { axiosWithCreds } from "../utils/AxiosInstance";
import axios from "axios";
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
  // tempUpload,
}) {
  const navigate = useNavigate();
  const [rename, setRename] = useState(false);
  const [itemName, setItemName] = useState(basename);

  const [fileDetails, setFileDetails] = useState(false);

  const { setUpdate } = useContext(UpdateContext);
  const { setError } = useContext(ErrorContext);
  const { setErrorModal } = useContext(ErrorModalContext);

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
        console.log(error);
        const errMsg = axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to rename file"
          : "Something went wrong";
        setError(errMsg);
        setTimeout(() => setError(""), 3000);
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
      console.log(error);
      const errMsg = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to rename file"
        : "Something went wrong";
      setError(errMsg);
      setTimeout(() => setError(""), 3000);
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
        className={`group flex justify-between border-2 font-emb font-bold bg-clr4 text-clr1 hover:border-clr4 hover:text-clr3 hover:bg-clr1 border-clr4 p-2 items-center shadow-sm hover:shadow-md duration-300`}
      >
        <div className={`w-[80%] cursor-pointer items-start`}>
          {rename ? (
            <div className="flex items-center gap-2">
              <span>
                <CompFileIcon ext={extension} />
              </span>
              <input
                className="border-1 w-3/4 px-2 py-1 outline-none "
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
