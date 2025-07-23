import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { authAPI } from '../src/api/auth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState<{score: number, message: string, color: string}>({score: 0, message: '', color: ''});
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength assessment (should match backend policy)
    function assessPasswordStrength(password: string) {
      const minLength = 8;
      const maxLength = 32;
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      let score = 0;
      if (password.length >= minLength) score++;
      if (hasUpper) score++;
      if (hasLower) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;
      let message = '';
      let color = '';
      if (password.length === 0) {
        message = '';
        color = '';
      } else if (score <= 2) {
        message = 'Weak password';
        color = '#ef4444'; // red
      } else if (score === 3 || score === 4) {
        message = 'Moderate password';
        color = '#f59e42'; // orange
      } else if (score === 5 && password.length <= maxLength) {
        message = 'Strong password';
        color = '#22C55E'; // green
      } else if (password.length > maxLength) {
        message = `Password too long (max ${maxLength} chars)`;
        color = '#ef4444';
      }
      return { score, message, color };
    }

    const handleNewPasswordChange = (val: string) => {
      setNewPassword(val);
      setPasswordStrength(assessPasswordStrength(val));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            addNotification('Invalid reset link. Please request a new one.', 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            addNotification('Passwords do not match.', 'error');
            return;
        }

        if (newPassword.length < 8) {
            addNotification('Password must be at least 8 characters long.', 'error');
            return;
        }

        setLoading(true);
        try {
            await authAPI.resetPassword(token, newPassword);
            addNotification('Password reset successful! Please log in with your new password.', 'success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (error: any) {
            addNotification(error.message || 'Password reset failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
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
                    <h1 className="text-3xl font-serif font-bold">Reset Password</h1>
                    <p className="mt-2 text-black/80">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <label className="text-sm font-medium text-black">New Password</label>
                        <input
                            id="password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => handleNewPasswordChange(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-black/80 pr-12"
                            placeholder="New Password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                            onClick={() => setShowNewPassword((prev) => !prev)}
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                        >
                            {showNewPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                        {newPassword && (
                          <div className="mt-2">
                            <div className="w-full h-2 rounded bg-gray-200">
                              <div
                                className="h-2 rounded"
                                style={{ width: `${passwordStrength.score * 20}%`, background: passwordStrength.color, transition: 'width 0.3s' }}
                              />
                            </div>
                            <div className="text-xs mt-1" style={{ color: passwordStrength.color }}>{passwordStrength.message}</div>
                            <ul className="text-xs text-gray-500 mt-1 list-disc ml-4">
                              <li>8-32 characters</li>
                              <li>At least 1 uppercase, 1 lowercase, 1 number, 1 special character</li>
                            </ul>
                          </div>
                        )}
                    </div>
                    <div className="relative">
                        <label className="text-sm font-medium text-black">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-black/80 pr-12"
                            placeholder="Confirm New Password"
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                            tabIndex={-1}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                    <div>
                        <motion.button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-color hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-offset-2 ring-accent-color disabled:opacity-50"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </motion.button>
                    </div>
                </form>

                <p className="text-sm text-center text-black/80">
                    Remember your password?{' '}
                    <button 
                        onClick={() => navigate('/login')} 
                        className="font-medium text-black hover:underline"
                    >
                        Login
                    </button>
                </p>
            </motion.div>
        </AnimatedPage>
    );
};

export default ResetPassword; 