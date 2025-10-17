import axios from "axios";
import { axiosWithCreds } from "./AxiosInstance";
import {
  deleteFileError,
  renameFileError,
  uploadFileError,
} from "./CustomReturns";

//* INITIATE FILE UPLOAD
export const uploadInitiate = async (fileData) => {
  try {
    const { data, status } = await axiosWithCreds.post(
      "/file/upload/initiate",
      fileData
    );
    return { success: true, data, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || uploadFileError
      : uploadFileError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};

//* COMPLETE FILE UPLOAD
export const uploadComplete = async ({ fileID, size }) => {
  try {
    const { data, status } = await axiosWithCreds.post(
      "/file/upload/complete",
      {
        fileID,
        size,
      }
    );
    return { success: true, data, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || uploadFileError
      : uploadFileError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};

//* RENAME FILE
export const renameFile = async ({ _id, itemName, extension }) => {
  try {
    const { data, status } = await axiosWithCreds.patch(`/file/${_id || ""}`, {
      newName: `${itemName}${extension}`,
      basename: itemName,
    });
    return { success: true, message: data.message, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || renameFileError
      : renameFileError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};

//* DELETE FILE
export const deleteFile = async ({ _id }) => {
  try {
    const { data, status } = await axiosWithCreds.delete(`/file/${_id || ""}`);
    return { success: true, message: data.message, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || deleteFileError
      : deleteFileError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};
