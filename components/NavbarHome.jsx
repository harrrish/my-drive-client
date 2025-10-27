import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserSettingViewContext } from "../utils/Contexts";
import { RiUserSettingsFill } from "react-icons/ri";
import CompUserStorage from "./UserStorageDiv";

export default function CompNavbar() {
  const navigate = useNavigate();

  const { userView, setUserView } = useContext(UserSettingViewContext);

  return (
    <nav className="flex flex-col justify-between w-full sm:max-w-6xl mx-auto transition-all duration-300">
      <div className="flex justify-between items-center p-2">
        {/* //* ==========>TITLE */}
        <button
          className=" text-3xl px-4 py-1 cursor-pointer outline-0"
          title="Home"
          onClick={() => navigate("/")}
        >
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
