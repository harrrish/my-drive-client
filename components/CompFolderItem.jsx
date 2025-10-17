import { useContext, useEffect, useState } from "react";
import { MdSave } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineInfo } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { deleteFolder, renameFolder } from "../utils/DirQueryFunctions";
import ModalFolderDetails from "../modals/ModalFolderDetails";
import { calSize } from "../utils/CalculateFileSize";
import {
  ErrorContext,
  ErrorModalContext,
  UpdateContext,
  UserViewContext,
} from "../utils/Contexts";
import { handleErrResp } from "../utils/HandleDirError";

export default function CompFolderItem({
  _id,
  name,
  folderId,
  size,
  fetchDirectoryData,
  path,
  createdAt,
  updatedAt,
  DirCount,
  fileCount,
}) {
  // console.log(DirCount, fileCount);
  const navigate = useNavigate();
  const [rename, setRename] = useState(false);
  const [directoryName, setDirectoryName] = useState(name);
  const [folderDetails, setFolderDetails] = useState(false);

  const { setErrorModal } = useContext(ErrorModalContext);
  const { setUpdate } = useContext(UpdateContext);
  const { setError } = useContext(ErrorContext);

  const { setUserView } = useContext(UserViewContext);

  //* RENAME FOLDER
  const {
    mutate: renameFun,
    error: renameError,
    reset: renameReset,
  } = useMutation({
    mutationFn: renameFolder,
    onError: (error) => {
      const { status, message } = error;
      console.log(message);
      handleErrResp(
        status,
        message,
        setError,
        setErrorModal,
        navigate,
        setUpdate
      );
    },
    onSuccess: ({ data, status }) => {
      console.log(data);
      if (status === 201) {
        setError("");
        setUpdate(`Folder "${name}" renamed to "${directoryName}" !`);
        setTimeout(() => {
          setUpdate("");
        }, 3000);
        setRename(false);
        fetchDirectoryData(folderId);
      }
    },
  });

  //* DELETE FOLDER
  const { mutate: deleteFun } = useMutation({
    mutationFn: deleteFolder,
    onError: (error) => {
      const { status, message } = error;
      handleErrResp(
        status,
        message,
        setError,
        setErrorModal,
        navigate,
        setUpdate
      );
    },
    onSuccess: ({ data, status }) => {
      console.log(data.message);
      setUserView(false);
      // console.log(data);
      if (status === 201) {
        setError("");
        setUpdate(`Folder "${name}" deleted !`);
        fetchDirectoryData(folderId);
        setTimeout(() => {
          setUpdate("");
        }, 3000);
      }
    },
  });

  useEffect(() => {
    if (renameError) setTimeout(() => renameReset(), 3000);
  }, [renameError, renameReset]);

  return (
    <div>
      <div>
        {/* //* FOLDER DETAILS MODAL */}
        {folderDetails && (
          <ModalFolderDetails
            setFolderDetails={setFolderDetails}
            createdAt={createdAt}
            updatedAt={updatedAt}
            name={name}
            size={size}
            path={path}
            DirCount={DirCount}
            fileCount={fileCount}
          />
        )}
      </div>
      <div
        key={_id}
        title={`Size: ${calSize(size)}`}
        className={`bg-clr5 text-clr1 hover:border-clr5 hover:text-clr3 hover:bg-clr1 border-clr5 flex justify-between p-2 items-center shadow-md hover:shadow-lg border-2  font-bebas tracking-widest text-lg  duration-300`}
      >
        <div className={`w-[80%] cursor-pointer `}>
          {rename ? (
            <div className="flex items-center gap-2">
              <span>
                <FaFolder />
              </span>
              <input
                className="border-1 w-3/4 px-2 py-1 outline-none "
                value={directoryName}
                onChange={(e) => setDirectoryName(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => renameFun({ _id, folderName: directoryName })}
                className="text-lg cursor-pointer"
              >
                <MdSave />
              </button>
            </div>
          ) : (
            <Link
              to={`/directory/${_id}`}
              className="truncate capitalize flex items-center gap-2"
            >
              <span>
                <FaFolder />
              </span>
              {name}
            </Link>
          )}
        </div>
        {/* //* SETTING */}
        <div className="flex w-[30%] justify-between">
          {/* //* INFO */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setFolderDetails(true)}
              className="flex gap-2 justify-between items-center w-full cursor-pointer  text-xl"
            >
              <MdOutlineInfo />
            </button>
          </div>

          {/* //* RENAME */}
          <button
            onClick={() => setRename((prev) => !prev)}
            className=" cursor-pointer"
          >
            {rename ? (
              <h1 className="flex gap-2 justify-between items-center  text-xl">
                <GiCancel />
              </h1>
            ) : (
              <h1 className="flex gap-2 justify-between items-center  text-xl">
                <MdOutlineDriveFileRenameOutline />
              </h1>
            )}
          </button>

          {/* //* DELETE */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => deleteFun({ _id })}
              className="flex gap-2 justify-between items-center w-full cursor-pointer  text-xl"
            >
              <MdDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
