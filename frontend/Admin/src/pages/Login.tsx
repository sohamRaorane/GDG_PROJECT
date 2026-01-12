import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2, User } from 'lucide-react';

const Login = () => {
    const [isSignUpMode, setIsSignUpMode] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, register, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            setError('');
            if (isSignUpMode) {
                if (!displayName.trim()) {
                    setError('Please enter your full name');
                    return;
                }
                await register(email, password, displayName);
            } else {
                await login(email, password);
            }
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to authenticate. Please check your credentials.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            setError('');
            await signInWithGoogle();
            navigate('/');
        } catch (err) {
            setError('Failed to log in with Google');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* Left Side - Artistic/Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 z-10" />
                <div className="absolute inset-0 z-0">
                    {/* Abstract Pattern */}
                    <svg className="absolute w-full h-full opacity-20 text-indigo-500" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
                    </svg>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-20 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                                <ShieldCheck className="h-8 w-8 text-indigo-400" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Admin Portal</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Manage Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                                Healthcare Ecosystem
                            </span>
                        </h1>
                        <p className="text-lg text-slate-300 max-w-md">
                            Secure access to patient records, appointment scheduling, and comprehensive analytics dashboard.
                        </p>
                    </div>

                    <div className="flex gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                            Secure
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                            Fast
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                            Reliable
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 overflow-y-auto">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="p-3 bg-slate-100 rounded-xl">
                                <ShieldCheck className="h-8 w-8 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {isSignUpMode ? 'Create an account' : 'Welcome back'}
                        </h2>
                        <p className="text-slate-500">
                            {isSignUpMode ? 'Enter your details to register as an admin.' : 'Please enter your details to sign in.'}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                <svg className="h-5 w-5 mr-3" aria-hidden="true" viewBox="0 0 24 24">
                                    <path d="M12.0003 20.45c4.6667 0 8.45-3.7833 8.45-8.45 0-.6083-.0583-1.2083-.1667-1.7917H12.0003v3.3917h4.7917c-.2083 1.1583-1.6333 3.4167-4.7917 3.4167-2.8917 0-5.25-2.3583-5.25-5.25s2.3583-5.25 5.25-5.25c1.2917 0 2.4583.4583 3.375 1.3333l2.5417-2.5417c-1.5833-1.475-3.625-2.375-5.9167-2.375-4.6667 0-8.45 3.7833-8.45 8.45s3.7833 8.45 8.45 8.45z" fill="currentColor" className="text-slate-600 group-hover:text-red-500 transition-colors" />
                                </svg>
                                {isLoading ? 'Connecting...' : `Continue with Google`}
                            </button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500">
                                    {isSignUpMode ? 'Or register with email' : 'Or sign in with email'}
                                </span>
                            </div>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {error && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 animate-fade-in flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {isSignUpMode && (
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            </div>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm bg-slate-50/50 focus:bg-white"
                                                placeholder="John Doe"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Email address
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm bg-slate-50/50 focus:bg-white"
                                            placeholder="admin@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 sm:text-sm bg-slate-50/50 focus:bg-white"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        {isSignUpMode ? 'Creating account...' : 'Signing in...'}
                                    </>
                                ) : (
                                    <>
                                        {isSignUpMode ? 'Create account' : 'Sign in'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="text-center">
                            <p className="text-sm text-slate-600">
                                {isSignUpMode ? 'Already have an account?' : "Don't have an account?"}
                                <button
                                    onClick={() => {
                                        setIsSignUpMode(!isSignUpMode);
                                        setError('');
                                    }}
                                    className="ml-2 font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all"
                                >
                                    {isSignUpMode ? 'Sign in' : 'Sign up now'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
