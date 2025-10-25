import mime from "mime";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompFileItem from "../components/CompFileItem";
import CompFolderItem from "../components/CompFolderItem";
import CompNavbar from "../components/CompNavbar";
import { calSize } from "../utils/CalculateFileSize.js";
import {
  DirectoryContext,
  ErrorContext,
  UpdateContext,
  UserStorageContext,
} from "../utils/Contexts.js";
import { MdCancel, MdGridView } from "react-icons/md";
import { uploadComplete, uploadInitiate } from "../utils/FileQueryFunctions.js";
import { axiosWithCreds } from "../utils/AxiosInstance.js";
import ModalsDiv from "../modals/ModalsDiv.jsx";
import { TiFolderAdd } from "react-icons/ti";
import { FaFileUpload, FaSearch, FaSortAmountDown } from "react-icons/fa";
import { LuFiles } from "react-icons/lu";
import { FaGoogleDrive, FaList } from "react-icons/fa6";
import { IoMdArrowDropright } from "react-icons/io";
import { RiFoldersFill } from "react-icons/ri";

export default function PageDirectoryView() {
  const { dirID } = useParams();
  const navigate = useNavigate();
  const [showCreateFolder, setCreateFolder] = useState(false);
  const { setError } = useContext(ErrorContext);
  const { setUpdate } = useContext(UpdateContext);
  const { setUserStorage } = useContext(UserStorageContext);
  const { directoryDetails, setDirectoryDetails } =
    useContext(DirectoryContext);
  // const { listView, setListView } = useContext(ListViewContext);

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
      const errorMsg = axios.isAxiosError(error)
        ? error.response?.data?.error || "Failed to fetch storage details"
        : "Something went wrong";
      if (error.status === 401 && errorMsg === "Expired or Invalid Session")
        navigate("/login");
      else {
        setError(errorMsg);
        setTimeout(() => setError(""), 3000);
      }
    }
  }, [setUserStorage, navigate, setError]);

  //* ==========> FETCHING DIRECTORY DETAILS
  const handleDirectoryDetails = useCallback(
    async (dirID) => {
      try {
        const { data } = await axiosWithCreds.get(`/directory/${dirID || ""}`);
        // console.log(data);
        setDirectoryDetails({ ...data });
        handleUserStorageDetails();
      } catch (error) {
        const errorMsg = axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to fetch folder content"
          : "Something went wrong";
        if (error.status === 401 && errorMsg === "Expired or Invalid Session")
          navigate("/login");
        else {
          setError(errorMsg);
          setTimeout(() => setError(""), 3000);
        }
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
      setError("An upload is already in progress. Please wait !");
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
      const { data } = await uploadInitiate({
        name: file.name,
        size: file.size,
        contentType: file.type,
        folderID: dirID,
      });
      const { uploadSignedUrl, fileID } = data;
      // console.log(fileID);
      //* ==========>STARTING FILE UPLOAD
      startUpload(tempItem, uploadSignedUrl, fileID);
      event.target.value = "";
    } catch (error) {
      event.target.value = "";
      console.log(error.message);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      event.target.value = "";
    }
  }
  //* ==========>Upload File along with Handling cancel
  function startUpload(item, uploadUrl, fileID) {
    const { file, type, name, size } = item;

    const controller = new AbortController();
    xhrRef.current = controller; // reusing the same ref for cancel

    const contentType =
      type || mime.getType(name) || "application/octet-stream";
    //* ==========>"application/octet-stream" → generic MIME type for "binary data".

    // console.log({ contentType });
    // console.log({ uploadUrl, file });

    //* ==========>SENDING FILE TO S3 USING UPLOAD URL
    axios
      .put(uploadUrl, file, {
        headers: { "Content-Type": contentType },
        signal: controller.signal, // allows cancellation
        onUploadProgress: (evt) => {
          if (evt.total) {
            const progress = Math.round((evt.loaded / evt.total) * 100);
            setUploadPrg(progress);
          }
        },
      })
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          await uploadComplete({ fileID, size: size });
        }
        resetUploadState();
        handleDirectoryDetails(dirID);
        setUpdate(`File "${name}" uploaded !`);
        console.log(`File uploaded`);
        setTimeout(() => {
          setUpdate("");
        }, 3000);
      })
      .catch((error) => {
        console.log({ error });
        if (axios.isCancel(error)) {
          setError("Upload canceled");
          resetUploadState();
          setTimeout(() => {
            setError("");
          }, 3000);
        } else if (error.response?.status === 507) {
          setError("File too large! Please select a smaller file.");
          resetUploadState();
          setTimeout(() => {
            setError("");
          }, 3000);
        } else {
          setError(error.message);
          setTimeout(() => {
            setError("");
          }, 3000);
        }
        // setFilesList((prev) => prev.filter((f) => f.id !== id));
        resetUploadState();
        handleDirectoryDetails(dirID);
      });
  }
  //* ==========>Handling File Upload Cancel
  function handleCancelUpload(tempId) {
    if (uploadFile?.id === tempId && xhrRef.current) {
      xhrRef.current.abort(); // cancel axios request
    }
    resetUploadState();
    handleDirectoryDetails();
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
    <div className="min-h-[100vh] bg-gray-200 border-3 relative overflow-hidden">
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
        <div className="bg-clr7 w-[95%] sm:max-w-5xl mx-auto px-2 font-emb font-bold shadow-md hover:shadow-2xl duration-300 rounded-sm h-10 flex items-center overflow-x-auto cursor-grab select-none custom-scrollbar">
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
        <div className="flex flex-wrap sm:max-w-5xl w-[95%] gap-1 justify-between mx-auto">
          {/* //* ==========>CREATE FOLDER */}
          <button
            className="hover:cursor-pointer duration-300 text-clr5 border-2 bg-clr1 shadow-md hover:shadow-2xl w-[48%] flex items-center justify-center gap-2 rounded-sm h-10 hover:bg-green-600 hover:text-clr1 font-emb font-bold"
            title="Create folder"
            onClick={() => setCreateFolder(true)}
          >
            <span className="">
              <TiFolderAdd />
            </span>
            <span className="">Create Folder</span>
          </button>
          {/* //* ==========>FILE UPLOAD */}
          <label
            htmlFor="fileUpload"
            className="hover:cursor-pointer duration-300 bg-clr1 text-sky-500 shadow-md hover:shadow-2xl w-[48%] flex items-center justify-center gap-2 rounded-sm h-10 border-2 hover:bg-sky-500 hover:text-clr1 font-emb font-bold"
            title="Upload file"
          >
            <FaFileUpload className="" title="Upload file" />
            <input
              type="file"
              onChange={(event) => handleFileSelect(event)}
              className="hidden"
              id="fileUpload"
            />
            <span className="">Upload File</span>
          </label>
          {/* //* ==========>SEARCH SECTION */}
          <div
            className="hover:cursor-pointer duration-300 border-2 bg-clr1 shadow-md hover:shadow-2xl w-[48%] flex items-center justify-center rounded-sm h-10 font-emb font-bold p-1"
            title="Create folder"
          >
            <input
              type="text"
              className="text-clr3 w-full text-center  outline-none h-full"
              placeholder="Search for file/folder..."
            />
            <button
              className=" hover:cursor-pointer duration-300 flex items-center justify-center h-full"
              title="Search file"
            >
              <FaSearch />
            </button>
          </div>
          {/* //* ==========>GOOGLE DRIVE */}
          <button
            className="hover:cursor-pointer duration-300 bg-clr1 shadow-md hover:shadow-2xl w-[48%] flex items-center justify-center gap-2 rounded-sm h-10 hover:bg-clr7 text-clr7 border-2 hover:text-clr1 font-emb font-bold"
            title="Bin"
          >
            <span className="">
              <FaGoogleDrive />
            </span>
            <span className="">Import from Drive</span>
          </button>
          {/* //* ==========>VIEW & SORT */}
          <div className="flex items-center justify-between w-[48%] bg-clr1 gap-2 text-clr3 shadow-md hover:shadow-xl duration-300 h-10 rounded-sm font-emb font-bold border-2">
            {/* //* ==========>VIEW CHANGE */}
            <div className="w-1/2 flex justify-center gap-8">
              <button className="cursor-pointer hover:scale-110">
                <FaList />
              </button>
              <button className="cursor-pointer hover:scale-110">
                <MdGridView />
              </button>
            </div>
            {/* //* ==========>SORT */}
            <div className="flex justify-start items-center w-1/2 gap-2">
              <label htmlFor="sort" className="flex items-center gap-1 w-full">
                <FaSortAmountDown className="" />
                <select
                  id="sort"
                  name="sort"
                  className="text-center outline-none cursor-pointer w-full h-full"
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
          </div>
          {/* //* ==========>FILES AND FOLDERS */}
          <div className="w-[48%] bg-clr1 flex justify-between items-center p-1 rounded-sm h-10 font-emb font-bold text-sm border-2 border-clr7">
            <h1 className="flex items-center gap-1 text-clr5">
              <span className="">
                <RiFoldersFill />
              </span>
              <span>Folders: {directoryDetails.foldersCount}</span>
            </h1>
            <h1 className="flex items-center gap-1 text-clr4">
              <span className="">
                <LuFiles />
              </span>
              Files: {directoryDetails.filesCount}
            </h1>
          </div>
        </div>
        {/* //* ==========>FOLDERS AND FILES  */}
        {directoryDetails.foldersCount < 1 &&
        directoryDetails.filesCount < 1 ? (
          <div>
            <h1 className="text-center font-bookerly-display text-2xl tracking-wide mt-4">
              No files or folders found !
            </h1>
          </div>
        ) : (
          <div className="flex flex-col w-[95%] sm:max-w-5xl mx-auto">
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
                  <div className="bg-clr4 text-clr1 mt-2 b p-2 flex flex-col gap-2 font-emb shadow-2xl font-medium">
                    <div className="flex justify-between">
                      <h1>{uploadFile.name}</h1>
                      <h1>{calSize(uploadFile.size)}</h1>
                      <h1>Upload Progress: {uploadPrg}%</h1>
                    </div>
                    <div className="flex items-center">
                      <div className="p-[2px] bg-clr3 w-[90%] mx-auto">
                        <div
                          className="p-[1px] bg-clr1"
                          style={{ width: `${uploadPrg}%` }}
                        ></div>
                      </div>
                      <button
                        className=" cursor-pointer"
                        title="Cancel upload"
                        onClick={() => handleCancelUpload(uploadFile.id)}
                      >
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
