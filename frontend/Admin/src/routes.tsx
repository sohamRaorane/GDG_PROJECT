import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<UserManagement />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
