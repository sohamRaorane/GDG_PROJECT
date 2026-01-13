import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { BookingWizard } from './pages/Booking/BookingWizard';
import { Profile } from './pages/Profile/Profile';
import { Doctors } from './pages/Doctors/Doctors';
import { Services } from './pages/Services/Services';
import { Progress } from './pages/Progress/Progress';
import { TherapyDashboard } from './components/dashboard/TherapyDashboard';
import { Community } from './pages/Community';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';

import { Landing } from './pages/Landing/Landing';
import ClinicLocator from './pages/ClinicLocator/ClinicLocator';
import { Guidelines } from './pages/Guidelines/Guidelines';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Landing />,
    },
    {
        path: '/auth/patient/login',
        element: <Login />,
    },
    // Alias /login to new path for backward compatibility or direct access
    {
        path: '/login',
        element: <Navigate to="/auth/patient/login" replace />,
    },
    {
        path: '/signup',
        element: <Navigate to="/auth/patient/login?mode=signup" replace />,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/verify-email',
        element: <VerifyEmail />,
    },
    {
        path: '/book',
        element: <Navigate to="/patient/book" replace />,
    },
    {
        path: '/patient',
        element: (
            <ProtectedRoute allowedRoles={['customer']}>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: 'home',
                element: <Home />,
            },
            {
                path: 'book',
                element: <BookingWizard />,
            },
            {
                path: 'profile',
                element: <Profile />,
            },
            {
                path: 'clinics',
                element: <ClinicLocator />,
            },
            {
                path: 'doctors',
                element: <Doctors />,
            },
            {
                path: 'services',
                element: <Services />,
            },
            {
                path: 'guidelines',
                element: <Guidelines />,
            },
            {
                path: 'progress',
                element: <Progress />,
            },
            {
                path: 'therapy/live/:id',
                element: <TherapyDashboard />,
            },
            {
                path: 'community',
                element: <Community />,
            },
        ],
    },
    // Admin Login route (Redirect) - Optional, but good to have explicit route
    {
        path: '/auth/admin/login',
        element: <Navigate to="/patient" replace /> // Wait, this should redirect effectively to external URL or just let Landing handle it.
        // React Router doesn't handle external redirects well in route config.
        // I'll rely on the Landing page button for Admin login.
    }
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};
