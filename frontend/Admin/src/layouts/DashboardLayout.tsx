import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-admin-bg font-sans text-admin-text">
            <Sidebar />

            <main className="pl-64 transition-all duration-300">
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-admin-border bg-admin-surface/95 px-8 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-admin-text">Admin Portal</h2>
                    </div>

                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
