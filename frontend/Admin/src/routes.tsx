import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports.tsx";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import ActiveTherapies from "./pages/ActiveTherapies";
import TherapyControl from "./pages/TherapyControl";
import DoctorDashboard from "./pages/DoctorDashboard";
import CommunityManagement from "./pages/CommunityManagement";
import Settings from "./pages/Settings";
import DoctorStatus from "./pages/DoctorStatus";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
                <ProtectedRoute allowedRoles={['admin', 'doctor']}>
                    <DashboardLayout />
                </ProtectedRoute>
            }>
                <Route index element={<DashboardHome />} />
                <Route path="doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<Appointments />} />
                <Route path="reports" element={<Reports />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="active-therapies" element={<ActiveTherapies />} />
                <Route path="doctor-status" element={<DoctorStatus />} />
                <Route path="active-therapies/:id" element={<TherapyControl />} />
                <Route path="community" element={<CommunityManagement />} />
                <Route path="settings" element={<Settings />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
