import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import ActiveTherapies from "./pages/ActiveTherapies";
import TherapyControl from "./pages/TherapyControl";
import DoctorDashboard from "./pages/DoctorDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardHome />} />
                <Route path="doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="active-therapies" element={<ActiveTherapies />} />
                <Route path="active-therapies/:id" element={<TherapyControl />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
