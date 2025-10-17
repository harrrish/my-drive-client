import { useState } from "react";
import { UserDetailsContext } from "../utils/Contexts";

export function UserDetailsProvider({ children }) {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    picture: "",
    usedStorageInBytes: "",
    maxStorageInBytes: "",
  });

  return (
    <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </UserDetailsContext.Provider>
  );
}
