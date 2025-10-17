import { useState } from "react";
import { FilesContext } from "../utils/Contexts";

export function FilesProvider({ children }) {
  const [filesList, setFilesList] = useState([]);

  return (
    <FilesContext.Provider value={{ filesList, setFilesList }}>
      {children}
    </FilesContext.Provider>
  );
}
