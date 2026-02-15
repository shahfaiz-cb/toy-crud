import { RouteObject, useRouteError } from "react-router-dom";
import { NotFoundPage } from "../pages/not-found";
import { Home } from "../pages/home";

function TopLevelErrorBoundary() {
    const error = useRouteError()

    if((error as Response).status === 404) {
        return <NotFoundPage/>
    }
    return <div>An Error occured...</div>
}

export const routes: RouteObject[] = [
    {
        errorElement: (
            <TopLevelErrorBoundary/>
        ),
        path: "/",
        children: [
            {
                index:true,
                element: <Home/>,
            }
        ]
    }
]