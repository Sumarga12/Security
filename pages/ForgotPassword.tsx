
import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
            <motion.div
                className="w-full max-w-md p-10 space-y-8 bg-white rounded-xl shadow-lg text-black"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-left">
                    <h1 className="text-3xl font-serif font-bold">Forgot Password</h1>
                    <p className="mt-2 text-black/80">Enter your email and we'll send you a link to reset your password.</p>
                </div>

                {submitted ? (
                    <div className="text-center text-green-300 bg-green-500/20 p-4 rounded-lg">
                        <p>If an account with that email exists, a reset link has been sent.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                             <label className="text-sm font-medium text-black">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-black/80"
                                placeholder="Your Email"
                            />
                        </div>
                        <div>
                            <motion.button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-color hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-offset-2 ring-accent-color disabled:opacity-50"
                                disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.02 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </motion.button>
                        </div>
                    </form>
                )}

                <p className="text-sm text-center text-black/80">
                    Remember your password?{' '}
                    <Link to="/login" className="font-medium text-black hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </AnimatedPage>
    );
};

export default ForgotPassword;