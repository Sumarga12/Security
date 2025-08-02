import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import ReCAPTCHA from 'react-google-recaptcha';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [mfaStep, setMfaStep] = useState(false);
    const [mfaCode, setMfaCode] = useState('');
    const [mfaError, setMfaError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const { login, verifyMfa } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const signupMessage = location.state?.message;
    
    // Debug environment variable
    console.log('CAPTCHA Site Key:', (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Login form submitted, CAPTCHA token:', !!captchaToken);
        if (!captchaToken) {
            setMfaError('Please complete the CAPTCHA.');
            return;
        }
        setLoading(true);
        setMfaError('');

        const result = await login(email, password, rememberMe, captchaToken || undefined);

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
            <div className="min-h-screen flex">
                {/* Left Side - Image */}
                <motion.div 
                    className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                            <p className="text-xl text-green-100 mb-8">
                                Access your HomeCleaning account and manage your cleaning services with ease.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <ShieldCheckIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Secure & Protected</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <LockClosedIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">24/7 Account Access</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <UserIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Personalized Experience</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div 
                    className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="w-full max-w-md">
                        <motion.div 
                            className="bg-white rounded-2xl shadow-xl p-8"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            {/* Header */}
                            <div className="text-center mb-8">
                                <motion.div 
                                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <LockClosedIcon className="w-8 h-8 text-green-600" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
                                <p className="text-gray-600">Welcome back! Please enter your details.</p>
                            </div>

                            {/* Success Message */}
                            {signupMessage && (
                                <motion.div 
                                    className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl text-center mb-6"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {signupMessage}
                                </motion.div>
                            )}

                            {/* Login Form */}
                            {!mfaStep ? (
                                <motion.form 
                                    onSubmit={handleLogin} 
                                    className="space-y-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <div className="relative">
                                            <input
                                                id="email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 transition-all duration-200"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 pr-12 transition-all duration-200"
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
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
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                                checked={rememberMe}
                                                onChange={() => setRememberMe(!rememberMe)}
                                            />
                                            <span className="ml-2 text-sm text-gray-600">Remember me</span>
                                        </label>
                                        <Link to="/forgot-password" className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors duration-200">
                                            Forgot password?
                                        </Link>
                                    </div>

                                    <ReCAPTCHA
                                        sitekey={(import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY || "6Lf7fpYrAAAAAG44CEv6E9rQNDKcyw9WmGxd-2v8"}
                                        onChange={(token: string | null) => {
                                            console.log('CAPTCHA token received:', !!token, 'Length:', token ? token.length : 0);
                                            setCaptchaToken(token);
                                        }}
                                        onExpired={() => {
                                            console.log('CAPTCHA expired');
                                            setCaptchaToken(null);
                                        }}
                                        onError={() => {
                                            console.log('CAPTCHA error occurred');
                                        }}
                                        className="my-4"
                                    />

                                    <motion.button
                                        type="submit"
                                        className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Signing in...
                                            </div>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </motion.button>
                                </motion.form>
                            ) : (
                                <motion.form 
                                    onSubmit={handleVerifyMfa} 
                                    className="space-y-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h2>
                                        <p className="text-gray-600">Enter the 6-digit code sent to your device</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                                        <input
                                            id="mfaCode"
                                            type="text"
                                            value={mfaCode}
                                            onChange={(e) => setMfaCode(e.target.value)}
                                            required
                                            maxLength={6}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 tracking-widest text-center text-lg"
                                            placeholder="000000"
                                            autoFocus
                                        />
                                        {mfaError && (
                                            <motion.div 
                                                className="text-sm text-red-600 mt-2 text-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                {mfaError}
                                            </motion.div>
                                        )}
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                        disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.02 }}
                                        whileTap={{ scale: loading ? 1 : 0.98 }}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                                Verifying...
                                            </div>
                                        ) : (
                                            'Verify Code'
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}

                            {/* Footer */}
                            <motion.div 
                                className="text-center mt-8 pt-6 border-t border-gray-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-200">
                                        Sign up
                                    </Link>
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default Login;