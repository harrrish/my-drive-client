import axios from "axios";
import { axiosError, axiosWithCreds } from "./AxiosInstance";

export async function uploadSingleFile(listItem, dirID, navigate, setError) {
  const { name, size, type } = listItem;
  try {
    const { data, status } = await axiosWithCreds.post(
      "/file/upload/initiate",
      { name, size, contentType: type, folderID: dirID }
    );
    if (status === 200) {
      const { uploadSignedUrl, fileID } = data;
      return { status, uploadSignedUrl, fileID };
    }
  } catch (error) {
    const msg = "Failed to initiate file upload";
    axiosError(error, navigate, setError, msg);
  }
}

export async function startSingleUpload(
  dirID,
  listItem,
  uploadSignedUrl,
  fileID,
  handleDirectoryDetails,
  navigate,
  setError,
  setUpdate,
  updateFileProgress,
  setUploading,
  reloadState
) {
  const { file, type, size, name, id } = listItem;
  const contentType = type || "application/octet-stream";

  try {
    const res = await axios.put(uploadSignedUrl, file, {
      headers: { "Content-Type": contentType },
      onUploadProgress: (evt) => {
        if (evt.total) {
          const progress = Math.round((evt.loaded / evt.total) * 100);
          updateFileProgress(id, progress);
        }
      },
    });

    if (res.status === 200 || res.status === 201) {
      await axiosWithCreds.post("/file/upload/complete", { fileID, size });
      handleDirectoryDetails(dirID);
      setUpdate((prev) => [...prev, `File "${name}" uploaded`]);
      setTimeout(() => setUpdate((prev) => prev.slice(1)), 3000);
      handleDirectoryDetails(dirID);
      updateFileProgress(id, 100);
      setUploading(false);
      reloadState();
    }
  } catch (error) {
    const msg = "Failed to upload file";
    axiosError(error, navigate, setError, msg);
    handleDirectoryDetails(dirID);
    setUploading(false);
  }
}
