import { useState } from "react";
import { FolderIDContext } from "../utils/Contexts";

export function FolderIDProvider({ children }) {
  const [folderID, setFolderID] = useState("");

  return (
    <FolderIDContext.Provider value={{ folderID, setFolderID }}>
      {children}
    </FolderIDContext.Provider>
  );
}
