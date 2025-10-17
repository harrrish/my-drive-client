import { useState } from "react";
import { FoldersContext } from "../utils/Contexts";

export function FoldersProvider({ children }) {
  const [foldersList, setFoldersList] = useState([]);

  return (
    <FoldersContext.Provider value={{ foldersList, setFoldersList }}>
      {children}
    </FoldersContext.Provider>
  );
}
