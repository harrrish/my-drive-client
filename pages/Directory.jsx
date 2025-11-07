import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import mime from "mime";

import {
  DirectoryContext,
  ErrorContext,
  UpdateContext,
  UserStorageContext,
} from "../utils/Contexts.js";
import { axiosError, axiosWithCreds } from "../utils/AxiosInstance.js";
import { calSize } from "../utils/CalculateFileSize.js";

import CompNavbar from "../components/NavbarHome.jsx";
import CompFileItem from "../components/FileItem.jsx";
import CompFolderItem from "../components/FolderItem.jsx";

import ModalsDiv from "../modals/ModalsDiv.jsx";

import { MdCancel, MdGridView } from "react-icons/md";
import { TiFolderAdd } from "react-icons/ti";
import { FaFileUpload, FaSearch, FaSortAmountDown } from "react-icons/fa";
import { LuFiles } from "react-icons/lu";
import { FaGoogleDrive, FaList } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import { RiFoldersFill } from "react-icons/ri";
import HomeLoading from "../components/HomeLoading.jsx";

export default function PageDirectoryView() {
  const { dirID } = useParams();
  const navigate = useNavigate();
  const [showCreateFolder, setCreateFolder] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const { setError } = useContext(ErrorContext);
  const { setUpdate } = useContext(UpdateContext);
  const { setUserStorage } = useContext(UserStorageContext);
  const { directoryDetails, setDirectoryDetails } =
    useContext(DirectoryContext);

  const [uploadFile, setUploadFile] = useState(null);
  const [tempUpload, setTempUpload] = useState(false);
  const [uploadPrg, setUploadPrg] = useState(0);

  const xhrRef = useRef(null);

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
      setContentLoading(true);
      try {
        const { data } = await axiosWithCreds.get(`/directory/${dirID || ""}`);
        // console.log(data);
        setDirectoryDetails({ ...data });
        setContentLoading(false);
        handleUserStorageDetails();
      } catch (error) {
        setContentLoading(false);
        const msg = "Failed to fetch folder content";
        axiosError(error, navigate, setError, msg);
      }
    },
    [setDirectoryDetails, setError, handleUserStorageDetails, navigate]
  );
  //* ==========>Handling file select and getting upload URL
  async function handleFileSelect(event) {
    //* ==========>SELECTING THE FILE
    const file = event.target.files?.[0];
    if (!file) return;
    // console.log(file);

    //* ==========>STOPPING A NEW UPLOAD
    if (uploadFile?.isUploading) {
      console.log(event.target.file);
      setError("An upload is already in progress. Please wait");
      setTimeout(() => {
        setError("");
        event.target.value = "";
      }, 3000);
      return;
    }

    //* ==========>CREATING A TEMP FILE & PREPARING THE FILE TO BE UPLOADED
    const tempItem = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      id: `temp-${Date.now()}`,
      isUploading: true,
    };
    setUploadFile(tempItem);
    setTempUpload(true);

    //* ==========>VIEWING THE PREPARED FILE
    // console.log({ uploadFile });

    try {
      //* ==========>INITIATING FILE UPLOAD (GETTING UPLOAD URL)
      const { data, status } = await axiosWithCreds.post(
        "/file/upload/initiate",
        {
          name: file.name,
          size: file.size,
          contentType: file.type,
          folderID: dirID,
        }
      );
      console.log(status);
      if (status === 200) {
        const { uploadSignedUrl, fileID } = data;
        // console.log(fileID);
        //* ==========>STARTING FILE UPLOAD
        startUpload(tempItem, uploadSignedUrl, fileID);
        event.target.value = "";
      }
    } catch (error) {
      event.target.value = "";
      const msg = "Failed to initiate file upload";
      axiosError(error, navigate, setError, msg);
    } finally {
      event.target.value = "";
    }
  }
  //* ==========>Upload File along with Handling cancel
  async function startUpload(item, uploadUrl, fileID) {
    const { file, type, name, size } = item;

    const controller = new AbortController();
    xhrRef.current = controller; // reusing the same ref for cancel

    const contentType =
      type || mime.getType(name) || "application/octet-stream";
    //* ==========>"application/octet-stream" → generic MIME type for "binary data".

    // console.log({ contentType });
    // console.log({ uploadUrl, file });

    //* ==========>SENDING FILE TO S3 USING UPLOAD URL
    try {
      const res = await axios.put(uploadUrl, file, {
        headers: { "Content-Type": contentType },
        signal: controller.signal, // allows cancellation
        onUploadProgress: (evt) => {
          if (evt.total) {
            const progress = Math.round((evt.loaded / evt.total) * 100);
            setUploadPrg(progress);
          }
        },
      });
      if (res.status === 200 || res.status === 201) {
        await axiosWithCreds.post("/file/upload/complete", {
          fileID,
          size,
        });
        resetUploadState();
        handleDirectoryDetails(dirID);
        setUpdate(`File "${name}" uploaded`);
        setTimeout(() => setUpdate(""), 3000);
      }
    } catch (error) {
      const msg = "Failed to upload file";
      axiosError(error, navigate, setError, msg);
      resetUploadState();
      handleDirectoryDetails(dirID);
    }
  }

  //* ==========>Resetting the upload state
  function resetUploadState() {
    setUploadFile(null);
    setTempUpload(false);
    setUploadPrg(0);
  }

  useEffect(() => {
    handleDirectoryDetails(dirID);
  }, [dirID, handleDirectoryDetails]);

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
                onChange={(event) => handleFileSelect(event)}
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
        directoryDetails.filesCount < 1 ? (
          <div>
            <h1 className="text-center text-2xl mt-4">
              No files or folders found !
            </h1>
          </div>
        ) : (
          <div className="flex flex-col w-[95%] sm:max-w-3xl md:max-w-4xl mx-auto">
            <div className="p-2">
              {/* //* ==========>DISPLAY FOLDERS */}
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
            <div className="p-2">
              {/* //* ==========>DISPLAY FILES */}
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
            {/* //* ==========>UPLOADING FILE */}
            <div className="p-2">
              <div>
                {tempUpload && uploadFile && (
                  <div className="bg-clrYellow mt-2 b p-2 flex flex-col gap-2 shadow-2xl ">
                    <div className="flex justify-between">
                      <h1>{uploadFile.name}</h1>
                      <h1>{calSize(uploadFile.size)}</h1>
                      <h1>Upload Progress: {uploadPrg}%</h1>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="bg-black p-[2px] w-full ">
                        <div
                          className="p-[1px] bg-clrWhite"
                          style={{
                            width: `${uploadPrg}%`,
                          }}
                        ></div>
                      </div>
                      <button className=" cursor-pointer" title="Cancel upload">
                        <MdCancel />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
