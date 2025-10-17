import App from "./App.jsx";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorModalProvider } from "../Contexts/ErrorModalProvider.jsx";
import { ErrorProvider } from "../Contexts/ErrorProvider.jsx";
import { FileCountProvider } from "../Contexts/FilesCountProvider.jsx";
import { FilesProvider } from "../Contexts/FilesProvider.jsx";
import { FolderCountProvider } from "../Contexts/FolderCountProvider.jsx";
import { FoldersProvider } from "../Contexts/FoldersProvider.jsx";
import { PathProvider } from "../Contexts/PathProvider.jsx";
import { UpdateProvider } from "../Contexts/UpdateProvider.jsx";
import { UserDetailsProvider } from "../Contexts/UserDetailsProvider.jsx";
import { UserViewProvider } from "../Contexts/UserViewContext.jsx";
import { ListViewProvider } from "../Contexts/ListViewProvider.jsx";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_Id;

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
        <ListViewProvider>
          <UserViewProvider>
            <UserDetailsProvider>
              <UpdateProvider>
                <PathProvider>
                  <FoldersProvider>
                    <FolderCountProvider>
                      <FilesProvider>
                        <FileCountProvider>
                          <ErrorProvider>
                            <ErrorModalProvider>
                              <App />
                            </ErrorModalProvider>
                          </ErrorProvider>
                        </FileCountProvider>
                      </FilesProvider>
                    </FolderCountProvider>
                  </FoldersProvider>
                </PathProvider>
              </UpdateProvider>
            </UserDetailsProvider>
          </UserViewProvider>
        </ListViewProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
