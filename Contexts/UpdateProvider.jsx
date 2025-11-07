import { useState } from "react";
import { UpdateContext } from "../utils/Contexts";

export function UpdateProvider({ children }) {
  const [update, setUpdate] = useState([]);

  return (
    <UpdateContext.Provider value={{ update, setUpdate }}>
      {children}
    </UpdateContext.Provider>
  );
}
