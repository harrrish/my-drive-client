import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosWithCreds = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosWithOutCreds = axios.create({
  baseURL,
});

const serverErr = "Internal server error";

export function axiosError(error, navigate, setError, customErr) {
  const errorMsg = axios.isAxiosError(error)
    ? error.response?.data?.error || customErr
    : serverErr;
  if (error.status === 401 && errorMsg === "Expired or Invalid Session")
    navigate("/login");
  else {
    setError(errorMsg);
    setTimeout(() => setError(""), 3000);
  }
}
