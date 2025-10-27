import { FaGoogleDrive } from "react-icons/fa";
import { VscSignIn } from "react-icons/vsc";

export default function CompLoginNav() {
  return (
    <div className="flex flex-col gap-2 font-bold">
      <h2 className="flex items-center gap-1 font-google font-bold">
        <span className="text-4xl">
          <FaGoogleDrive />
        </span>
        <span className="text-4xl">My Drive</span>
      </h2>
      <h2 className="flex items-center gap-1 font-google">
        <span className="text-3xl">
          <VscSignIn />
        </span>
        <span className="text-3xl">Login to your account !</span>
      </h2>
    </div>
  );
}
