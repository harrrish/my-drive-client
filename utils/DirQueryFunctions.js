import axios from "axios";
import { axiosWithCreds } from "./AxiosInstance";
import {
  createDirError,
  deleteDirError,
  getDirError,
  renameDirError,
} from "./CustomReturns";

//* GET DIRECTORY CONTENTS
export const getDirectoryItems = async (folderId) => {
  try {
    const { data, status } = await axiosWithCreds.get(
      `/directory/${folderId || ""}`
    );
    return { success: true, data, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || getDirError
      : getDirError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};

//* CREATE FOLDER
export const createFolder = async ({ folderId, folderName }) => {
  try {
    const { data, status } = await axiosWithCreds.post(
      `/directory/${folderId || ""}`,
      {
        folderName,
      }
    );
    return { success: true, data, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || createDirError
      : createDirError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};

//* RENAME FOLDER
export const renameFolder = async ({ _id, folderName }) => {
  try {
    const { data, status } = await axiosWithCreds.patch(
      `/directory/${_id || ""}`,
      {
        folderName,
      }
    );
    return { success: true, data, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || renameDirError
      : renameDirError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};

//* DELETE FOLDER
export const deleteFolder = async ({ _id }) => {
  try {
    const { data, status } = await axiosWithCreds.delete(
      `/directory/${_id || ""}`
    );
    return { success: true, data, status };
  } catch (error) {
    const errMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || deleteDirError
      : deleteDirError;
    return {
      success: false,
      message: errMsg,
      status: error.response?.status || null,
    };
  }
};
