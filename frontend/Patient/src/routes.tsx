import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home/Home';
import { BookingWizard } from './pages/Booking/BookingWizard';
import { Profile } from './pages/Profile/Profile';
import { Doctors } from './pages/Doctors/Doctors';
import { Services } from './pages/Services/Services';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
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
        ],
    },
]);

export const AppRoutes = () => {
    return <RouterProvider router={router} />;
};
