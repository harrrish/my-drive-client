import { useContext } from "react";
import { ErrorContext, UpdateContext } from "../utils/Contexts";
import ModalCreateFolder from "./ModalCreateFolder";

export default function ModalsDiv({
  showCreateFolder,
  setCreateFolder,
  folderID,
  fetchDirectoryData,
  handleDirectoryDetails,
}) {
  const { error } = useContext(ErrorContext);
  const { update } = useContext(UpdateContext);

  return (
    <div>
      {Array.isArray(update) &&
        update.map((u, index) => (
          <h1
            key={index}
            style={{ bottom: `${index * 3 + 2}rem`, right: "0" }}
            className="max-w-1/2 absolute z-50 py-2 px-8 animate-slide bg-clrDarkGreen text-white tracking-wide"
          >
            {u} !
          </h1>
        ))}
      {Array.isArray(error) &&
        error.map((e, index) => (
          <h1
            key={index}
            style={{ top: `${index * 3 + 4}rem`, right: "0" }}
            className="max-w-1/2 absolute z-50 py-2 px-8 animate-slide bg-clrRed text-white tracking-wide"
          >
            {e} !
          </h1>
        ))}
      {showCreateFolder && (
        <ModalCreateFolder
          setCreateFolder={setCreateFolder}
          folderID={folderID}
          fetchDirectoryData={fetchDirectoryData}
          handleDirectoryDetails={handleDirectoryDetails}
        />
      )}
    </div>
  );
}
