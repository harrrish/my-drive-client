import { useState } from "react";
import { PathContext } from "../utils/Contexts";

export function PathProvider({ children }) {
  const [path, setPath] = useState([]);

  return (
    <PathContext.Provider value={{ path, setPath }}>
      {children}
    </PathContext.Provider>
  );
}
