import { useContext } from "react";
import {
  ErrorContext,
  ErrorModalContext,
  UpdateContext,
} from "../utils/Contexts";
import ModalCreateFolder from "./ModalCreateFolder";
import ModalUserSessionErr from "./ModalUserSessionErr";

export default function ModalsDiv({
  showCreateFolder,
  setCreateFolder,
  folderID,
  fetchDirectoryData,
  handleDirectoryDetails,
}) {
  const { error } = useContext(ErrorContext);
  const { update } = useContext(UpdateContext);
  const { errorModal } = useContext(ErrorModalContext);

  return (
    <div>
      {update && (
        <h1 className="absolute bottom-10 bg-clr5 text-clr1 z-50 right-0 py-2 px-8 font-emb font-bold animate-slide tracking-wider">
          {update} !
        </h1>
      )}
      {error && (
        <h1 className="absolute bottom-10 bg-red-600 z-50 text-clr1 right-0 py-2 px-8 font-emb font-bold animate-slide tracking-wider">
          {error} !
        </h1>
      )}
      {errorModal && <ModalUserSessionErr />}
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
