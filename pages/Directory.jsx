import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DirectoryContext,
  ErrorContext,
  UpdateContext,
  UserStorageContext,
} from "../utils/Contexts.js";
import { axiosError, axiosWithCreds } from "../utils/AxiosInstance.js";
import CompNavbar from "../components/NavbarHome.jsx";
import CompFileItem from "../components/FileItem.jsx";
import CompFolderItem from "../components/FolderItem.jsx";
import ModalsDiv from "../modals/ModalsDiv.jsx";
import { MdGridView } from "react-icons/md";
import { TiFolderAdd } from "react-icons/ti";
import { FaFileUpload, FaSearch, FaSortAmountDown } from "react-icons/fa";
import { LuFiles } from "react-icons/lu";
import { FaGoogleDrive, FaList } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import { RiFoldersFill } from "react-icons/ri";
import {
  startSingleUpload,
  uploadSingleFile,
} from "../utils/UploadSingleFile.js";
import { BiFolderOpen } from "react-icons/bi";
import UploadFile from "../components/UploadFile.jsx";

export default function PageDirectoryView() {
  const { dirID } = useParams();
  const navigate = useNavigate();
  const [showCreateFolder, setCreateFolder] = useState(false);
  const { setError } = useContext(ErrorContext);
  const { setUpdate } = useContext(UpdateContext);
  const { setUserStorage } = useContext(UserStorageContext);
  const { directoryDetails, setDirectoryDetails } =
    useContext(DirectoryContext);

  //* ==========> FETCHING USER STORAGE DETAILS
  const handleUserStorageDetails = useCallback(async () => {
    try {
      const { data } = await axiosWithCreds.get(`/user/storage-details`, {
        withCredentials: true,
      });
      setUserStorage((prev) => ({
        ...prev, // ✅ proper object spread syntax
        size: data?.size || 0,
        maxStorageInBytes: data?.maxStorageInBytes || 0,
      }));
    } catch (error) {
      const msg = "Failed to fetch storage info";
      axiosError(error, navigate, setError, msg);
    }
  }, [setUserStorage, navigate, setError]);

  //* ==========> FETCHING DIRECTORY DETAILS
  const handleDirectoryDetails = useCallback(
    async (dirID) => {
      try {
        const { data } = await axiosWithCreds.get(`/directory/${dirID || ""}`);
        setDirectoryDetails({ ...data });
        handleUserStorageDetails();
      } catch (error) {
        const msg = "Failed to fetch folder content";
        axiosError(error, navigate, setError, msg);
      }
    },
    [setDirectoryDetails, setError, handleUserStorageDetails, navigate],
  );

  const [uploadFilesList, setUploadFilesList] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFilesUpload(event) {
    if (isUploading) {
      setError((prev) => [...prev, "Upload in progress, Please wait"]);
      setTimeout(() => setError((prev) => prev.slice(1)), 3000);
      event.target.value = "";
    } else {
      const filesList = event.target.files;
      if (filesList < 1) return;
      setIsUploading(true);
      const uploadFilesList = Array.from(filesList).map((file) => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        id: crypto.randomUUID(),
        isUploading: true,
        progress: 0,
      }));
      // console.log({ uploadFilesList });
      setUploadFilesList(uploadFilesList);

      for await (const listItem of uploadFilesList) {
        const { status, fileID, uploadSignedUrl } = await uploadSingleFile(
          listItem,
          dirID,
          navigate,
          setError,
        );
        if (status === 200) {
          await startSingleUpload(
            dirID,
            listItem,
            uploadSignedUrl,
            fileID,
            handleDirectoryDetails,
            navigate,
            setError,
            setUpdate,
            setUploadFilesList,
          );
        }
      }
      event.target.value = "";
      setIsUploading(false);
    }
  }

  useEffect(() => {
    handleDirectoryDetails(dirID);
  }, [handleDirectoryDetails, dirID]);

  return (
    <div className="min-h-screen bg-clrGray border-2 relative overflow-hidden font-google font-medium tracking-wide">
      {/* //* ==========> MODALS */}
      <ModalsDiv
        showCreateFolder={showCreateFolder}
        setCreateFolder={setCreateFolder}
        folderID={dirID}
        handleDirectoryDetails={handleDirectoryDetails}
      />
      {/* //* ==========>MAIN CONTENT */}
      <div className="flex flex-col gap-2">
        {/* //* ==========>NAVBAR */}
        <CompNavbar />
        {/*//* ==========>Folder Path} */}
        <div className="w-[95%] sm:max-w-3xl md:max-w-4xl mx-auto px-2 shadow-lg hover:shadow-2xl duration-300 rounded-sm h-10 flex items-center overflow-x-auto cursor-grab select-none custom-scrollbar bg-white">
          <div className="flex items-center whitespace-nowrap">
            {directoryDetails.path.map((p, index) => (
              <div key={p.id} className="flex items-center">
                <button
                  className="capitalize truncate max-w-[150px] hover:underline cursor-pointer select-none"
                  onClick={() => navigate(`/directory/${p.id}`)}
                  title={
                    p.name.includes("root") ? p.name.split("-")[0] : p.name
                  }
                >
                  {p.name.includes("root") ? p.name.split("-")[0] : p.name}
                </button>
                {index !== directoryDetails.path.length - 1 && (
                  <span className=" flex-shrink-0">
                    <IoMdArrowDropright />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {/*//* ==========>Create Folder || Upload File} */}
        {/*//* ==========>Search file/folder || Import from Drive} */}
        {/*//* ==========>File and Folders Sort || Files and Folders Count} */}
        <div className="flex flex-col items-center sm:max-w-3xl md:max-w-4xl w-[95%] gap-2 justify-between mx-auto">
          <div className="flex w-full shadow-lg rounded-sm bg-white">
            {/* //* ==========>CREATE FOLDER */}
            <button
              className="flex items-center justify-center gap-2 h-10 w-[25%]"
              title="Create folder"
              onClick={() => setCreateFolder(true)}
            >
              <span className="hover:cursor-pointer text-3xl hover:scale-125 duration-300">
                <TiFolderAdd />
              </span>
            </button>
            {/* //* ==========>FILE UPLOAD */}
            <label
              htmlFor="fileUpload"
              className="duration-300 flex items-center justify-center gap-2 h-10 w-[25%]"
              title="Upload file"
            >
              <FaFileUpload
                className="hover:cursor-pointer text-2xl hover:scale-125 duration-300"
                title="Upload file"
              />
              <input
                type="file"
                multiple
                onChange={(event) => handleFilesUpload(event)}
                className="hidden"
                id="fileUpload"
              />
            </label>
            {/* //* ==========>GOOGLE DRIVE */}
            <button
              className="duration-300 flex items-center justify-center gap-2 h-10 w-[25%]"
              title="Import from Google Drive"
            >
              <span className="hover:cursor-pointer text-2xl hover:scale-125 duration-300">
                <FaGoogleDrive />
              </span>
            </button>
            {/* //* ==========>FILES AND FOLDERS */}
            <div className="group flex justify-center items-center p-1 h-10 w-[25%] gap-5">
              <h1 className="flex items-center gap-1 ">
                <span className="text-2xl">
                  <RiFoldersFill />
                </span>
                <span className="group-hover:scale-135 text-md duration-200">
                  {directoryDetails.foldersCount}
                </span>
              </h1>
              <h1 className="flex items-center gap-1">
                <span className="text-2xl">
                  <LuFiles />
                </span>
                <span className="group-hover:scale-135 text-md duration-200">
                  {directoryDetails.filesCount}
                </span>
              </h1>
            </div>
          </div>
          <div className="flex w-full shadow-lg bg-white rounded-sm">
            {/* //* ==========>SEARCH SECTION */}
            <div
              className="hover:cursor-pointer duration-300 flex items-center justify-center rounded-sm h-10 p-1 w-[60%]"
              title="Create folder"
            >
              <input
                type="text"
                className=" w-full p-10 outline-none h-full font-bold"
                placeholder="Search for file/folder..."
              />
              <button
                className=" hover:cursor-pointer duration-300 flex items-center justify-center h-full p-10"
                title="Search file"
              >
                <FaSearch />
              </button>
            </div>
            {/* //* ==========>SORTING */}
            <div className="flex justify-start items-center w-[20%] gap-2">
              <label htmlFor="sort" className="flex items-center w-full">
                <FaSortAmountDown />
                <select
                  id="sort"
                  name="sort"
                  className="text-center outline-none cursor-pointer h-full"
                >
                  <option value="size_inc">Size (Inc)</option>
                  <option value="size_dec">Size (Dec)</option>
                  <option value="name_asc">Name (Asc)</option>
                  <option value="name_desc">Name (Desc)</option>
                  <option value="last_modified_asc">Last Modified (Asc)</option>
                  <option value="last_modified_desc">
                    Last Modified (Desc)
                  </option>
                </select>
              </label>
            </div>
            {/* //* ==========>VIEW CHANGE */}
            <div className="w-[20%] flex justify-center gap-8">
              <button className="cursor-pointer hover:scale-125 duration-300">
                <FaList />
              </button>
              <button className="cursor-pointer hover:scale-125 duration-300">
                <MdGridView />
              </button>
            </div>
          </div>
        </div>
        {/* //* ==========>FOLDERS AND FILES  */}
        {directoryDetails.foldersCount < 1 &&
        directoryDetails.filesCount < 1 &&
        isUploading === false ? (
          <div className="min-h-[50vh] flex items-center justify-center">
            <h1 className="group text-center text-lg mt-4 flex items-center gap-2 flex-col">
              <span className="text-2xl group-hover:scale-150 duration-500">
                <BiFolderOpen />
              </span>
              Empty folder, No files or sub-folders found !
            </h1>
          </div>
        ) : (
          <div className="flex flex-col w-[95%] sm:max-w-3xl md:max-w-4xl mx-auto gap-2">
            {/* //* ==========>DISPLAY FOLDERS */}
            <div className="">
              <div id="list" className="flex flex-col w-full mx-auto gap-2">
                {directoryDetails.folders.map((directory) => {
                  return (
                    <CompFolderItem
                      key={directory._id}
                      {...directory}
                      handleDirectoryDetails={handleDirectoryDetails}
                      handleUserStorageDetails={handleUserStorageDetails}
                    />
                  );
                })}
              </div>
            </div>
            {/* //* ==========>DISPLAY FILES */}
            <div className="">
              <div id="list" className={`flex flex-col w-full mx-auto gap-2`}>
                {directoryDetails.files.map((listItem) => (
                  <CompFileItem
                    key={listItem._id}
                    {...listItem}
                    handleDirectoryDetails={handleDirectoryDetails}
                    handleUserStorageDetails={handleUserStorageDetails}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        {isUploading && uploadFilesList.length > 0 && (
          <div className="flex flex-col gap-2">
            {/* //* ==========> Uploading FILE */}
            {uploadFilesList.map((file) => (
              <UploadFile key={file.id} {...file} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
