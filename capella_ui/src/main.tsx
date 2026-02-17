import React from "react";
import ReactDOM from "react-dom/client"
import './app.css'
import { createBrowserRouter } from "react-router-dom";
import { routes } from "routing/routes";
import { RouterProvider } from "react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persistOptions, queryClient } from "utils/react-query";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            <Toaster />
            <RouterProvider router={router}/>
        </PersistQueryClientProvider>
    </React.StrictMode>
)