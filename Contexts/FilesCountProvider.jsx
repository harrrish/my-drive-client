import { useState } from "react";
import { FileCountContext } from "../utils/Contexts";

export function FileCountProvider({ children }) {
  const [filesCount, setFilesCount] = useState(0);

  return (
    <FileCountContext.Provider value={{ filesCount, setFilesCount }}>
      {children}
    </FileCountContext.Provider>
  );
}
