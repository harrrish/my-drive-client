import { useState } from "react";
import { UserStorageContext } from "../utils/Contexts";

export function UserStorageProvider({ children }) {
  const [userStorage, setUserStorage] = useState({
    maxStorageInBytes: 0,
    size: 0,
  });

  return (
    <UserStorageContext.Provider value={{ userStorage, setUserStorage }}>
      {children}
    </UserStorageContext.Provider>
  );
}
