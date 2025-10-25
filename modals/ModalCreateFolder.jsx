import { useState, useContext } from "react";
import { ErrorContext, UpdateContext } from "../utils/Contexts.js";
import { axiosWithCreds } from "../utils/AxiosInstance.js";
import axios from "axios";

export default function ModalCreateFolder({
  folderID,
  setCreateFolder,
  handleDirectoryDetails,
}) {
  const [folderName, setFolderName] = useState("");

  const { setUpdate } = useContext(UpdateContext);
  const { setError } = useContext(ErrorContext);

  async function handleCreateFolder() {
    if (!folderName.trim()) {
      setError("Please provide a valid folder name");
      setTimeout(() => setError(""), 3000);
    } else {
      try {
        const { data, status } = await axiosWithCreds.post(
          `/directory/${folderID || ""}`,
          {
            folderName,
          }
        );
        if (status === 201) {
          setUpdate(data.message);
          setTimeout(() => setUpdate(""), 3000);
          setCreateFolder(false);
          handleDirectoryDetails(folderID);
        }
      } catch (error) {
        const errMsg = axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to create folder"
          : "Something went wrong";
        setError(errMsg);
        setTimeout(() => setError(""), 3000);
      }
    }
  }

  return (
    <div className="w-full min-h-[100vh] bg-clr3/80 flex items-center justify-center shadow-2xl fixed top-0 left-0 z-10">
      <div className="w-[90%] sm:max-w-2xl bg-clr1 p-4 rounded-sm text-clr3 ">
        <div className="overflow-hidden flex flex-col gap-2">
          <input
            type="text"
            className="w-full px-2 border-2 text-clr3 font-emb font-bold rounded-sm"
            placeholder="New Folder"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
          />
          <div className="flex justify-between">
            <button
              onClick={handleCreateFolder}
              className="text-clr5 bg-clr1 border-2 focus:bg-clr5 rounded-sm hover:bg-clr5 hover:text-clr1 focus:text-clr1 font-emb font-bold px-2 w-[45%] cursor-pointer transition-all transition-300"
            >
              Create
            </button>
            <button
              className="text-red-500 bg-clr1 border-2 focus:bg-red-500 hover:text-clr1 focus:text-clr1 rounded-sm hover:bg-red-500 font-emb font-bold px-2 w-[45%] cursor-pointer transition-all transition-300"
              onClick={() => setCreateFolder(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
