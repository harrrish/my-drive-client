import React, { useCallback, useContext, useEffect } from "react";
import {
  ErrorContext,
  UserDetailsContext,
  UserStorageContext,
} from "../utils/Contexts";
import { calSize } from "../utils/CalculateFileSize";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../src/main";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { axiosError, axiosWithCreds } from "../utils/AxiosInstance";
import axios from "axios";

export default function PageUserProfile() {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const { userStorage, setUserStorage } = useContext(UserStorageContext);
  const navigate = useNavigate();
  const { setError } = useContext(ErrorContext);

  //* ==========> FETCHING USER PROFILE DETAILS
  const handleUserProfileDetails = useCallback(async () => {
    try {
      const { data } = await axiosWithCreds.get(`/user/profile`, {
        withCredentials: true,
      });
      setUserDetails({ ...data });
    } catch (error) {
      const msg = "Failed to fetch user info";
      axiosError(error, navigate, setError, msg);
    }
  }, [setUserDetails, navigate, setError]);

  //* ==========> FETCHING USER STORAGE DETAILS
  const handleUserStorageDetails = useCallback(async () => {
    try {
      const { data } = await axiosWithCreds.get(`/user/storage-details`, {
        withCredentials: true,
      });
      setUserStorage({ ...data });
    } catch (error) {
      const msg = "Failed to fetch storage info";
      axiosError(error, navigate, setError, msg);
    }
  }, [setUserStorage, navigate, setError]);

  async function handleLogout() {
    const res = await fetch(`${baseURL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      navigate("/login");
      console.log("User logged out");
    }
  }

  useEffect(() => {
    handleUserProfileDetails();
    handleUserStorageDetails();
  }, [handleUserProfileDetails, handleUserStorageDetails]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-[50%] max-w-xl flex flex-col items-center p-4 gap-4 rounded-sm shadow-md hover:shadow-lg duration-300">
        <h2 className="text-5xl ">My Drive</h2>
        <div className="flex justify-between w-full  er">
          <h2 className="text-xl ">{userDetails.name}</h2>
          <h2 className="text-xl ">{userDetails.email}</h2>
        </div>
        <img
          src={
            userDetails.picture ||
            "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
          }
          alt={`${userDetails.name}'s profile picture`}
          className="w-1/2 rounded-full"
        />

        <div className="p-[2px]w-full">
          <div
            className="p-[2px]"
            style={{
              width: `${userStorage.size / userStorage.maxStorageInBytes}%`,
            }}
          ></div>
        </div>

        <h1 className="flex items-center justify-center gap-1 p-1 truncate   duration-300">
          Used <span>{calSize(userStorage.size)}</span> of{" "}
          <span>{calSize(userStorage.maxStorageInBytes)}</span>
        </h1>

        <button
          onClick={() => navigate("/")}
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl   duration-300"
        >
          HOME
          <FaHome />
        </button>
        <button
          onClick={() => navigate("/bin")}
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl   duration-300"
        >
          TRASH BIN
          <FaTrash />
        </button>
        <button
          onClick={() => navigate("/purchase-premium")}
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl   duration-300"
        >
          BUY PREMIUM
          <BiSolidPurchaseTag />
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl   duration-300"
          onClick={handleLogout}
        >
          LOGOUT <IoLogOut />
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl   duration-300"
          onClick={handleLogout}
        >
          LOGOUT ALL ACCOUNTS <IoLogOut />
        </button>
      </div>
    </div>
  );
}
