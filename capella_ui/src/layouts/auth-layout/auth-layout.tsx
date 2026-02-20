import { useAuth } from "auth";
import { Navigate, Outlet } from "react-router-dom";
export function AuthLayout() {
    const { token } = useAuth()

    if(token) {
        return <Navigate to={"/dashboard"} replace/>
    }

    return (
        <div className="flex-1 flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 p-4">
            <div className="w-full max-w-md">
                <Outlet/>
            </div>
        </div>
    );
}
