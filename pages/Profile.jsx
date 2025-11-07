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
import { FaGoogleDrive } from "react-icons/fa";
import { TiUserDelete } from "react-icons/ti";

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
    <div className="min-h-screen flex items-center justify-center font-google bg-clrGray">
      <div className="w-[50%] max-w-xl flex flex-col items-center p-4 gap-3 rounded-sm shadow-md hover:shadow-lg duration-300 bg-white">
        <div className="flex justify-between w-full items-center">
          <h2 className="text-5xl flex gap-2 items-center">
            <span className="text-3xl">
              <FaGoogleDrive />
            </span>
            <span className="text-2xl font-bold">My Drive</span>
          </h2>
          <h2 className="text-xl font-medium">{userDetails.email}</h2>
        </div>
        <img
          src={
            userDetails.picture ||
            "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
          }
          alt={`${userDetails.name}'s profile picture`}
          className="w-1/2 rounded-full"
        />
        <div className="flex justify-between w-full items-center border-2 px-4 py-1 rounded-full">
          <h2 className="text-lg font-medium">{userDetails.name}</h2>
          <h2 className="text-lg font-medium">Alpha@123</h2>
        </div>
        <div className="w-[90%] flex flex-col items-center">
          <div className="p-[2px] w-full bg-black">
            <div
              className="p-[2px] bg-white"
              style={{
                width: `${userStorage.size / userStorage.maxStorageInBytes}%`,
              }}
            ></div>
          </div>
          <h1 className="flex items-center justify-center gap-1 p-1 truncate duration-300 w-[90%]">
            Used <span>{calSize(userStorage.size)}</span> of{" "}
            <span>{calSize(userStorage.maxStorageInBytes)}</span>
          </h1>
        </div>
        <button
          onClick={() => navigate("/directory")}
          className="w-[90%] text-sm flex items-center justify-between p-1 border-2 cursor-pointer truncate duration-150 font-bold px-4 tracking-wide hover:scale-105"
        >
          <FaHome />
          HOME
        </button>
        <button
          onClick={() => navigate("/bin")}
          className="w-[90%] text-sm flex items-center justify-between p-1 border-2 cursor-pointer truncate duration-150 font-bold px-4 tracking-wide hover:scale-105"
        >
          <FaTrash />
          TRASH BIN
        </button>
        <button
          onClick={() => navigate("/purchase-premium")}
          className="w-[90%] text-sm flex items-center justify-between p-1 border-2 cursor-pointer truncate duration-150 font-bold px-4 tracking-wide hover:scale-105"
        >
          <BiSolidPurchaseTag />
          BUY PREMIUM
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-between p-1 border-2 cursor-pointer truncate duration-150 font-bold px-4 tracking-wide hover:scale-105"
          onClick={handleLogout}
        >
          <IoLogOut />
          LOGOUT
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-between p-1 border-2 cursor-pointer truncate duration-150 font-bold px-4 tracking-wide hover:scale-105"
          onClick={handleLogout}
        >
          <IoLogOut />
          LOGOUT ALL ACCOUNTS
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-between p-1 border-2 cursor-pointer truncate duration-150 font-bold px-4 tracking-wide hover:scale-105"
          onClick={() => console.log("User deleted")}
        >
          <TiUserDelete />
          DELETE ACCOUNT
        </button>
      </div>
    </div>
  );
}
