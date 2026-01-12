import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import type { UserRole } from '../types/db';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { currentUser, userProfile, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    console.log("DEBUG: ProtectedRoute Check", { 
        email: currentUser.email, 
        role: userProfile?.role, 
        allowed: allowedRoles 
    });

    if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
        return <div className="flex flex-col justify-center items-center h-screen text-red-500 gap-4">
            <h2 className="text-xl font-bold">Access Denied: Insufficient Permissions</h2>
            <p>Your Role: <span className="font-mono bg-red-100 px-2 py-1 rounded">{userProfile.role || 'None'}</span></p>
            <p>Allowed Roles: <span className="font-mono bg-green-100 px-2 py-1 rounded">{allowedRoles.join(', ')}</span></p>
            <button onClick={() => window.location.href = 'http://localhost:5173/'} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Go to Patient Home
            </button>
        </div>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
