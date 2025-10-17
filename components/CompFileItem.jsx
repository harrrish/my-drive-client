import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineInfo, MdSave } from "react-icons/md";
import CompFileIcon from "./CompFileIcon";
import { FaDownload } from "react-icons/fa6";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import { useMutation } from "@tanstack/react-query";
import ModalFileDetails from "../modals/ModalFileDetails";
import { calSize } from "../utils/CalculateFileSize";
import { deleteFile, renameFile } from "../utils/FileQueryFunctions";
import {
  ErrorContext,
  ErrorModalContext,
  UpdateContext,
  UserViewContext,
} from "../utils/Contexts";
import { handleFileErrResp } from "../utils/HandleFileError";
const baseURL = import.meta.env.VITE_BASE_URL;

export default function CompFileItem({
  name,
  extension,
  size,
  createdAt,
  updatedAt,
  basename,
  path,
  folderId,
  fetchDirectoryData,
  // tempUpload,
  _id,
}) {
  const navigate = useNavigate();
  const [rename, setRename] = useState(false);
  const [itemName, setItemName] = useState(basename);

  const [fileDetails, setFileDetails] = useState(false);

  const { setUpdate } = useContext(UpdateContext);
  const { setError } = useContext(ErrorContext);
  const { setErrorModal } = useContext(ErrorModalContext);
  const { setUserView } = useContext(UserViewContext);

  //* Rename File
  const { mutate: renameFileFun } = useMutation({
    mutationFn: renameFile,
    onError: (error) => {
      const { message, status } = error;
      handleFileErrResp(
        status,
        message,
        setError,
        setErrorModal,
        navigate,
        setUpdate
      );
    },
    onSuccess: (status) => {
      if (status === 201) {
        setUpdate(`File renamed from "${basename}" to "${itemName}" !`);
      }
      setTimeout(() => {
        setUpdate("");
      }, 3000);
      setRename(false);
      fetchDirectoryData(folderId);
    },
  });

  //* Delete File
  const { mutate: deleteFileFun } = useMutation({
    mutationFn: deleteFile,
    onError: (error) => {
      const { message, status } = error;
      handleFileErrResp(
        status,
        message,
        setError,
        setErrorModal,
        navigate,
        setUpdate
      );
    },
    onSuccess: (status) => {
      setUserView(false);
      if (status === 201) {
        setUpdate(`File "${basename}" deleted !`);
      }
      setTimeout(() => {
        setUpdate("");
      }, 3000);
      setRename(false);
      fetchDirectoryData(folderId);
    },
  });

  return (
    <div>
      <div>
        {/* //* FILE DETAILS MODAL */}
        {fileDetails && (
          <ModalFileDetails
            setFileDetails={setFileDetails}
            name={name}
            size={size}
            extension={extension}
            path={path.dirPath}
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
        className={`group flex justify-between border-2 font-urban font-semibold bg-clr4 text-clr1 hover:border-clr4 hover:text-clr3 hover:bg-clr1 border-clr4 p-2 items-center shadow-sm hover:shadow-md duration-300`}
      >
        <div className={`w-[80%] cursor-pointer items-start`}>
          {rename ? (
            <div className="flex items-center gap-2">
              <span>
                <CompFileIcon ext={extension} />
              </span>
              <input
                className="border-1 w-3/4 px-2 py-1 outline-none text-sm"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => renameFileFun({ _id, itemName, extension })}
                className="text-xl cursor-pointer"
              >
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

        {/* //* SETTING */}
        <div className="flex w-[50%] justify-between">
          {/* //* VIEW FILE DETAILS  */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setFileDetails(true)}
              className="cursor-pointer"
            >
              <MdOutlineInfo />
            </button>
          </div>

          {/* //* DOWNLOAD  */}
          <a
            href={`${baseURL}/file/${_id}?action=download`}
            className="cursor-pointer"
          >
            <FaDownload />
          </a>

          {/* //* RENAME */}
          <button
            onClick={() => setRename((prev) => !prev)}
            className="cursor-pointer"
          >
            {rename ? <GiCancel /> : <MdOutlineDriveFileRenameOutline />}
          </button>

          {/* //* DELETE */}
          <button
            onClick={() => deleteFileFun({ _id })}
            className="cursor-pointer"
          >
            <MdDelete />
          </button>
        </div>
      </div>
    </div>
  );
}
