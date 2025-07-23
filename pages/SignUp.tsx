import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../src/api/auth'; // <-- Only import, do not redefine
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const SignUp: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<{score: number, message: string, color: string}>({score: 0, message: '', color: ''});
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const success = await signup(name, email, password);

        if (success) {
            navigate('/profile');
        } else {
            setError('Could not create account. Please try again.');
        }
        setLoading(false);
    };
    
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

    const handlePasswordChange = (val: string) => {
      setPassword(val);
      setPasswordStrength(assessPasswordStrength(val));
    };

    const inputField = (label: string, type: string, value: string, setter: (val:string)=>void, placeholder: string) => (
         <div className="relative">
            <label className="text-sm font-medium text-gray-600">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => setter(e.target.value)}
                required
                className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-gray-400"
                placeholder={placeholder}
            />
        </div>
    );

    return (
        <AnimatedPage>
            <motion.div
                className="w-full max-w-md p-10 space-y-8 bg-white rounded-xl shadow-lg text-black"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-left">
                    <h1 className="text-3xl font-serif font-bold">Register</h1>
                    <p className="mt-2 text-gray-400">Create your HomeGlam account to get started.</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-6">
                    {inputField("Your Name", "text", name, setName, "Enter your full name")}
                    {inputField("Email", "email", email, setEmail, "Enter your email")}
                    <div className="relative">
                        <label className="text-sm font-medium text-gray-600">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-gray-400 pr-12"
                            placeholder="Create a password"
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
                        {password && (
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
                    
                    <div>
                        <motion.button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-accent-color hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-offset-2 ring-accent-color disabled:opacity-50"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </motion.button>
                    </div>
                </form>

                <p className="text-sm text-center text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-[#22C55E] hover:underline">
                        Login
                    </Link>
                </p>
            </motion.div>
        </AnimatedPage>
    );
};

export default SignUp;