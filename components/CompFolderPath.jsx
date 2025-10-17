import { useNavigate } from "react-router-dom";
import { IoMdArrowDropright } from "react-icons/io";
import { PathContext } from "../utils/Contexts";
import { useContext } from "react";

export default function CompFolderPath() {
  const { path } = useContext(PathContext);

  const navigate = useNavigate();
  return (
    <div className="bg-clr7 w-[95%] sm:max-w-3xl mx-auto px-2 font-staat tracking-wider shadow-md hover:shadow-2xl duration-300 rounded-sm h-10 flex items-center overflow-x-auto cursor-grab select-none custom-scrollbar">
      <div className="flex gap-1 items-center whitespace-nowrap">
        {path.map((p, index) => (
          <div key={p.id} className="flex items-center gap-1">
            <button
              className="text-md truncate max-w-[150px] hover:underline cursor-pointer select-none"
              onClick={() => navigate(`/directory/${p.id}`)}
              title={p.name.includes("root") ? p.name.split("-")[0] : p.name}
            >
              {p.name.includes("root") ? p.name.split("-")[0] : p.name}
            </button>
            {index !== path.length - 1 && (
              <span className="text-xl flex-shrink-0">
                <IoMdArrowDropright />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
