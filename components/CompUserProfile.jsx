import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { UserDetailsContext } from "../utils/Contexts";
import { useContext } from "react";
import { calSize } from "../utils/CalculateFileSize";

const baseURL = import.meta.env.VITE_BASE_URL;
export default function CompUserProfile() {
  const navigate = useNavigate();

  const { userDetails } = useContext(UserDetailsContext);
  const { name, email, maxStorageInBytes, usedStorageInBytes } = userDetails;

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
    <div className="w-[98%] flex flex-col gap-2 bg-clr1 shadow-lg text-clr3 my-1 mx-auto p-2 rounded-sm tracking-wider">
      {/* //* STORAGE */}
      <div>
        <div className="p-[2px] bg-clr7 w-full">
          <div
            className="p-[2px] bg-clr1"
            style={{ width: `${usedStorageInBytes / maxStorageInBytes}%` }}
          ></div>
        </div>
      </div>

      {/* //* NAME & EMAIL */}
      <div className="flex sm:flex-row gap-2 w-full items-center">
        <h1
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-clr3 hover:text-clr1 hover:bg-clr4 p-1 truncate font-anton duration-300"
          title={name}
        >
          {name}
        </h1>
        <h1
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-clr3 hover:text-clr1 hover:bg-clr5 p-1 truncate font-anton duration-300"
          title={email}
        >
          {email}
        </h1>
        <h1
          className="w-[90%] text-sm flex items-center justify-center gap-1 text-clr3 hover:text-clr1 hover:bg-clr7 p-1 truncate font-anton duration-300"
          title={`Used ${calSize(usedStorageInBytes)} of ${calSize(
            maxStorageInBytes
          )}`}
        >
          Used <span>{calSize(usedStorageInBytes)}</span> of{" "}
          <span>{calSize(maxStorageInBytes)}</span>
        </h1>
      </div>

      {/* //* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
        <button className="w-[90%] text-lg flex items-center justify-center gap-1 text-clr1 hover:bg-clr7 flex-1 hover:text-clr1 bg-clr3 p-1 cursor-pointer truncate rounded-sm font-bebas duration-300">
          BUY PREMIUM
          <BiSolidPurchaseTag />
        </button>
        <button
          className="w-[90%] text-lg flex items-center justify-center gap-1 text-clr1 hover:bg-red-600 flex-1 hover:text-clr1 bg-clr3 p-1 cursor-pointer truncate rounded-sm font-bebas duration-300"
          onClick={handleLogout}
        >
          Logout <IoLogOut />
        </button>
      </div>
    </div>
  );
}
