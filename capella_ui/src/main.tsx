import React from "react";
import ReactDOM from "react-dom/client"
import './app.css'
import { createBrowserRouter } from "react-router-dom";
import { routes } from "routing/routes";
import { RouterProvider } from "react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persistOptions, queryClient } from "utils/react-query";
import { AuthProvider } from "auth";
import { SSEProvider } from "providers/sse-provider";
import { Toast } from "@heroui/react";

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <AuthProvider>
            <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
                <SSEProvider>
                    <Toast.Provider placement="top"/>
                    <RouterProvider router={router}/>
                </SSEProvider>
            </PersistQueryClientProvider>
        </AuthProvider>
    </React.StrictMode>
)