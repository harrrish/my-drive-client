import React, { useCallback, useContext, useEffect } from "react";
import { UserDetailsContext, UserStorageContext } from "../utils/Contexts";
import { calSize } from "../utils/CalculateFileSize";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../src/main";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import { FaTrash } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { axiosWithCreds } from "../utils/AxiosInstance";

export default function PageUserProfile() {
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const { userStorage, setUserStorage } = useContext(UserStorageContext);
  const navigate = useNavigate();

  //* ==========> FETCHING USER PROFILE DETAILS
  const handleUserProfileDetails = useCallback(async () => {
    const { data } = await axiosWithCreds.get(`/user/profile`, {
      withCredentials: true,
    });
    setUserDetails({ ...data });
  }, [setUserDetails]);
  //* ==========> FETCHING USER STORAGE DETAILS
  const handleUserStorageDetails = useCallback(async () => {
    const { data } = await axiosWithCreds.get(`/user/storage-details`, {
      withCredentials: true,
    });
    setUserStorage({ ...data });
  }, [setUserStorage]);

  async function handleLogout() {
    const res = await fetch(`${baseURL}/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (res.ok) {
      navigate("/login");
      console.log("User logged OUT !");
    }
  }

  useEffect(() => {
    handleUserProfileDetails();
    handleUserStorageDetails();
  }, [handleUserProfileDetails, handleUserStorageDetails]);

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="w-[50%] max-w-xl flex flex-col items-center bg-white p-4 gap-4 rounded-sm shadow-md hover:shadow-lg duration-300">
        <h2 className="font-bookerly-display text-5xl font-bold">My Drive</h2>
        <div className="flex justify-between w-full font-medium font-ember">
          <h2 className="font-bookerly-display text-xl font-bold">
            {userDetails.name}
          </h2>
          <h2 className="font-bookerly-display text-xl font-bold">
            {userDetails.email}
          </h2>
        </div>
        <img
          src={
            userDetails.picture ||
            "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
          }
          alt={`${userDetails.name}'s profile picture`}
          className="w-1/2 rounded-full"
        />

        <div className="p-[2px] bg-clr7 w-full">
          <div
            className="p-[2px] bg-clr1"
            style={{
              width: `${userStorage.size / userStorage.maxStorageInBytes}%`,
            }}
          ></div>
        </div>

        <h1 className="flex items-center justify-center gap-1 text-clr p-1 truncate font-emb font-bold duration-300">
          Used <span>{calSize(userStorage.size)}</span> of{" "}
          <span>{calSize(userStorage.maxStorageInBytes)}</span>
        </h1>

        <button
          onClick={() => navigate("/")}
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-clr7 hover:bg-clr7 flex-1 bg-clr1 hover:text-clr1 p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl font-emb font-bold duration-300"
        >
          HOME
          <FaHome />
        </button>
        <button
          onClick={() => navigate("/bin")}
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-red-600 hover:bg-red-600 flex-1 bg-clr1 hover:text-clr1 p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl font-emb font-bold duration-300"
        >
          TRASH BIN
          <FaTrash />
        </button>
        <button
          onClick={() => navigate("/purchase-premium")}
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-clr6 hover:bg-clr6 flex-1 bg-clr1 hover:text-clr1 p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl font-emb font-bold duration-300"
        >
          BUY PREMIUM
          <BiSolidPurchaseTag />
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-red-700 hover:bg-red-700 flex-1 bg-clr1 hover:text-clr1 p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl font-emb font-bold duration-300"
          onClick={handleLogout}
        >
          LOGOUT <IoLogOut />
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-red-700 hover:bg-red-700 flex-1 bg-clr1 hover:text-clr1 p-1 border-2 cursor-pointer truncate shadow-md hover:shadow-2xl font-emb font-bold duration-300"
          onClick={handleLogout}
        >
          LOGOUT ALL ACCOUNTS <IoLogOut />
        </button>
      </div>
    </div>
  );
}
