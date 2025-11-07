import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserSettingViewContext } from "../utils/Contexts";
import { RiUserSettingsFill } from "react-icons/ri";
import { FaGoogleDrive } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import CompUserStorage from "./UserStorageDiv";
import { AiOutlineUserSwitch } from "react-icons/ai";

export default function CompNavbar() {
  const navigate = useNavigate();
  const { userView, setUserView } = useContext(UserSettingViewContext);

  return (
    <nav className="flex flex-col justify-between w-[95%] rounded-sm sm:max-w-3xl md:max-w-4xl mx-auto transition-all duration-300 bg-white shadow-sm hover:shadow-lg p-2">
      <div className="flex justify-between items-center">
        {/* //* ==========>TITLE */}
        <button
          className="text-3xl py-1 cursor-pointer outline-0 flex gap-2 items-center w-[85%]"
          title="Home Page"
          onClick={() => navigate("/directory")}
        >
          <span className="text-3xl">
            <FaGoogleDrive />
          </span>
          <span className="text-xl hover:scale-110 duration-300">My Drive</span>
        </button>

        <div className="w-[30%] flex justify-between gap-8">
          {/* //* ==========>SHARED FILE */}
          <button
            className="cursor-pointer text-2xl hover:scale-125 duration-300"
            title="User settings"
          >
            <AiOutlineUserSwitch />
          </button>
          {/* //* ==========>NOTIFICATIONS */}
          <button
            className="group cursor-pointer text-2xl relative"
            title="User notifications"
          >
            <IoIosNotifications />{" "}
            <span className="text-sm absolute top-[-10px] left-[-10] bg-black text-white px-2 rounded-full group-hover:scale-115 duration-300">
              0
            </span>
          </button>
          {/* //* ==========>SETTINGS */}
          <button
            onClick={() => setUserView((prev) => !prev)}
            className="cursor-pointer text-2xl hover:scale-125 duration-300"
            title="User settings"
          >
            <RiUserSettingsFill />
          </button>
        </div>
      </div>

      {userView && (
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            userView ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <CompUserStorage />
        </div>
      )}
    </nav>
  );
}
