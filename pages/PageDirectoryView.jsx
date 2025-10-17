import mime from "mime";
import axios from "axios";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompFileItem from "../components/CompFileItem";
import CompFolderItem from "../components/CompFolderItem";
import CompNavbar from "../components/CompNavbar";
import ModalCreateFolder from "../modals/ModalCreateFolder";
import CompUploadSection from "../components/CompUploadSection.jsx";
import CompSearchSort from "../components/CompSearchSort.jsx";
import CompFolderPath from "../components/CompFolderPath.jsx";
import CompLoadingShimmer from "../components/CompLoadingShimmer.jsx";
import CompEmptyFolder from "../components/CompEmptyFolder.jsx";
import CompFoldersFiles from "../components/CompFoldersFiles.jsx";
import { getDirectoryItems } from "../utils/DirQueryFunctions";
import { calSize } from "../utils/CalculateFileSize.js";
import {
  ErrorContext,
  ErrorModalContext,
  FileCountContext,
  FilesContext,
  FolderCountContext,
  FoldersContext,
  PathContext,
  UpdateContext,
  UserDetailsContext,
  UserViewContext,
} from "../utils/Contexts.js";
import { MdCancel } from "react-icons/md";
import { uploadComplete, uploadInitiate } from "../utils/FileQueryFunctions.js";
import { handleErrResp } from "../utils/HandleDirError.js";
import ModalUserSessionErr from "../modals/ModalUserSessionErr.jsx";
import { axiosWithCreds } from "../utils/AxiosInstance.js";
import CompUpdateError from "../components/CompUpdateError.jsx";

