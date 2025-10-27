import { useState, useContext } from "react";
import { ErrorContext, UpdateContext } from "../utils/Contexts.js";
import { axiosError, axiosWithCreds } from "../utils/AxiosInstance.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ModalCreateFolder({
  folderID,
  setCreateFolder,
  handleDirectoryDetails,
}) {
  const [folderName, setFolderName] = useState("");

  const { setUpdate } = useContext(UpdateContext);
  const { setError } = useContext(ErrorContext);
  const navigate = useNavigate();

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
        const msg = "Failed to create folder";
        axiosError(error, navigate, setError, msg);
      }
    }
  }

  return (
    <div className="w-full min-h-[100vh] flex items-center justify-center shadow-2xl fixed top-0 left-0 z-10">
      <div className="w-[90%] sm:max-w-2xl p-4 rounded-sm  ">
        <div className="overflow-hidden flex flex-col gap-2">
          <input
            type="text"
            className="w-full px-2 border-2    rounded-sm"
            placeholder="New Folder"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
          />
          <div className="flex justify-between">
            <button
              onClick={handleCreateFolder}
              className=" border-2 focus: rounded-sm   focus:   px-2 w-[45%] cursor-pointer transition-all transition-300"
            >
              Create
            </button>
            <button
              className=" border-2 focus:  focus: rounded-sm    px-2 w-[45%] cursor-pointer transition-all transition-300"
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
