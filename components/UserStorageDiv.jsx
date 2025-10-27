import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { UserStorageContext } from "../utils/Contexts";
import { useContext } from "react";
import { calSize } from "../utils/CalculateFileSize";
import { baseURL } from "../src/main";
import { FaUser } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

export default function CompUserStorage() {
  const navigate = useNavigate();

  const { userStorage } = useContext(UserStorageContext);

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

  return (
    <div className="w-[95%] flex flex-col gap-2 shadow-lg  my-1 mx-auto p-2 rounded-sm  items-center">
      {/* //* ==========>STORAGE */}
      <div className="w-full flex items-center mx-auto">
        <div className="bg-black p-[2px] w-[85%]">
          <div
            className="p-[2px] bg-white"
            style={{
              width: `${
                userStorage.size || 0 / userStorage.maxStorageInBytes || 0
              }%`,
            }}
          ></div>
        </div>
        <h1 className="flex items-center justify-center gap-1 truncate duration-300 w-[15%]">
          <span>{calSize(userStorage.size)}</span> of
          <span>{calSize(userStorage.maxStorageInBytes)}</span>
        </h1>
      </div>

      {/* //* ==========>ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
        <button
          onClick={() => navigate("/profile")}
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  border-2 p-1 cursor-pointer truncate rounded-sm   duration-300"
        >
          Profile
          <FaUser />
        </button>
        <button
          onClick={() => navigate("/bin")}
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  border-2 p-1 cursor-pointer truncate rounded-sm   duration-300"
        >
          Trash
          <FaTrash />
        </button>
        <button
          onClick={() => navigate("/purchase-premium")}
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  border-2 p-1 cursor-pointer truncate rounded-sm   duration-300"
        >
          Buy Premium
          <BiSolidPurchaseTag />
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-center gap-1   flex-1  border-2 p-1 cursor-pointer truncate rounded-sm   duration-300"
          onClick={handleLogout}
        >
          Logout <IoLogOut />
        </button>
      </div>
    </div>
  );
}
