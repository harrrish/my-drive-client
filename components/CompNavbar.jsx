import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import CompUserProfile from "./CompUserProfile";
import { UserDetailsContext, UserViewContext } from "../utils/Contexts";

export default function CompNavbar() {
  const navigate = useNavigate();

  const { userDetails } = useContext(UserDetailsContext);
  const { userView, setUserView } = useContext(UserViewContext);

  return (
    <nav className="flex flex-col justify-between w-full sm:max-w-4xl mx-auto  transition-all duration-300">
      <div className="flex justify-between items-center p-2">
        {/* //* TITLE */}
        <button
          className="font-anton uppercase text-3xl px-4 py-0.5 cursor-pointer tracking-wider rounded-sm shadow-black shadow-sm hover:shadow-md transition-all duration-500 bg-clr7 text-clr1"
          title="Home"
          onClick={() => navigate("/")}
        >
          My Drive
        </button>

        {/* //* PROFILE ICON */}
        <button
          onClick={() => setUserView((prev) => !prev)}
          className="cursor-pointer border-clr2 hover:border-clr3 duration-300 outline-none h-12"
          title="Settings"
        >
          <img
            src={
              userDetails.picture ||
              "https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
            }
            alt={`${userDetails.name}'s picture`}
            title={`${userDetails.name}'s profile picture`}
            className="w-[50px] h-[50px] rounded-full object-cover object-center"
          />
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          userView ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CompUserProfile />
      </div>
    </nav>
  );
}
