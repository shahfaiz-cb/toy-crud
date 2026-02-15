import React from "react";
import ReactDOM from "react-dom/client"
import './app.css'
import { createBrowserRouter } from "react-router-dom";
import { routes } from "./routing/routes";
import { RouterProvider } from "react-router";

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
)