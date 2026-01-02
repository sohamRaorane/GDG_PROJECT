import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { BookingWizard } from './pages/Booking/BookingWizard';
import { Profile } from './pages/Profile/Profile';
import { Doctors } from './pages/Doctors/Doctors';
import { Services } from './pages/Services/Services';
import { Progress } from './pages/Progress/Progress';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';

import { Landing } from './pages/Landing/Landing';

const router = createBrowserRouter([
    {
        path: '/landing',
        element: <Landing />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
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
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true,
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
                path: 'doctors',
                element: <Doctors />,
            },
            {
                path: 'services',
                element: <Services />,
            },
            {
                path: 'progress',
                element: <Progress />,
            },
        ],
    },
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};
