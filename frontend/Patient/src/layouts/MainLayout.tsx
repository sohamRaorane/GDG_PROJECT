
import { Outlet, Link } from 'react-router-dom';
import { User, Menu } from 'lucide-react';

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <span className="text-white font-bold">A</span>
                        </div>
                        <span className="text-xl font-bold text-primary font-display">AyurSutra</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-text hover:text-primary transition-colors">Home</Link>
                        <Link to="/services" className="text-sm font-medium text-text hover:text-primary transition-colors">Therapies</Link>
                        <Link to="/doctors" className="text-sm font-medium text-text hover:text-primary transition-colors">Doctors</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Link to="/profile">
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors text-text">
                                <User size={20} />
                            </button>
                        </Link>
                        <button className="md:hidden p-2 text-text">
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <footer className="border-t border-gray-100 bg-white py-8 mt-12">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2024 AyurSutra. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
