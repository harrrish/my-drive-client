import App from "./App.jsx";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FolderIDProvider } from "../Contexts/FolderIDProvider.jsx";

import { ErrorModalProvider } from "../Contexts/ErrorModalProvider.jsx";

import { ErrorProvider } from "../Contexts/ErrorProvider.jsx";
import { UpdateProvider } from "../Contexts/UpdateProvider.jsx";

import { UserDetailsProvider } from "../Contexts/UserDetailsProvider.jsx";
import { UserStorageProvider } from "../Contexts/UserStorageProvider.jsx";

import { DirectoryProvider } from "../Contexts/DirectoryProvider.jsx";

import { UserSettingViewProvider } from "../Contexts/UserSettingViewProvider.jsx";
import { ListViewProvider } from "../Contexts/ListViewProvider.jsx";

import { FileCountProvider } from "../Contexts/FilesCountProvider.jsx";
import { FilesProvider } from "../Contexts/FilesProvider.jsx";
import { FolderCountProvider } from "../Contexts/FolderCountProvider.jsx";
import { FoldersProvider } from "../Contexts/FoldersProvider.jsx";
import { PathProvider } from "../Contexts/PathProvider.jsx";

export const clientId = import.meta.env.VITE_GOOGLE_CLIENT_Id;
export const baseURL = import.meta.env.VITE_BASE_URL;

if (import.meta.env.VITE_ENV === "development") {
  console.log({ baseURL });
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 2 * 5 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        {/* //* ===================> Delete */}
        <PathProvider>
          <FoldersProvider>
            <FolderCountProvider>
              <FilesProvider>
                <FileCountProvider>
                  {/* //* ===================> Delete */}
                  <ListViewProvider>
                    <UserSettingViewProvider>
                      <DirectoryProvider>
                        <UserStorageProvider>
                          <UserDetailsProvider>
                            <UpdateProvider>
                              <ErrorProvider>
                                <ErrorModalProvider>
                                  <FolderIDProvider>
                                    <App />
                                  </FolderIDProvider>
                                </ErrorModalProvider>
                              </ErrorProvider>
                            </UpdateProvider>
                          </UserDetailsProvider>
                        </UserStorageProvider>
                      </DirectoryProvider>
                    </UserSettingViewProvider>
                  </ListViewProvider>
                  {/* //* ===================> Delete */}
                </FileCountProvider>
              </FilesProvider>
            </FolderCountProvider>
          </FoldersProvider>
        </PathProvider>
        {/* //* ===================> Delete */}
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
