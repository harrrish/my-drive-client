import { useState } from "react";
import { FolderCountContext } from "../utils/Contexts";

export function FolderCountProvider({ children }) {
  const [foldersCount, setFoldersCount] = useState(0);

  return (
    <FolderCountContext.Provider value={{ foldersCount, setFoldersCount }}>
      {children}
    </FolderCountContext.Provider>
  );
}
