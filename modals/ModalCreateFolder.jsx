import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createFolder } from "../utils/DirQueryFunctions";
import {
  ErrorContext,
  ErrorModalContext,
  UpdateContext,
  UserViewContext,
} from "../utils/Contexts.js";
import { handleErrResp } from "../utils/HandleDirError.js";

export default function ModalCreateFolder({
  folderId,
  setCreateFolder,
  fetchDirectoryData,
}) {
  const navigate = useNavigate();
  const [folderName, setFolderName] = useState("");

  const { setUpdate } = useContext(UpdateContext);
  const { setError } = useContext(ErrorContext);
  const { setErrorModal } = useContext(ErrorModalContext);
  const { setUserView } = useContext(UserViewContext);

  useEffect(() => {
    setUserView(false);
  }, [setUserView]);

  const { mutate, isPending } = useMutation({
    mutationFn: createFolder,
    onError: (error) => {
      const { status, message } = error;
      handleErrResp(status, message, setError, setErrorModal, navigate);
    },
    onSuccess: ({ data, status }) => {
      console.log(data.message);
      if (status === 201) {
        setUpdate(`Folder "${folderName}" created !`);
        setFolderName("");
        setCreateFolder(false);
        fetchDirectoryData(folderId);
        setTimeout(() => {
          setUpdate("");
        }, 3000);
      }
    },
  });

  useEffect(() => {
    window.addEventListener("keydown", handleEscClose);
    function handleEscClose(e) {
      if (e.key === "Escape") setCreateFolder(false);
    }
    return () => {
      window.removeEventListener("keydown", handleEscClose);
    };
  }, [setCreateFolder]);

  return (
    <div className="w-full min-h-[100vh] bg-clr3/70 flex items-center justify-center shadow-2xl fixed top-0 left-0 z-10">
      <div className="w-[90%] sm:max-w-2xl bg-clr1 p-4  text-clr3 ">
        <div className="overflow-hidden flex flex-col gap-2">
          <input
            type="text"
            className="w-full px-2 border-2 text-clr3 font-lex tracking-wide"
            placeholder="New Folder"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value);
            }}
          />
          <div className="flex justify-between">
            <button
              onClick={() => mutate({ folderId, folderName })}
              className="bg-clr3 text-clr1 hover:bg-sky-400 font-bebas tracking-widest px-2 w-[45%] cursor-pointer transition-all transition-300"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
            <button
              className="bg-clr3 text-clr1 hover:bg-red-500 font-bebas tracking-widest px-2 w-[45%] cursor-pointer transition-all transition-300"
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
