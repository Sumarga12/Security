
import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyIcon, ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { requestPasswordReset } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await requestPasswordReset(email);
        setLoading(false);
        setSubmitted(true);
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
                            <h2 className="text-4xl font-bold mb-6">Reset Your Password</h2>
                            <p className="text-xl text-green-100 mb-8">
                                Don't worry! It happens to the best of us. We'll help you get back to managing your cleaning services.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Secure Password Reset</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <KeyIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Quick & Easy Process</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Instant Email Delivery</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent"></div>
                </motion.div>

                {/* Right Side - Form */}
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
                                    <KeyIcon className="w-8 h-8 text-green-600" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                                <p className="text-gray-600">Enter your email and we'll send you a reset link</p>
                            </div>

                            {/* Success Message */}
                            {submitted ? (
                                <motion.div 
                                    className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl text-center mb-6"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex items-center justify-center mb-2">
                                        <CheckCircleIcon className="w-6 h-6 text-green-600 mr-2" />
                                        <span className="font-semibold">Reset Link Sent!</span>
                                    </div>
                                    <p className="text-sm">
                                        If an account with that email exists, a password reset link has been sent to your email address.
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    onSubmit={handleSubmit} 
                                    className="space-y-6"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 transition-all duration-200"
                                            placeholder="Enter your email address"
                                        />
                                    </div>

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
                                                Sending Reset Link...
                                            </div>
                                        ) : (
                                            'Send Reset Link'
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
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                    Back to Sign In
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default ForgotPassword;