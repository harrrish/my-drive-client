import { FaGoogleDrive } from "react-icons/fa";
import { RiUserAddFill } from "react-icons/ri";

export default function CompRegisterNav() {
  return (
    <div className="flex flex-col gap-2 font-bold">
      <h2 className="flex items-center gap-1 font-google">
        <span className="text-4xl">
          <FaGoogleDrive />
        </span>
        <span className="text-4xl">My Drive</span>
      </h2>
      <h2 className="flex items-center gap-1 font-google">
        <span className="text-3xl">
          <RiUserAddFill />
        </span>
        <span className="text-3xl">Create an account !</span>
      </h2>
    </div>
  );
}
