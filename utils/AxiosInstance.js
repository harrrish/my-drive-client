import axios from "axios";

const baseURL = "https://my-drive-server.onrender.com";

export const axiosWithCreds = axios.create({
  baseURL,
  withCredentials: true,
});

export const axiosWithOutCreds = axios.create({
  baseURL,
});
