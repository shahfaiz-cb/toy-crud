import { Navbar } from "components/navbar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar/>
            <div className="flex-1 flex">
                <Outlet/>
            </div>
        </div>
    )
}