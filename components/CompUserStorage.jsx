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
      console.log("User logged OUT !");
    }
  }

  return (
    <div className="w-[95%] flex flex-col gap-2 bg-clr1 shadow-lg text-clr3 my-1 mx-auto p-2 rounded-sm tracking-wider items-center">
      {/* //* ==========>STORAGE */}
      <div className="w-full">
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
      </div>

      {/* //* ==========>ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
        <button
          onClick={() => navigate("/profile")}
          className="w-[90%] text-sm flex items-center justify-center gap-1 bg-gray-200 hover:bg-clr7 text-clr7 flex-1 hover:text-clr1 border-2 p-1 cursor-pointer truncate rounded-sm font-emb font-extrabold duration-300"
        >
          Profile
          <FaUser />
        </button>
        <button
          onClick={() => navigate("/bin")}
          className="w-[90%] text-sm flex items-center justify-center gap-1 bg-gray-200 hover:bg-red-600 text-red-600 flex-1 hover:text-clr1 border-2 p-1 cursor-pointer truncate rounded-sm font-emb font-extrabold duration-300"
        >
          Trash
          <FaTrash />
        </button>
        <button
          onClick={() => navigate("/purchase-premium")}
          className="w-[90%] text-sm flex items-center justify-center gap-1 bg-gray-200 hover:bg-clr6 text-clr6 flex-1 hover:text-clr1 border-2 p-1 cursor-pointer truncate rounded-sm font-emb font-extrabold duration-300"
        >
          Buy Premium
          <BiSolidPurchaseTag />
        </button>
        <button
          className="w-[90%] text-sm flex items-center justify-center gap-1 bg-gray-200 hover:bg-red-700 text-red-700 flex-1 hover:text-clr1 border-2 p-1 cursor-pointer truncate rounded-sm font-emb font-extrabold duration-300"
          onClick={handleLogout}
        >
          Logout <IoLogOut />
        </button>
      </div>
    </div>
  );
}
