import { AuthLayout } from "layouts/auth-layout";
import { Home } from "pages/home";
import { NotFoundPage } from "pages/not-found";
import { SignInPage } from "pages/sign-in";
import { SignUpPage } from "pages/sign-up";
import { RouteObject, useRouteError } from "react-router-dom";

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
            },
            {
                path: "/auth",
                element: <AuthLayout/>,
                children: [
                    {
                        path: "sign-up",
                        element: <SignUpPage/>
                    },
                    {
                        path: "sign-in",
                        element: <SignInPage/>
                    },
                ]
            }
        ]
    }
]