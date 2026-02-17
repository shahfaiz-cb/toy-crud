import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
export function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 p-4">
            <div className="w-full max-w-md">
                <Outlet/>
            </div>
        </div>
    );
}
