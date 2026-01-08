import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-admin-bg font-sans text-admin-text">
            <Sidebar />

            <main className="pl-64 transition-all duration-300">
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-admin-border bg-white px-8">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold text-admin-sidebar">Admin Portal</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-deep-forest text-sm font-medium text-white">
                            AD
                        </div>
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
