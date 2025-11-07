import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { ErrorContext, UserStorageContext } from "../utils/Contexts";
import { useContext, useState } from "react";
import { calSize } from "../utils/CalculateFileSize";
import { baseURL } from "../src/main";
import { FaUser } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { axiosError } from "../utils/AxiosInstance";

export default function CompUserStorage() {
  const navigate = useNavigate();

  const { userStorage } = useContext(UserStorageContext);
  const [logout, setLogout] = useState(false);
  const { setError } = useContext(ErrorContext);

  async function handleLogout() {
    setLogout(true);
    try {
      const res = await fetch(`${baseURL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/login");
        console.log("User logged out");
        setLogout(false);
      }
    } catch (error) {
      const msg = "Failed to login user";
      axiosError(error, navigate, setError, msg);
      setLogout(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 my-1 mx-auto rounded-sm items-center">
      {/* //* ==========>STORAGE */}
      <div className="w-full flex items-center mx-auto gap-2">
        <div className="bg-black p-[2px] w-[80%] ">
          <div
            className="p-[1px] bg-clrWhite"
            style={{
              width: `${userStorage.size / userStorage.maxStorageInBytes}%`,
            }}
          ></div>
        </div>
        <h1 className="flex items-center justify-center gap-1 truncate duration-300 w-[20%]">
          <span>{calSize(userStorage.size)}</span> of
          <span>{calSize(userStorage.maxStorageInBytes)}</span>
        </h1>
      </div>

      {/* //* ==========>ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
        <button
          onClick={() => navigate("/profile")}
          className="group px-3 border-1 flex justify-between items-center gap-1 h-8 cursor-pointer w-full sm:w-1/2 tracking-wider duration-300 rounded-full"
        >
          <span className="text-sm group-hover:scale-150 duration-150">
            <FaUser />
          </span>
          Profile
        </button>
        <button
          onClick={() => navigate("/bin")}
          className="group px-3 border-1 flex justify-between items-center gap-1 h-8 cursor-pointer w-full sm:w-1/2 tracking-wider duration-300 rounded-full"
        >
          <span className="text-sm group-hover:scale-150 duration-150">
            <FaTrash />
          </span>
          Trash
        </button>
        <button
          onClick={() => navigate("/purchase-premium")}
          className="group px-3 border-1 flex justify-between items-center gap-1 h-8 cursor-pointer w-full sm:w-1/2 tracking-wider duration-300 rounded-full"
        >
          <span className="text-sm group-hover:scale-150 duration-150">
            <BiSolidPurchaseTag />
          </span>
          Buy Premium
        </button>
        <button
          className="group px-3 border-1 flex justify-between items-center gap-1 h-8 cursor-pointer w-full sm:w-1/2 tracking-wider duration-300 rounded-full"
          onClick={handleLogout}
        >
          <span className="text-sm group-hover:scale-150 duration-150">
            <IoLogOut />
          </span>{" "}
          {logout ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
