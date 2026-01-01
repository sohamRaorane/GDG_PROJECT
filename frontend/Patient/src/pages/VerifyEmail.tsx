import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { MailCheck, RefreshCcw } from 'lucide-react';

const VerifyEmail = () => {
    const { currentUser, sendVerificationEmail } = useAuth();
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleResend = async () => {
        try {
            setMessage('');
            setError('');
            setLoading(true);
            await sendVerificationEmail();
            setMessage('Verification email sent!');
        } catch (err) {
            setError('Failed to send verification email.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <MailCheck className="h-16 w-16 text-green-600" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Check your email
                </h2>
                <div className="mt-2 text-center text-gray-600">
                    <p>We've sent a verification link to:</p>
                    <p className="font-medium text-gray-900 mt-1">{currentUser?.email}</p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <p className="text-sm text-gray-700 mb-6">
                        Click the link in the email to verify your account. If you don't see it, check your spam folder.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={handleResend}
                            disabled={loading}
                            className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                        >
                            <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Sending...' : 'Resend Verification Email'}
                        </button>

                        {message && <p className="text-green-600 text-sm">{message}</p>}
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <div className="pt-4 border-t border-gray-200">
                            <Link
                                to="/"
                                className="text-sm font-medium text-green-600 hover:text-green-500"
                            >
                                I verified my email, go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
