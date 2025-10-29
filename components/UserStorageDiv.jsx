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
    <div className="flex flex-col gap-2 my-1 mx-auto rounded-sm items-center">
      {/* //* ==========>STORAGE */}
      <div className="w-[80%] flex items-center mx-auto gap-2">
        <div className="bg-clrLightBlue p-[2px] w-[80%] ">
          <div
            className="p-[2px] bg-clrWhite"
            style={{
              width: `${
                userStorage.size || 0 / userStorage.maxStorageInBytes || 0
              }%`,
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
          className="font-medium border-2 flex justify-center items-center gap-1 cursor-pointer w-1/2 hover:text-white hover:bg-clrLightBlue tracking-wider hover:font-bold duration-300"
        >
          Profile
          <FaUser />
        </button>
        <button
          onClick={() => navigate("/bin")}
          className="font-medium border-2 flex justify-center items-center gap-1 cursor-pointer w-1/2 hover:text-white hover:bg-clrLightBlue tracking-wider hover:font-bold duration-300"
        >
          Trash
          <FaTrash />
        </button>
        <button
          onClick={() => navigate("/purchase-premium")}
          className="font-medium border-2 flex justify-center items-center gap-1 cursor-pointer w-1/2 hover:text-white hover:bg-clrLightBlue tracking-wider hover:font-bold duration-300"
        >
          Buy Premium
          <BiSolidPurchaseTag />
        </button>
        <button
          className="font-medium border-2 flex justify-center items-center gap-1 cursor-pointer w-1/2 hover:text-white hover:bg-clrLightBlue tracking-wider hover:font-bold duration-300"
          onClick={handleLogout}
        >
          Logout <IoLogOut />
        </button>
      </div>
    </div>
  );
}
