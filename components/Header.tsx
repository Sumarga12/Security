
import React, { useState, FormEvent } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircleIcon, MagnifyingGlassIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';


const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `relative text-sm font-medium transition-colors text-black hover:text-black ${isActive ? 'text-black' : ''}`
        }
    >
        {({ isActive }) => (
            <>
                {children}
                {isActive && (
                    <motion.div
                        className="absolute bottom-[-6px] left-0 right-0 h-[3px] bg-[#22C55E]"
                        layoutId="underline"
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                )}
            </>
        )}
    </NavLink>
);

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };
    
    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <header className="sticky top-0 z-50 w-full bg-[#F7FFF7]/80 backdrop-blur-sm border-b border-[#166534]/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                     <div className="flex-1 flex justify-start">
                        <Link to="/" className="text-3xl font-serif font-bold text-black">
                            HomeCleaning
                        </Link>
                    </div>

                    {/* Navigation or Search */}
                     <div className="flex-1 flex justify-center items-center">
                        <AnimatePresence mode="wait">
                            {!isSearchOpen ? (
                                <motion.nav 
                                    key="nav"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="hidden md:flex items-center space-x-10"
                                >
                                    <NavItem to="/">Home</NavItem>
                                    <NavItem to="/services">Services</NavItem>
                                    <NavItem to="/about">About Us</NavItem>
                                    <NavItem to="/contact">Contact Us</NavItem>
                                </motion.nav>
                            ) : (
                                <motion.div
                                    key="search"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: '100%' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full max-w-sm"
                                >
                                    <form onSubmit={handleSearchSubmit} className="relative w-full">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search services..."
                                            className="w-full bg-white/50 border border-[#4E443C]/20 rounded-full py-2 pl-4 pr-10 focus:ring-2 ring-accent-color focus:outline-none"
                                            autoFocus
                                        />
                                        <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Icons */}
                    <div className="flex-1 flex justify-end items-center space-x-4">
                       <AnimatePresence mode="wait">
                         {!isSearchOpen && (
                              <motion.div 
                                key="icons"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center space-x-4"
                            >
                                <Link to="/cart" className="relative">
                                    <ShoppingBagIcon className="h-6 w-6 text-[#4E443C] hover:text-[#22C55E] cursor-pointer" />
                                    {cartCount > 0 && (
                                         <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent-color text-xs font-bold text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </Link>
                                {user ? (
                                    <div className="relative group">
                                        <Link to="/profile" className="flex items-center gap-2">
                                            <img src={`https://i.pravatar.cc/150?u=${user.email}`} alt="user" className="h-8 w-8 rounded-full cursor-pointer"/>
                                            <span className="text-sm font-medium text-black">{user.name.split(' ')[0]}</span>
                                        </Link>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                                            <div className="px-4 py-2 text-sm text-black">{user.name}</div>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-black hover:bg-gray-100">My Profile</Link>
                                            <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-black hover:bg-gray-100">Logout</button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to="/login">
                                        <UserCircleIcon className="h-8 w-8 text-[#4E443C] hover:text-[#22C55E]" />
                                    </Link>
                                )}
                            </motion.div>
                         )}
                        </AnimatePresence>
                        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="transition-colors z-10">
                             {isSearchOpen ? <XMarkIcon className="h-6 w-6 text-[#4E443C] hover:text-[#22C55E]" /> : <MagnifyingGlassIcon className="h-6 w-6 text-[#4E443C] hover:text-[#22C55E]" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
