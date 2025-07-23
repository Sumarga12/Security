
import React, { useState } from 'react';
import AnimatedPage from '../components/AnimatedPage.tsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import { Service } from '../types.ts';
import { motion } from 'framer-motion';
import Confetti from '../components/Confetti.tsx';
import { appointmentsAPI } from '../src/api/appointments'; // Add this import at the top

const Appointment: React.FC = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const { user } = useAuth();
    
    // Handle both single service and cart items
    const singleService: Service | undefined = state?.service;
    const cartItems: Service[] | undefined = state?.cartItems;

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        date: '',
        time: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [booked, setBooked] = useState(false);

    if (!singleService && (!cartItems || cartItems.length === 0)) {
        return (
            <AnimatedPage>
                <div className="text-center py-20">
                    <h2 className="text-2xl font-serif">No cleaning service selected.</h2>
                    <p className="mt-2">Please select a cleaning service first.</p>
                    <button onClick={() => navigate('/services')} className="mt-4 px-6 py-2 bg-accent-color text-white font-bold rounded-lg">Go to Cleaning Services</button>
                </div>
            </AnimatedPage>
        );
    }
    
    const itemsToBook = singleService ? [singleService] : cartItems || [];
    const totalItems = itemsToBook.length;
    const totalPrice = itemsToBook.reduce((sum, item) => sum + item.price, 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // For single service booking
            if (singleService) {
                const appointmentData = {
                    serviceId: singleService.id,
                    serviceName: singleService.name,
                    date: formData.date,
                    time: formData.time,
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    message: formData.message,
                    totalPrice: singleService.price,
                };
                const createdAppointment = await appointmentsAPI.createAppointment(appointmentData);
                navigate('/payment', { state: { items: itemsToBook, appointmentDetails: createdAppointment, totalPrice: totalPrice } });
            }
            // For cart booking (if you want to support multiple at once, loop here)
            // else if (cartItems && cartItems.length > 0) {
            //     for (const item of cartItems) {
            //         const appointmentData = { ...same as above for each item... };
            //         await appointmentsAPI.createAppointment(appointmentData);
            //     }
            // }

            setBooked(true);
            if (cartItems) {
                clearCart();
            }
            setTimeout(() => {
                // This part of the code is now handled by the payment page redirect
            }, 3000);
        } catch (error) {
            // Show error notification if needed
            setLoading(false);
            alert('Failed to book appointment. Please try again.');
        }
    };

    if (booked) {
        return (
            <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#F7FFF7]">
                <Confetti />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-serif text-black">Booking Confirmed!</h1>
                    <p className="mt-2 text-lg text-black/80">Redirecting to payment...</p>
                </motion.div>
            </div>
        )
    }
    
    const inputStyle = "w-full px-4 py-3 bg-white border border-[#22C55E]/40 rounded-lg focus:outline-none focus:ring-2 ring-accent-color text-black placeholder:text-black/50";


    return (
        <AnimatedPage>
            <div className="min-h-screen flex items-center justify-center bg-[#F6FAF7] py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-2xl p-10 space-y-8 bg-white rounded-2xl shadow-2xl border border-[#E0F2EF] relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#22C55E] rounded-t-2xl" />
                    <div className="text-left relative z-10">
                        <h1 className="text-3xl font-serif font-bold text-[#22C55E]">Appointment Form</h1>
                        <p className="mt-2 text-black/80">
                            You're booking:
                            <span className="font-bold text-[#22C55E]">
                                {totalItems > 1 ? ` ${totalItems} cleaning services` : ` ${itemsToBook[0].name}`}
                            </span>
                             for a total of <span className="font-bold text-[#22C55E]">Rs{totalPrice}</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" required className={inputStyle} />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className={inputStyle} />
                             <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required className={inputStyle} />
                            <select name="serviceName" required className={inputStyle} disabled>
                                <option>{totalItems > 1 ? `${totalItems} cleaning services selected` : itemsToBook[0].name}</option>
                            </select>
                            <input type="date" name="date" value={formData.date} onChange={handleChange} required className={`${inputStyle} `} />
                            <input type="time" name="time" value={formData.time} onChange={handleChange} required className={inputStyle} />
                        </div>
                        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Any notes for us?" rows={3} className={inputStyle}></textarea>
                        
                        <motion.button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#22C55E] hover:bg-[#15803D] focus:outline-none focus:ring-2 focus:ring-offset-2 ring-accent-color disabled:opacity-50"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                        >
                            {loading ? 'Booking...' : 'Book Now'}
                        </motion.button>
                    </form>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default Appointment;
