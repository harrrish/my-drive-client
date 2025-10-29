import { FaGoogleDrive } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { TiUserAdd } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="font-google font-medium min-h-screen bg-clrGray flex items-center">
      <div className="bg-clrWhite w-[90%] sm:max-w-xl mx-auto flex flex-col gap-2 items-center p-4 rounded-sm shadow-lg hover:shadow-2xl duration-300">
        <h1 className="flex items-center text-4xl gap-2">
          <span>
            <FaGoogleDrive />
          </span>
          My Drive
        </h1>
        <p className="text-center">
          My Drive is a cloud storage web application inspired by Google Drive,
          users can efficiently manage their personal files and folders online.
        </p>
        <p className="text-center">
          Users can upload, download, view, rename, and delete their files with
          ease, as well as organize them into custom folders for better
          accessibility and structure.
        </p>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => navigate("/login")}
            className="border-2 p-1 flex justify-center items-center gap-1 cursor-pointer w-1/2 hover:text-white hover:bg-clrLightBlue tracking-wider font-bold duration-300"
          >
            <span>
              <MdLogin />
            </span>
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="border-2 p-1 flex justify-center items-center gap-1 cursor-pointer w-1/2 hover:text-white hover:bg-clrLightGreen tracking-wider font-bold duration-300"
          >
            <span>
              <TiUserAdd />
            </span>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
}
