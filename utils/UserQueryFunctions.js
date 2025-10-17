import axios from "axios";
import { axiosWithCreds, axiosWithOutCreds } from "./AxiosInstance";

//* AXIOS WITHOUT CREDENTIALS
//* SENDING OTP
//* -------------------------
export const requestOTPFun = async (email) => {
  try {
    const { data } = await axiosWithOutCreds.post("/auth/send-otp", { email });
    return { success: true, message: data.message };
  } catch (error) {
    const msg = axios.isAxiosError(error)
      ? error.response?.data?.error || "OTP fetching failed!"
      : "Something went wrong!";
    return { success: false, message: msg };
  }
};

//* VERIFYING OTP
export const verifyOTPFun = async (formData) => {
  try {
    const { data } = await axiosWithOutCreds.post("/auth/verify-otp", formData);
    return { success: true, message: data.message };
  } catch (error) {
    const msg = axios.isAxiosError(error)
      ? error.response?.data?.error || "OTP verification failed!"
      : "Something went wrong!";
    return { success: false, message: msg };
  }
};

//* USER REGISTER
export const userRegSubFun = async (formData) => {
  try {
    const { data } = await axiosWithOutCreds.post("/user/register", formData);
    return { success: true, message: data.message };
  } catch (error) {
    const msg = axios.isAxiosError(error)
      ? error.response?.data?.error || "User registration failed!"
      : "Something went wrong!";
    return { success: false, message: msg };
  }
};

//* AXIOS WITH CREDENTIALS
//* USER LOGIN (SINCE IT ACCEPTS COOKIES)
export const userLoginSubmit = async (formData) => {
  try {
    const { data } = await axiosWithCreds.post("/user/login", formData);
    if (data) {
      return { success: true, message: data.message };
    }
  } catch (error) {
    throw new {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.error || "User login failed !"
        : "Internal Server Error !",
    }();
  }
};
