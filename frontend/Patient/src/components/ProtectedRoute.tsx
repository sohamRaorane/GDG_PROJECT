import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import type { UserRole } from '../types/db';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { currentUser, userRole, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/auth/patient/login" replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // Option: Redirect to unauthorized page or show message
        // For now, if they are logged in but wrong role (e.g. admin trying to access patient dashboard),
        // we might want to redirect them to the landing page or their own dashboard (if applicable).
        // However, since this is the Patient App, we'll redirect to landing or show unauthorized.

        return <Navigate to="/" replace />;
    }

    // If role is not yet loaded but user is, we might want to wait? 
    // userRole is loaded in AuthContext effectively. 
    // If userRole is null but currentUser is set, it might mean profile doesn't exist yet (signup flow)
    // or fetch failed.

    return <>{children}</>;
};

export default ProtectedRoute;
