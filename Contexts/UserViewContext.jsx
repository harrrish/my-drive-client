import { useState } from "react";
import { UserViewContext } from "../utils/Contexts";

export function UserViewProvider({ children }) {
  const [userView, setUserView] = useState(false);

  return (
    <UserViewContext.Provider value={{ userView, setUserView }}>
      {children}
    </UserViewContext.Provider>
  );
}
