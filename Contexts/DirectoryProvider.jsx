import { useState } from "react";
import { DirectoryContext } from "../utils/Contexts";

export function DirectoryProvider({ children }) {
  const [directoryDetails, setDirectoryDetails] = useState({
    files: [],
    folders: [],
    path: [],
    filesCount: 0,
    foldersCount: 0,
  });

  return (
    <DirectoryContext.Provider
      value={{ directoryDetails, setDirectoryDetails }}
    >
      {children}
    </DirectoryContext.Provider>
  );
}
