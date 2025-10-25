import EmptyFolder from "/images/empty-folder.png";
import { LuFiles } from "react-icons/lu";
import { FaFolder } from "react-icons/fa6";

export default function CompEmptyFolder() {
  return (
    <div className="mt-25">
      <img className="block w-[100px] mx-auto bg-" src={EmptyFolder} />
      <h1 className="w-[90%] sm:max-w-lg mx-auto  font-emb font-bold tracking-wider py-1  flex items-center gap-1 justify-center text-center text-clr3 ">
        No <LuFiles /> or <FaFolder /> to be found in this folder !
      </h1>
    </div>
  );
}
