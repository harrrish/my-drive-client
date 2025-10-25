import { useState } from "react";
import { UserSettingViewContext } from "../utils/Contexts";

export function UserSettingViewProvider({ children }) {
  const [userView, setUserView] = useState(false);

  return (
    <UserSettingViewContext.Provider value={{ userView, setUserView }}>
      {children}
    </UserSettingViewContext.Provider>
  );
}
