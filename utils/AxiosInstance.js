import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

export const axiosWithCreds = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosWithOutCreds = axios.create({
  baseURL,
});
