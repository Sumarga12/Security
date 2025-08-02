
import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useNotification } from '../contexts/NotificationContext.tsx';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, ShieldCheckIcon, CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { changePassword } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const [passwordStrength, setPasswordStrength] = useState<{score: number, message: string, color: string}>({score: 0, message: '', color: ''});
    const [showOldPassword, setShowOldPassword] = useState(false);
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
        if (newPassword !== confirmPassword) {
            addNotification('New passwords do not match.', 'error');
            return;
        }
        if (newPassword.length < 8) {
             addNotification('New password must be at least 8 characters long.', 'error');
            return;
        }

        setLoading(true);
        const success = await changePassword(oldPassword, newPassword);
        setLoading(false);

        if (success) {
            setTimeout(() => navigate('/profile'), 1500);
        }
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
                            <h2 className="text-4xl font-bold mb-6">Update Your Password</h2>
                            <p className="text-xl text-green-100 mb-8">
                                Keep your account secure with a strong, unique password. We recommend updating it regularly for better protection.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <ShieldCheckIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Enhanced Security</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <LockClosedIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Account Protection</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <CheckCircleIcon className="w-6 h-6 text-green-200" />
                                    <span className="text-green-100">Easy & Secure Process</span>
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
                                    <LockClosedIcon className="w-8 h-8 text-green-600" />
                                </motion.div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
                                <p className="text-gray-600">Update your password for better security</p>
                            </div>

                            {/* Form */}
                            <motion.form 
                                onSubmit={handleSubmit} 
                                className="space-y-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showOldPassword ? "text" : "password"}
                                            value={oldPassword}
                                            onChange={(e) => setOldPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 pr-12 transition-all duration-200"
                                            placeholder="Enter your current password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                                            onClick={() => setShowOldPassword((prev) => !prev)}
                                            aria-label={showOldPassword ? "Hide password" : "Show password"}
                                        >
                                            {showOldPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            value={newPassword}
                                            onChange={(e) => handleNewPasswordChange(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 pr-12 transition-all duration-200"
                                            placeholder="Create a new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
                                            onClick={() => setShowNewPassword((prev) => !prev)}
                                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                                        >
                                            {showNewPassword ? (
                                                <EyeSlashIcon className="h-5 w-5" />
                                            ) : (
                                                <EyeIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    {newPassword && (
                                        <motion.div 
                                            className="mt-3"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                                                <div
                                                    className="h-2 rounded-full transition-all duration-300"
                                                    style={{ 
                                                        width: `${passwordStrength.score * 20}%`, 
                                                        background: passwordStrength.color 
                                                    }}
                                                />
                                            </div>
                                            <div className="text-sm mt-2" style={{ color: passwordStrength.color }}>
                                                {passwordStrength.message}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                <div className="grid grid-cols-2 gap-1">
                                                    <div className="flex items-center">
                                                        <CheckCircleIcon className={`w-3 h-3 mr-1 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                                                        <span>8+ characters</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CheckCircleIcon className={`w-3 h-3 mr-1 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                                        <span>Uppercase letter</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CheckCircleIcon className={`w-3 h-3 mr-1 ${/[a-z]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                                        <span>Lowercase letter</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CheckCircleIcon className={`w-3 h-3 mr-1 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                                        <span>Number</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CheckCircleIcon className={`w-3 h-3 mr-1 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                                                        <span>Special character</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <CheckCircleIcon className={`w-3 h-3 mr-1 ${newPassword.length <= 32 ? 'text-green-500' : 'text-gray-300'}`} />
                                                        <span>Max 32 chars</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-500 pr-12 transition-all duration-200"
                                            placeholder="Confirm your new password"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
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
                                            Updating Password...
                                        </div>
                                    ) : (
                                        'Update Password'
                                    )}
                                </motion.button>
                            </motion.form>

                            {/* Footer */}
                            <motion.div 
                                className="text-center mt-8 pt-6 border-t border-gray-200"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                            >
                                <button 
                                    onClick={() => navigate('/profile')}
                                    className="inline-flex items-center text-sm font-semibold text-green-600 hover:text-green-700 transition-colors duration-200"
                                >
                                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                    Back to Profile
                                </button>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </AnimatedPage>
    );
};

export default ChangePassword;