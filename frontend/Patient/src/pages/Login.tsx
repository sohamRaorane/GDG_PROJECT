import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const Login = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialMode = queryParams.get('mode') === 'signup';

    const [isActive, setIsActive] = useState(initialMode);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const { login, signup, signInWithGoogle } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (queryParams.get('mode') === 'signup') {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [location.search]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            await login(email, password);
            navigate('/patient');
        } catch (err) {
            setError('Failed to log in');
            console.error(err);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setError('');
            await signup(email, password, name);
            navigate('/patient');
        } catch (err) {
            setError('Failed to create an account');
            console.error(err);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            await signInWithGoogle();
            navigate('/patient');
        } catch (err) {
            setError('Failed to log in with Google');
            console.error(err);
        }
    };

    return (
        <div className="login-page-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

                .login-page-wrapper {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Montserrat', sans-serif;
                    height: 100vh;
                    width: 100vw;
                    overflow: hidden;
                    background-color: #fff;
                }

                .page {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    height: 100vh;
                    width: 100vw;
                }

                .left {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #fff;
                    padding: 20px;
                    position: relative;
                }

                .brand-container {
                    position: absolute;
                    top: 30px;
                    left: 40px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 10;
                }

                .brand-logo {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                }

                .brand-name {
                    font-size: 32px;
                    font-weight: 700;
                    background: linear-gradient(to right, #f5d77c, #c87333);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    letter-spacing: 0.5px;
                }

                .container {
                    background-color: #fefffd;
                    border-radius: 30px;
                    box-shadow: 0 35px 35px rgba(0, 0, 0, 0.35);
                    position: relative;
                    overflow: hidden;
                    width: 768px;
                    max-width: 100%;
                    min-height: 480px;
                }

                .container p {
                    font-size: 14px;
                    line-height: 20px;
                    letter-spacing: 0.3px;
                    margin: 20px 0;
                }

                .container span {
                    font-size: 12px;
                }

                .container a {
                    color: #333;
                    font-size: 13px;
                    text-decoration: none;
                    margin: 15px 0 10px;
                }

                .container button {
                    background-color: #c87333;
                    color: #fff;
                    font-size: 12px;
                    padding: 10px 45px;
                    border: 1px solid transparent;
                    border-radius: 8px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    margin-top: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .container button:hover {
                    opacity: 0.9;
                }

                .container button.hidden-toggle-btn {
                    background-color: transparent;
                    border: 1px solid #fff;
                    color: #fff;
                }

                .container form {
                    background-color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    padding: 0 40px;
                    height: 100%;
                }

                .container input {
                    background-color: #eee;
                    border: none;
                    margin: 8px 0;
                    padding: 10px 15px;
                    font-size: 13px;
                    border-radius: 8px;
                    width: 100%;
                    outline: none;
                }

                .form-container {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    transition: all 0.6s ease-in-out;
                }

                .sign-in {
                    left: 0;
                    width: 50%;
                    z-index: 2;
                }

                .container.active .sign-in {
                    transform: translateX(100%);
                }

                .sign-up {
                    left: 0;
                    width: 50%;
                    opacity: 0;
                    z-index: 1;
                }

                .container.active .sign-up {
                    transform: translateX(100%);
                    opacity: 1;
                    z-index: 5;
                    animation: move 0.6s;
                }

                @keyframes move {
                    0%, 49.99% {
                        opacity: 0;
                        z-index: 1;
                    }
                    50%, 100% {
                        opacity: 1;
                        z-index: 5;
                    }
                }

                .social-icons {
                    margin: 20px 0;
                }

                .social-icons a {
                    border: 1px solid #ccc;
                    border-radius: 20%;
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0 3px;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .social-icons a:hover {
                    background-color: #eee;
                }

                .toggle-container {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    width: 50%;
                    height: 100%;
                    overflow: hidden;
                    transition: all 0.6s ease-in-out;
                    border-radius: 150px 0 0 100px;
                    z-index: 1000;
                }

                .container.active .toggle-container {
                    transform: translateX(-100%);
                    border-radius: 0 150px 100px 0;
                }

                .toggle {
                    height: 100%;
                    background: linear-gradient(to right, #f5d77c, #c87333);
                    color: #fff;
                    position: relative;
                    left: -100%;
                    width: 200%;
                    transform: translateX(0);
                    transition: all 0.6s ease-in-out;
                }

                .container.active .toggle {
                    transform: translateX(50%);
                }

                .toggle-panel {
                    position: absolute;
                    width: 50%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    padding: 0 30px;
                    text-align: center;
                    top: 0;
                    transform: translateX(0);
                    transition: all 0.6s ease-in-out;
                }

                .toggle-left {
                    transform: translateX(-200%);
                }

                .container.active .toggle-left {
                    transform: translateX(0);
                }

                .toggle-right {
                    right: 0;
                    transform: translateX(0);
                }

                .container.active .toggle-right {
                    transform: translateX(200%);
                }

                .right {
                    position: relative;
                    overflow: hidden;
                }

                .right video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .error-message {
                    color: #ff4d4d;
                    font-size: 12px;
                    margin-bottom: 10px;
                    text-align: center;
                }

                .mobile-toggle-btn {
                    margin-top: 15px;
                    color: #c87333;
                    font-size: 13px;
                    font-weight: 600;
                    text-decoration: underline;
                    cursor: pointer;
                    display: none;
                }

                @media (max-width: 1024px) {
                    .container {
                        width: 90%;
                    }
                    .brand-container {
                        left: 20px;
                    }
                }

                @media (max-width: 768px) {
                    .page {
                        grid-template-columns: 1fr;
                    }
                    .right {
                        display: none;
                    }
                    .toggle-container {
                        display: none;
                    }
                    .form-container {
                        width: 100%;
                        left: 0;
                        transform: none !important;
                        opacity: 1 !important;
                        z-index: 10 !important;
                        display: none;
                    }
                    .form-container.active-form {
                        display: block;
                    }
                    .mobile-toggle-btn {
                        display: block;
                    }
                }
            `}</style>

            <div className="page">
                {/* LEFT SIDE (CARD) */}
                <div className="left">
                    <div className="brand-container">
                        <img src="/logo.png" alt="AyurSutra Logo" className="brand-logo" />
                        <span className="brand-name">AyurSutra</span>
                    </div>

                    <div className={cn("container", isActive && "active")} id="container">
                        {/* SIGN UP */}
                        <div className={cn("form-container sign-up", isActive && "active-form")}>
                            <form onSubmit={handleSignUp}>
                                <h1>Create Account</h1>
                                <div className="social-icons">
                                    <a onClick={handleGoogleSignIn} className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                                </div>
                                <span>or use your email for registration</span>
                                {error && isActive && <div className="error-message">{error}</div>}
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="submit">Sign Up</button>
                                <div className="mobile-toggle-btn" onClick={() => setIsActive(false)}>
                                    Already have an account? Sign In
                                </div>
                            </form>
                        </div>

                        {/* SIGN IN */}
                        <div className={cn("form-container sign-in", !isActive && "active-form")}>
                            <form onSubmit={handleLogin}>
                                <h1>Sign In</h1>
                                <div className="social-icons">
                                    <a onClick={handleGoogleSignIn} className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                                </div>
                                <span>or use your email password</span>
                                {error && !isActive && <div className="error-message">{error}</div>}
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <a href="#">Forget Your Password?</a>
                                <button type="submit">Sign In</button>
                                <div className="mobile-toggle-btn" onClick={() => setIsActive(true)}>
                                    Don't have an account? Sign Up
                                </div>
                            </form>
                        </div>

                        {/* TOGGLE */}
                        <div className="toggle-container">
                            <div className="toggle">
                                <div className="toggle-panel toggle-left">
                                    <h1>Welcome to AyurSutra!</h1>
                                    <p>Enter your personal details to use all site features</p>
                                    <button className="hidden-toggle-btn" id="login" onClick={() => setIsActive(false)}>Sign In</button>
                                </div>
                                <div className="toggle-panel toggle-right">
                                    <h1>NAMASKAR!!</h1>
                                    <p>Register with your personal details to use all site features</p>
                                    <button className="hidden-toggle-btn" id="register" onClick={() => setIsActive(true)}>Sign Up</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE (VIDEO) */}
                <div className="right">
                    <video autoPlay muted loop playsInline>
                        <source src="/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default Login;
