import { useState } from "react";
import { ListViewContext } from "../utils/Contexts";

export function ListViewProvider({ children }) {
  const [listView, setListView] = useState(true);

  return (
    <ListViewContext.Provider value={{ listView, setListView }}>
      {children}
    </ListViewContext.Provider>
  );
}
