import { useContext, useState } from "react";
import { MdSave } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { GiCancel } from "react-icons/gi";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineInfo } from "react-icons/md";
import ModalFolderDetails from "../modals/ModalFolderDetails";
import { calSize } from "../utils/CalculateFileSize";
import { axiosError, axiosWithCreds } from "../utils/AxiosInstance";
import {
  ErrorContext,
  FolderIDContext,
  UpdateContext,
  UserSettingViewContext,
} from "../utils/Contexts";

export default function CompFolderItem({
  createdAt,
  filesCount,
  foldersCount,
  name,
  parentFID,
  size,
  updatedAt,
  _id,
  handleDirectoryDetails,
}) {
  const navigate = useNavigate();
  const { setFolderID } = useContext(FolderIDContext);
  const { setError } = useContext(ErrorContext);
  const { setUpdate } = useContext(UpdateContext);

  // console.log(DirCount, fileCount);
  const [rename, setRename] = useState(false);
  const [directoryName, setDirectoryName] = useState(name);
  const [folderDetails, setFolderDetails] = useState(false);

  const { setUserView } = useContext(UserSettingViewContext);

  async function handleRenameFolder() {
    if (!directoryName.trim()) {
      setError("Please provider a valid folder name");
      setTimeout(() => setError(""), 3000);
    } else {
      try {
        const { data, status } = await axiosWithCreds.patch(
          `/directory/${_id || ""}`,
          { folderName: directoryName }
        );
        if (status === 201) {
          setFolderID(parentFID);
          handleDirectoryDetails(parentFID);
          setRename(false);
        }
        setUpdate(data.message);
        setTimeout(() => setUpdate(""), 3000);
      } catch (error) {
        const msg = "Failed to rename folder";
        axiosError(error, navigate, setError, msg);
      }
    }
  }

  async function handleDeleteFolder() {
    try {
      const { data, status } = await axiosWithCreds.delete(
        `/directory/${_id || ""}`
      );
      if (status === 201) {
        setFolderID(parentFID);
        handleDirectoryDetails(parentFID);
        setRename(false);
      }
      setUpdate(data.message);
      setTimeout(() => setUpdate(""), 3000);
    } catch (error) {
      const msg = "Failed to delete folder";
      axiosError(error, navigate, setError, msg);
    }
  }

  return (
    <div>
      <div>
        {/* //* ==========>FOLDER DETAILS MODAL */}
        {folderDetails && (
          <ModalFolderDetails
            setFolderDetails={setFolderDetails}
            fileCount={filesCount}
            DirCount={foldersCount}
            createdAt={createdAt}
            updatedAt={updatedAt}
            name={name}
            size={size}
          />
        )}
      </div>
      <div
        key={_id}
        title={`Size: ${calSize(size)}`}
        className={`flex justify-between p-2 items-center shadow-md hover:shadow-lg border-1 duration-300 bg-clrDarkGreen text-clrGray tracking-wider hover:bg-transparent hover:text-black`}
      >
        <div className={`w-[80%] cursor-pointer `}>
          {rename ? (
            <div className="flex items-center gap-2">
              <span>
                <FaFolder />
              </span>
              <input
                className="border-2 w-3/4 px-2 py-1 outline-none "
                value={directoryName}
                onChange={(e) => setDirectoryName(e.target.value)}
                autoFocus
              />
              <button onClick={handleRenameFolder} className=" cursor-pointer">
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
        {/* //* ==========>SETTING */}
        <div className="flex w-[30%] justify-between">
          {/* //* ==========>INFO */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={() => setFolderDetails(true)}
              className="flex gap-2 justify-between items-center w-full cursor-pointer  "
            >
              <MdOutlineInfo />
            </button>
          </div>

          {/* //* ==========>RENAME */}
          <button
            onClick={() => {
              setRename((prev) => !prev);
              setUserView(false);
            }}
            className=" cursor-pointer"
          >
            {rename ? (
              <h1 className="flex gap-2 justify-between items-center  ">
                <GiCancel />
              </h1>
            ) : (
              <h1 className="flex gap-2 justify-between items-center  ">
                <MdOutlineDriveFileRenameOutline />
              </h1>
            )}
          </button>

          {/* //* ==========>DELETE */}
          <div className="flex gap-2 justify-between">
            <button
              onClick={handleDeleteFolder}
              className="flex gap-2 justify-between items-center w-full cursor-pointer  "
            >
              <MdDelete />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
