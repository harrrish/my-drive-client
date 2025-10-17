import { useState } from "react";
import { ErrorModalContext } from "../utils/Contexts";

export function ErrorModalProvider({ children }) {
  const [errorModal, setErrorModal] = useState(false);

  return (
    <ErrorModalContext.Provider value={{ errorModal, setErrorModal }}>
      {children}
    </ErrorModalContext.Provider>
  );
}
