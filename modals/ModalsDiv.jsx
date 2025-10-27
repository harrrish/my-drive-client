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
      {update && (
        <h1 className="absolute bottom-10 z-50 right-0 py-2 px-8   animate-slide ">
          {update} !
        </h1>
      )}
      {error && (
        <h1 className="absolute bottom-10 z-50  right-0 py-2 px-8   animate-slide ">
          {error} !
        </h1>
      )}
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
