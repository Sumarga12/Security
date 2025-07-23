import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mfaStep, setMfaStep] = useState(false);
    const [mfaCode, setMfaCode] = useState('');
    const [mfaError, setMfaError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, verifyMfa } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const signupMessage = location.state?.message;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMfaError('');

        const result = await login(email, password, rememberMe);

        if (result === 'mfa') {
            setMfaStep(true);
        } else if (result) {
            navigate('/profile');
            navigate('/', { replace: true });
        }
        setLoading(false);
    };

    const handleVerifyMfa = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMfaError('');
        const success = await verifyMfa(email, mfaCode, rememberMe);
        if (success) {
            setMfaStep(false);
            setMfaCode('');
            navigate('/profile');
            navigate('/', { replace: true });
        } else {
            setMfaError('Invalid or expired code. Please try again.');
        }
        setLoading(false);
    };

    return (
        <AnimatedPage>
            <motion.div
                className="w-full max-w-md p-10 space-y-8 bg-white rounded-xl shadow-lg text-black"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-left">
                    <h1 className="text-3xl font-serif font-bold">Login</h1>
                    <p className="mt-2 text-gray-400">Welcome back! Please login to your account.</p>
                </div>

                {signupMessage && (
                    <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-lg text-center">
                        {signupMessage}
                    </div>
                )}

                {!mfaStep ? (
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-400">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-gray-400"
                                placeholder="Your Email"
                            />
                        </div>
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-400">Password</label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-gray-400 pr-12"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                tabIndex={-1}
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-[#22C55E] focus:ring-[#22C55E]"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <span className="ml-2 text-gray-400">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="font-medium text-[#22C55E] hover:underline">Forgot password?</Link>
                        </div>
                        <div>
                            <motion.button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-color hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-offset-2 ring-accent-color disabled:opacity-50"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </motion.button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyMfa} className="space-y-6">
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-400">Verification Code</label>
                            <input
                                id="mfaCode"
                                type="text"
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value)}
                                required
                                maxLength={6}
                                className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-gray-400 tracking-widest text-center text-lg"
                                placeholder="Enter 6-digit code"
                                autoFocus
                            />
                            {mfaError && <div className="text-xs text-red-500 mt-1">{mfaError}</div>}
                        </div>
                        <div>
                            <motion.button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-color hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-offset-2 ring-accent-color disabled:opacity-50"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? 'Verifying...' : 'Verify Code'}
                            </motion.button>
                        </div>
                    </form>
                )}
                <p className="text-sm text-center text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-[#22C55E] hover:underline">
                        Register
                    </Link>
                </p>
            </motion.div>
        </AnimatedPage>
    );
};

export default Login;