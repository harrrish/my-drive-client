import { useState } from "react";
import { ErrorContext } from "../utils/Contexts";

export function ErrorProvider({ children }) {
  const [error, setError] = useState([]);

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}
