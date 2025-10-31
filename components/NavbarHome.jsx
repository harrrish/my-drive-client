import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserSettingViewContext } from "../utils/Contexts";
import { RiUserSettingsFill } from "react-icons/ri";
import { FaGoogleDrive } from "react-icons/fa";
import CompUserStorage from "./UserStorageDiv";

export default function CompNavbar() {
  const navigate = useNavigate();
  const { userView, setUserView } = useContext(UserSettingViewContext);

  return (
    <nav className="flex flex-col justify-between w-[95%] rounded-sm sm:max-w-3xl md:max-w-4xl mx-auto transition-all duration-300 bg-white shadow-sm hover:shadow-lg p-2">
      <div className="flex justify-between items-center">
        {/* //* ==========>TITLE */}
        <button
          className="text-3xl py-1 cursor-pointer outline-0 flex gap-1 items-center"
          title="Home Page"
          onClick={() => navigate("/directory")}
        >
          <span className="text-2xl">
            <FaGoogleDrive />
          </span>
          My Drive
        </button>

        {/* //* ==========>SETTINGS */}
        <button
          onClick={() => setUserView((prev) => !prev)}
          className="cursor-pointer text-3xl"
          title="User settings"
        >
          <RiUserSettingsFill />
        </button>
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
