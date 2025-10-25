import axios from "axios";
import { axiosWithCreds } from "./AxiosInstance";

//* ==========>INITIATE FILE UPLOAD
export const uploadInitiate = async (fileData) => {
  console.log(fileData);
  try {
    const { data, status } = await axiosWithCreds.post(
      "/file/upload/initiate",
      fileData
    );
    return { success: true, data, status };
  } catch (error) {
    const errorMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || "Failed to upload file"
      : "Something went wrong";
    return {
      success: false,
      message: errorMsg,
      status: error.response?.status || null,
    };
  }
};

//* ==========>COMPLETE FILE UPLOAD
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
    const errorMsg = axios.isAxiosError(error)
      ? error.response?.data?.error || "Failed to upload file"
      : "Something went wrong";
    return {
      success: false,
      message: errorMsg,
      status: error.response?.status || null,
    };
  }
};
