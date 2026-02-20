import { AppLayout } from "layouts/app-layout";
import { AuthLayout } from "layouts/auth-layout";
import { DashboardPage } from "pages/dashboard";
import { Home } from "pages/home";
import { NotFoundPage } from "pages/not-found";
import { SignInPage } from "pages/sign-in";
import { SignUpPage } from "pages/sign-up";
import { PrivateRoutesProvider } from "providers/private-routes-provider";
import { Navigate, RouteObject, useRouteError } from "react-router-dom";

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
        element: <AppLayout/>,
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
                        index: true,
                        element: <Navigate to={"/auth/sign-in"}/>
                    },
                    {
                        path: "sign-up",
                        element: <SignUpPage/>
                    },
                    {
                        path: "sign-in",
                        element: <SignInPage/>
                    },
                ]
            }, {
                path: "/dashboard",
                element: <PrivateRoutesProvider>
                    <DashboardPage/>
                </PrivateRoutesProvider>
            }
        ]
    }
]