export default function PageDirectoryView() {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showCreateFolder, setCreateFolder] = useState(false);

  const { errorModal, setErrorModal } = useContext(ErrorModalContext);
  const { setError } = useContext(ErrorContext);
  const { filesCount, setFilesCount } = useContext(FileCountContext);
  const { filesList, setFilesList } = useContext(FilesContext);
  const { foldersCount, setFoldersCount } = useContext(FolderCountContext);
  const { foldersList, setFoldersList } = useContext(FoldersContext);
  const { setPath } = useContext(PathContext);
  const { setUserDetails } = useContext(UserDetailsContext);
  const { setUpdate } = useContext(UpdateContext);
  const { userView, setUserView } = useContext(UserViewContext);

  const [uploadFile, setUploadFile] = useState(null);
  const [tempUpload, setTempUpload] = useState(false);
  const [uploadPrg, setUploadPrg] = useState(0);

  const xhrRef = useRef(null);

  //* Getting User Details
  const getUserDetails = useCallback(async () => {
    try {
      const { data } = await axiosWithCreds.get(`/user/profile`, {
        withCredentials: true,
      });
      setUserDetails({ ...data });
    } catch (error) {
      const { status, message } = error;
      handleErrResp(
        status,
        message,
        setError,
        setErrorModal,
        navigate,
        setUpdate
      );
    }
  }, [setUserDetails, navigate, setError, setErrorModal, setUpdate]);

  //* Fetching directory items
  const fetchDirectoryData = useCallback(async () => {
    try {
      const { data, status } = await getDirectoryItems(folderId);
      if (status === 200 || status === 201) {
        setErrorModal(false);
        const { directories, files, filesCount, foldersCount, path } = data;
        setLoading(false);
        setFilesCount(filesCount);
        setFilesList(files || []);
        setFoldersCount(foldersCount);
        setFoldersList(directories || []);
        setPath(path);
      }
    } catch (error) {
      const { status, message } = error;
      handleErrResp(
        status,
        message,
        setError,
        setErrorModal,
        navigate,
        setUpdate
      );
    }
  }, [
    folderId,
    navigate,
    setFilesCount,
    setFilesList,
    setFoldersCount,
    setFoldersList,
    setError,
    setErrorModal,
    setUpdate,
    setPath,
  ]);

  //* Handling file select and getting upload URL
  async function handleFileSelect(event) {
    setUserView(false);
    //* SELECTING THE FILE
    const file = event.target.files?.[0];
    if (!file) return;
    // console.log(file);

    //* STOPPING A NEW UPLOAD
    if (uploadFile?.isUploading) {
      console.log(event.target.file);
      setError("An upload is already in progress. Please wait !");
      setTimeout(() => {
        setError("");
        event.target.value = "";
      }, 3000);
      return;
    }

    //* CREATING A TEMP FILE & PREPARING THE FILE TO BE UPLOADED
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

    //* VIEWING THE PREPARED FILE
    // console.log({ uploadFile });

    try {
      //* INITIATING FILE UPLOAD (GETTING UPLOAD URL)
      const { data } = await uploadInitiate({
        name: file.name,
        size: file.size,
        contentType: file.type,
        folderId,
      });
      const { uploadSignedUrl, fileID } = data;
      // console.log(fileID);
      //* STARTING FILE UPLOAD
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
  //* Upload File along with Handling cancel
  function startUpload(item, uploadUrl, fileID) {
    const { file, type, name, size } = item;

    const controller = new AbortController();
    xhrRef.current = controller; // reusing the same ref for cancel

    const contentType =
      type || mime.getType(name) || "application/octet-stream";
    //* "application/octet-stream" → generic MIME type for "binary data".

    // console.log({ contentType });
    // console.log({ uploadUrl, file });

    //* SENDING FILE TO S3 USING UPLOAD URL
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
        fetchDirectoryData(folderId);
        setUpdate(`File "${name} uploaded !"`);
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
        fetchDirectoryData();
      });
  }
  //* Handling File Upload Cancel
  function handleCancelUpload(tempId) {
    if (uploadFile?.id === tempId && xhrRef.current) {
      xhrRef.current.abort(); // cancel axios request
    }
    resetUploadState();
    fetchDirectoryData();
  }
  //* Resetting the upload state
  function resetUploadState() {
    setUploadFile(null);
    setTempUpload(false);
    setUploadPrg(0);
  }
  useEffect(() => {
    fetchDirectoryData(folderId);
    if (userView) {
      getUserDetails();
    }
  }, [folderId, fetchDirectoryData, getUserDetails, userView]);

  return (
    <div className="min-h-[100vh] bg-gray-200 border-3 relative overflow-hidden">
      {/* //* UPDATE AND ERROR MODALS */}
      <CompUpdateError />

      {/* //* CREATE FOLDER MODAL */}
      <div>
        {showCreateFolder && (
          <ModalCreateFolder
            setCreateFolder={setCreateFolder}
            folderId={folderId}
            fetchDirectoryData={fetchDirectoryData}
          />
        )}
        {errorModal && <ModalUserSessionErr />}
      </div>

      {/* //* MAIN CONTENT */}
      <div className="flex flex-col gap-2">
        {/* //* NAVBAR */}
        <CompNavbar />

        {/*//* Folder Path} */}
        <CompFolderPath />

        {/* //* CREATE FOLDER || UPLOAD FILE */}
        <CompUploadSection
          setCreateFolder={setCreateFolder}
          handleFileSelect={handleFileSelect}
        />

        {/* //* SEARCH SECTION */}
        <CompSearchSort />

        {/* //* LOADING, EMPTY FOLDER, FOLDERS & FILES */}
        {loading ? (
          <CompLoadingShimmer />
        ) : foldersCount === 0 && filesCount === 0 && tempUpload === false ? (
          <div className="w-[95%] sm:max-w-3xl mx-auto">
            <CompFoldersFiles
              foldersCount={foldersCount}
              filesCount={filesCount}
            />
            <CompEmptyFolder />
          </div>
        ) : (
          <div className="flex flex-col w-[95%] sm:max-w-3xl mx-auto">
            <CompFoldersFiles
              foldersCount={foldersCount}
              filesCount={filesCount}
            />
            <div className="p-2">
              {/* //* DISPLAY FOLDERS  */}
              <div id="list" className="flex flex-col w-full mx-auto gap-2">
                {foldersList.map((directory) => {
                  return (
                    <CompFolderItem
                      key={directory._id}
                      {...directory}
                      folderId={folderId}
                      fetchDirectoryData={fetchDirectoryData}
                      DirCount={setFoldersList.length}
                      fileCount={filesList.length}
                    >
                      {directory.name}
                    </CompFolderItem>
                  );
                })}
              </div>
            </div>
            <div className="p-2">
              {/* //* DISPLAY FILES   */}
              <div id="list" className={`flex flex-col w-full mx-auto gap-2`}>
                {filesList.map((listItem) => (
                  <CompFileItem
                    key={listItem._id}
                    {...listItem}
                    folderId={folderId}
                    fetchDirectoryData={fetchDirectoryData}
                  />
                ))}
              </div>
              <div>
                {tempUpload && uploadFile && (
                  <div className="bg-clr4 text-clr1 mt-2 b p-2 flex flex-col gap-2 font-urban shadow-2xl font-medium tracking-wide">
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
                        className="text-2xl cursor-pointer"
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
