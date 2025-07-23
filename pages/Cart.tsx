
import React from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useCart } from '../contexts/CartContext.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const Cart: React.FC = () => {
    const { cartItems, removeFromCart, totalPrice, cartCount } = useCart();
    const navigate = useNavigate();
    
    const handleCheckout = () => {
        navigate('/appointment', { state: { cartItems } });
    };

    return (
        <AnimatedPage>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl md:text-5xl font-serif text-center text-black mb-12">Your Cart</h1>
                {cartCount > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 space-y-4">
                            <AnimatePresence>
                                {cartItems.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                                        className="flex items-center justify-between p-4 border-b border-gray-200"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                                            <div>
                                                <h3 className="font-semibold text-black">{item.name}</h3>
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-6">
                                            <p className="font-semibold text-black">Rs{item.price}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                        <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 sticky top-28">
                             <h2 className="text-2xl font-serif text-black border-b pb-4">Order Summary</h2>
                             <div className="space-y-2 mt-4">
                                <div className="flex justify-between text-black/90">
                                    <span>Subtotal</span>
                                    <span>Rs{totalPrice}</span>
                                </div>
                                 <div className="flex justify-between text-black/90">
                                    <span>Taxes & Fees</span>
                                    <span>Calculated at checkout</span>
                                </div>
                                <div className="pt-4 border-t mt-4 flex justify-between font-bold text-lg text-black">
                                    <span>Total</span>
                                    <span>Rs{totalPrice}</span>
                                </div>
                             </div>
                             <motion.button
                                onClick={handleCheckout}
                                className="w-full mt-6 py-3 px-6 bg-accent-color text-white font-bold rounded-lg shadow-lg hover:bg-[#15803D] transition-colors duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                             >
                                Proceed to Checkout
                             </motion.button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                            <ShoppingBagIcon className="w-24 h-24 mx-auto text-gray-300" />
                            <h2 className="text-2xl font-serif mt-4 text-black">Your cart is empty</h2>
                            <p className="text-black/80 mt-2">Looks like you haven't added any cleaning services yet.</p>
                             <Link to="/services">
                                <motion.button 
                                    className="mt-6 inline-flex items-center px-8 py-3 bg-accent-color text-white font-bold rounded-full shadow-lg hover:bg-[#15803D] transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Explore Cleaning Services
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </AnimatedPage>
    );
};

export default Cart;
